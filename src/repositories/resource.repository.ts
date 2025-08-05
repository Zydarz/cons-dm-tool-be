import { Inject } from '@nestjs/common';
import { CreateResourceDto } from '../modules/resources/dto/requests/create-resource-dto';
import { default as ResourceEntity } from '../entities/resource.entity';
import { ResourceNS } from '../modules/resources/interfaces/resource';
import moment from 'moment';
import { col, fn, json, Op, Sequelize, Transaction, WhereOptions } from 'sequelize';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import _, { isEmpty, isEqual, isNil } from 'lodash';
import { OverResourceDto } from '../modules/resources/dto/responses/over-resource-dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { UserResourceDto } from '../modules/resources/dto/requests/user-resource-dto';
import { FindUserDifferentProjectDto } from '../modules/resources/dto/requests/find-user-different-project-dto';
import { ResourceDto } from '../modules/resources/dto/responses/resource-dto';
import { default as PositionEntity } from '../entities/position.entity';
import { RequestResourceDto } from '../modules/resources/dto/requests/request-resource-update-dto';
import { CreateUserProjectDto } from '../modules/user-projects/dto/requests/create-user-project-dto';
import { AcAndTcPercentTotalDto } from '../modules/resources/dto/responses/ac-tc-percent-total-dto';
import { FilterUserSummaryDto } from '../modules/resources/dto/requests/filter-user-summary-dto';
import { default as ProjectEntity } from '../entities/project.entity';
import { default as UserEntity } from '../entities/users.entity';
import { default as UserSalariesEntity } from '../entities/user-salaries.entity';
import { DaysOffNS } from '../modules/days-off/interface/days-off.interface';
import { DeleteResourceDto } from '../modules/resources/dto/requests/delete-resource-dto';

import { CHECKDAYOFF } from '../common/constants/unit';
import { default as ProjectRankEntity } from '../entities/project-rank.entity';
import { ParamUpdateDayOffDto } from '../modules/resources/dto/requests/param-daysoff-dto';
import { default as DaysOffEntity } from '../entities/days-off.entity';
import { ParamPositionIdsDto } from '../modules/resources/dto/requests/param-position-ids.dto';
import { ResourcePositionDto } from '../modules/resources/dto/responses/resource-position-dto';
export class ResourceRepository implements ResourceNS.IResourceRepository {
  constructor(
    @Inject(ResourceEntity.name) private readonly resourceEntity: typeof ResourceEntity,
    @Inject(ProjectEntity.name) private readonly projectEntity: typeof ProjectEntity,
    @Inject('IDaysOffRepository') private readonly daysOffRepository: DaysOffNS.IDaysOffRepository,
  ) {}

  private computeResourceByUser(
    userId: string,
    resource: ResourceEntity[],
    params: RequestResourceDto[],
    update?: boolean,
    projectId?: number,
  ): Array<OverResourceDto> {
    let results: Array<{ userId: string; time: Date; total: number }> = [];
    const resultsOvers: Array<OverResourceDto> = [];
    if (!isNil(resource) && !isEmpty(resource)) {
      const allDate = [...new Set(resource.map((u) => u.date))];
      results = allDate.reduce((array: Array<{ userId: string; time: Date; total: number }>, d: Date) => {
        const obj = {
          userId,
          time: d,
          total: params.reduce((total, prev) => {
            if (d >= new Date(prev.startDate) && d <= new Date(prev.endDate)) {
              total += Number(prev.acPercent) + Number(prev.tcPercent);
            }
            return total;
          }, +0),
        };

        if (!update) {
          obj.total = resource.reduce(
            (total: number, prev: ResourceEntity) =>
              isEqual(prev.date, obj.time) ? (total += Number(prev.acPercent) + Number(prev.tcPercent)) : +total,
            +obj.total,
          );
        } else {
          obj.total = resource.reduce(
            (total: number, prev: ResourceEntity) =>
              isEqual(prev.date, obj.time) && projectId !== prev.userProject?.projectId
                ? (total += Number(prev.acPercent) + Number(prev.tcPercent))
                : +total,
            +obj.total,
          );
        }

        return obj.total > 100 ? [...array, ...[obj]] : array;
      }, []);
    }
    const data = _(results)
      .groupBy('total')
      .map((group, number) => ({
        number,
        children: _.map(group, ({ total: number, userId, time }) => ({ number, userId, time })),
      }))
      .value();
    data.map((d) => {
      const resultsOver = new OverResourceDto();
      resultsOver.total = +d.number;
      let isFirst = true;
      let endDate: Date = d.children[0]?.time;
      d.children.map((chil, idx) => {
        resultsOver.userId = chil.userId;
        if (isFirst) {
          resultsOver.startDate = chil.time;
        }
        isFirst = false;
        endDate = chil.time;
        if (endDate < d.children[idx - 1]?.time) {
          endDate = d.children[idx - 1]?.time;
        }
      });
      resultsOver.endDate = endDate;
      resultsOvers.push(resultsOver);
    });
    return resultsOvers;
  }

  async checkOverResource(createResourceDto: CreateResourceDto): Promise<OverResourceDto[]> {
    const results: Array<OverResourceDto> = [];
    for (const createResource of createResourceDto.resources) {
      const userResources = await this.findAllDifferentProject({
        userId: createResource.userId,
        projectId: createResource.projectId,
        startDate: createResource.startDate,
        endDate: createResource.endDate,
        positionId: createResource.positionId,
      });
      const resourceByUser = createResourceDto.resources
        .filter((c) => c.userId === createResource.userId)
        .map((newObj) => ({
          currentPositionId: newObj.positionId,
          newPositionId: newObj.positionId,
          projectRankId: newObj.projectRankId,
          startDate: newObj.startDate,
          endDate: newObj.endDate,
          acPercent: newObj.acPercent,
          tcPercent: newObj.tcPercent,
          note: newObj.note,
        }));
      const result = this.computeResourceByUser(createResource.userId, userResources, resourceByUser);
      results.push(...result);
    }
    return results;
  }

  async addResource(userProjectId: number, userResource: UserResourceDto): Promise<SuccessResponseDto> {
    const startDate = moment(userResource.startDate, 'YYYY/MM/DD');
    const endDate = moment(userResource.endDate, 'YYYY/MM/DD');
    const daysoff = await this.daysOffRepository.getDaysOff();
    const dayDiff = endDate.diff(startDate, 'days') + 1;
    for (let i = 0; i < dayDiff; i++) {
      const dateResouse = moment(new Date(userResource.startDate)).add('days', i);
      const day = dateResouse.day();
      if (![0, 6].includes(day)) {
        await this.resourceEntity.create({
          userProjectId,
          positionId: userResource.positionId,
          projectRankId: userResource.projectRankId,
          date: dateResouse.toISOString(),
          acPercent: userResource.acPercent,
          tcPercent: userResource.tcPercent,
          note: userResource.note,
        });
      }
    }
    await Promise.all(
      daysoff.map(async (day) => {
        await this.resourceEntity.update(
          { checkDayoff: CHECKDAYOFF },
          {
            where: {
              date: day.date,
            },
          },
        );
        await this.resourceEntity.destroy({
          where: {
            date: day.date,
          },
        });
      }),
    );
    return new SuccessResponseDto(true);
  }

  async checkResourceOnlyUser(
    userId: string,
    projectId: number,
    updateResourceDto: RequestResourceDto[],
  ): Promise<OverResourceDto[]> {
    const results: Array<OverResourceDto> = [];
    for (const updateResource of updateResourceDto) {
      const userResources = await this.findAllDifferentProject({
        userId,
        projectId,
        startDate: updateResource.startDate,
        endDate: updateResource.endDate,
        positionId: updateResource.newPositionId,
      });
      const result = this.computeResourceByUser(userId, userResources, updateResourceDto, true, projectId);
      results.push(...result);
    }
    return results;
  }
  async findAllDifferentProject(findUserDifferentProjectDto: FindUserDifferentProjectDto): Promise<ResourceEntity[]> {
    const diffPosition = await this.findResourceDifferentPosition(findUserDifferentProjectDto);
    const diffProject = await this.findResourceDifferentProject(findUserDifferentProjectDto);
    const resourceIds = [...diffPosition, ...diffProject];
    return await this.resourceEntity.findAll({
      where: {
        id: { [Op.in]: resourceIds },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
        },
      ],
    });
  }

  async updateResourceUser(
    userId: string,
    projectId: number,
    updateResourceDto: RequestResourceDto[],
    userProjectId: number,
    edit?: string,
  ): Promise<boolean> {
    if (edit === 'week') {
      await Promise.all([
        ...updateResourceDto.map((updateResource) => {
          const startDate = moment(updateResource.startDate).startOf('day').toDate();
          const endDate = moment(updateResource.endDate).endOf('day').toDate();
          return this.resourceEntity.destroy({
            where: {
              userProjectId,
              positionId: updateResource.currentPositionId,
              date: { [Op.between]: [startDate, endDate] },
            },
            force: true,
          });
        }),
      ]);
    } else {
      await Promise.all([
        ...updateResourceDto.map((updateResource) =>
          this.resourceEntity.destroy({
            where: {
              userProjectId,
              positionId: updateResource.currentPositionId,
            },
            force: true,
          }),
        ),
      ]);
    }
    for (const updateResource of updateResourceDto) {
      const userResource = {
        userId,
        projectId,
        startDate: updateResource.startDate,
        endDate: updateResource.endDate,
        positionId: updateResource.newPositionId,
        projectRankId: updateResource.projectRankId,
        acPercent: updateResource.acPercent,
        tcPercent: updateResource.tcPercent,
        note: updateResource.note,
      };
      await this.addResource(userProjectId, userResource);
    }
    return true;
  }

  async detailResourceUserProject(params: CreateUserProjectDto): Promise<ResourceDto[]> {
    const { userId, projectId } = params;
    const userResource = await this.resourceEntity.findAll({
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            [Op.and]: {
              userId: { [Op.like]: userId },
              projectId,
            },
          },
        },
      ],
    });
    return userResource.toDtos();
  }

  async getResourceOfUserProject(
    params: CreateUserProjectDto,
    filter: {
      startDate: Date;
      endDate: Date;
    },
  ): Promise<ResourceEntity[]> {
    const { userId, projectId } = params;
    const startDate = moment(new Date(filter.startDate)).startOf('date');
    const endDate = moment(new Date(filter.endDate)).endOf('date');
    const userResources = await this.resourceEntity.findAll({
      where: {
        date: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            userId,
            projectId,
          },
        },
        {
          model: PositionEntity,
          as: 'position',
        },
      ],
    });
    return userResources;
  }

  async findResourceDifferentPosition(findUserDifferentProjectDto: FindUserDifferentProjectDto): Promise<number[]> {
    const startDate = moment(findUserDifferentProjectDto.startDate).startOf('day').toISOString();
    const endDate = moment(findUserDifferentProjectDto.endDate).endOf('day').toISOString();
    const resourceEntity = await this.resourceEntity.findAll({
      where: {
        [Op.and]: {
          date: { [Op.between]: [startDate, endDate] },
          positionId: { [Op.not]: findUserDifferentProjectDto.positionId },
        },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            [Op.and]: {
              userId: { [Op.like]: findUserDifferentProjectDto.userId },
              projectId: findUserDifferentProjectDto.projectId,
            },
          },
        },
      ],
      attributes: ['id'],
      group: ['id'],
    });
    return resourceEntity.map((e) => e.id);
  }

  async findResourceDifferentProject(findUserDifferentProjectDto: FindUserDifferentProjectDto): Promise<number[]> {
    const startDateStr = moment(findUserDifferentProjectDto.startDate).startOf('day').toISOString();
    const endDateStr = moment(findUserDifferentProjectDto.endDate).endOf('day').toISOString();
    const resourceEntity = await this.resourceEntity.findAll({
      where: {
        [Op.and]: {
          date: { [Op.between]: [startDateStr, endDateStr] },
        },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            [Op.and]: {
              userId: { [Op.like]: findUserDifferentProjectDto.userId },
              projectId: { [Op.not]: findUserDifferentProjectDto.projectId },
            },
          },
        },
      ],
      attributes: ['id'],
      group: ['id'],
    });
    return resourceEntity.map((e) => e.id);
  }

  async getAcAndTcPercentTotal(
    userProjectId: number,
    positionId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<AcAndTcPercentTotalDto> {
    const resourceAll = await this.resourceEntity.findAll({
      attributes: [
        [fn('SUM', col('acPercent')), 'acPercentTotal'],
        [fn('SUM', col('tcPercent')), 'tcPercentTotal'],
      ],
      where: {
        userProjectId,
        positionId,
        date: { [Op.between]: [startDate, endDate] },
      },
      raw: true,
    });
    const acPercentTotal =
      resourceAll && resourceAll[0] && resourceAll[0].acPercentTotal ? resourceAll[0].acPercentTotal : 0;
    const tcPercentTotal =
      resourceAll && resourceAll[0] && resourceAll[0].tcPercentTotal ? resourceAll[0].tcPercentTotal : 0;
    const acAndTcTotal: AcAndTcPercentTotalDto = {
      acPercentTotal,
      tcPercentTotal,
    };
    return acAndTcTotal;
  }

  async getResourceByUserProjectId(id: number): Promise<ResourceEntity[]> {
    const result = await this.resourceEntity.findAll({ where: { userProjectId: id } });
    if (isNil(result)) {
      return [];
    }
    return result;
  }

  async getStartDateAndEndDateOfPositionUserInProject(
    positionId: number,
    userProjectId: number,
  ): Promise<{ startDate: Date | null; endDate: Date | null }> {
    const result: {
      startDate: Date | null;
      endDate: Date | null;
    } = {
      startDate: null,
      endDate: null,
    };
    const resource = await this.resourceEntity.findAll({
      attributes: [
        [fn('min', col('date')), 'startDate'],
        [fn('max', col('date')), 'endDate'],
      ],
      where: {
        positionId,
        userProjectId,
        deletedAt: null,
      },
    });
    if (!resource || !resource[0]) {
      return result;
    }
    result.startDate = resource[0].getDataValue('startDate') ?? null;
    result.endDate = resource[0].getDataValue('endDate') ?? null;
    return result;
  }

  async getResourceOfUserProjectOneMonth(filterUserSummaryDto: FilterUserSummaryDto): Promise<ResourceEntity[]> {
    const { month } = filterUserSummaryDto;
    const startOfMonth = moment(new Date(month)).toDate();
    const endOfMonth = moment(new Date(month)).endOf('month').toDate();
    const userResources = await this.resourceEntity.findAll({
      where: {
        date: { [Op.between]: [startOfMonth, endOfMonth] },
      },
      include: [
        {
          model: PositionEntity,
          as: 'position',
        },
      ],
    });
    return userResources;
  }
  async detailResourceUser(userId: string, filterUserSummaryDto: FilterUserSummaryDto): Promise<ResourceEntity[]> {
    const { month } = filterUserSummaryDto;
    const startOfMonth = moment(new Date(month)).toDate();
    const endOfMonth = moment(new Date(month)).endOf('month').toDate();
    const userResource = await this.resourceEntity.findAll({
      where: {
        date: { [Op.between]: [startOfMonth, endOfMonth] },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            userId: { [Op.like]: userId },
          },
        },
      ],
    });
    return userResource;
  }

  async getDataResourceInProject(startDate: Date, endDate: Date, projectId: number): Promise<ResourceEntity[]> {
    return await this.resourceEntity.findAll({
      attributes: [
        'acPercent',
        [fn('COUNT', col('date')), 'count'],
        [fn('min', col('date')), 'startDate'],
        [fn('max', col('date')), 'endDate'],
        [fn('SUM', col('acPercent')), 'acPercentTotal'],
        [fn('SUM', col('tcPercent')), 'tcPercentTotal'],
      ],

      where: {
        date: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          required: true,
          include: [
            {
              model: ProjectEntity,
              required: true,
              as: 'projects',
              where: {
                id: projectId,
              },
            },
            {
              model: UserEntity,
              as: 'users',
              required: true,
            },
          ],
        },
        {
          model: PositionEntity,
          as: 'position',
          required: true,
        },
      ],
      group: ['userProjectId', 'positionid', 'acPercent'],
      order: [['date', 'DESC']],
      raw: true,
      nest: true
    });
  }
  async getDataResourceInProjectByMonth(startDate: Date, endDate: Date, projectId: number): Promise<ResourceEntity[]> {
    const salariesProject = await this.resourceEntity.findAll({
      attributes: [
        'acPercent',
        'userProject.userId',
        'resources.date',
        [Sequelize.fn('MONTH', Sequelize.col('resources.date')), 'month'],
        [Sequelize.fn('YEAR', Sequelize.col('resources.date')), 'year'],
      ],
      where: {
        date: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          required: true,
          where: {
            projectId: projectId,
          },
          include: [
            {
              model: UserEntity,
              as: 'users',
              required: true,
              include: [
                {
                  model: UserSalariesEntity,
                  attributes: ['id','salary','year','month'],
                  as: 'userSalaries',
                  required: false,
                  where: {
                    month: Sequelize.fn('MONTH', Sequelize.col('resources.date')),
                    year: Sequelize.fn('YEAR', Sequelize.col('resources.date')),
                  }
                },
              ],
            }
          ],
        }
      ],
      order: [['date', 'ASC']],
      raw: true,
      nest: true,
    });
    return salariesProject;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getResourceTotal(startDate: Date, endDate: Date, projectId: number) {
    return this.resourceEntity.findAll({
      attributes: [
        [fn('SUM', col('acPercent')), 'acPercentTotal'],
        [fn('SUM', col('tcPercent')), 'tcPercentTotal'],
      ],
      where: { date: { [Op.between]: [startDate, endDate] } },
      include: {
        model: UserProjectEntity,
        as: 'userProject',
        attributes: [],          // <<— ẩn tất cả cột
        required: true,
        include: [
          {
            model: ProjectEntity,
            as: 'projects',
            attributes: [],      // <<— ẩn nốt
            required: true,
            where: { id: projectId },
          },
        ],
      },
      raw: true,
      nest: true,
    });
  }

  
  async deleteResourceByDate(projectId: number, startDate?: Date, endDate?: Date): Promise<void> {
    const resources = await this.resourceEntity.findAll({
      where: {
        date: {
          [Op.or]: {
            [Op.gt]: endDate,
            [Op.lt]: startDate,
          },
        },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            projectId,
          },
        },
      ],
    });
    await Promise.all(
      resources.map(async (res) => {
        await res.update({ checkDayoff: null });
        await res.destroy();
      }),
    );
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getResourceInProject(projectId: number) {
    return  await this.resourceEntity.findAll({
      attributes: [
        [fn('SUM', col('resources.acPercent')), 'acPercentTotal'],
        [fn('SUM', col('resources.tcPercent')), 'tcPercentTotal'],
      ],
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          required: true,
          attributes: [], // 👈 tránh SELECT userProject.id
          include: [
            {
              model: ProjectEntity,
              as: 'projects',
              required: true,
              where: { id: projectId },
              attributes: [], // 👈 tránh SELECT projects.*
            },
          ],
        },
      ],
      raw: true,
    });
    
    
  }

  async deleteResource(dto: DeleteResourceDto): Promise<boolean> {
    for (const resource of dto.resources) {
      const { userProjectId, startDate, endDate, positionId } = resource;
      const condition: WhereOptions = {};
      condition.userProjectId = userProjectId;
      if (startDate && endDate) {
        condition.date = { [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }] };
      }
      if (positionId) {
        condition.positionId = positionId;
      }
      await this.resourceEntity.update(
        { checkDayoff: null },
        {
          where: condition,
        },
      );
      await this.resourceEntity.destroy({
        where: condition,
      });
    }
    return true;
  }

  async deleteAllResourceMember(userProjectId: number, t: Transaction): Promise<SuccessResponseDto> {
    await this.resourceEntity.update(
      { checkDayoff: null },
      {
        where: {
          userProjectId,
        },
        transaction: t,
      },
    );
    await this.resourceEntity.destroy({
      where: {
        userProjectId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }
  async actcDetail(userId: string, month: Date): Promise<ResourceEntity[]> {
    const startOfMonth = moment(new Date(month)).startOf('month').toDate();
    const endOfMonth = moment(new Date(month)).endOf('month').toDate();
    const detail = await this.resourceEntity.findAll({
      attributes: [
        [Sequelize.fn('max', Sequelize.col('date')), 'endDate'],
        [Sequelize.fn('min', Sequelize.col('date')), 'startDate'],
        'acPercent',
        'tcPercent',
        'positionId',
      ],
      where: {
        date: { [Op.between]: [startOfMonth, endOfMonth] },
      },
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            userId,
          },
        },
      ],
      group: ['userProjectId', 'positionId', 'acPercent', 'tcPercent'],
      raw: true,
    });
    return detail;
  }

  async getListUserIdFilterByPositionIds(
    positionIds: number[],
    startDate: Date,
    endDate: Date,
    projectIds?: number[],
    departmentIds?: number[],
  ): Promise<string[]> {
    const condition = {
      positionId: { [Op.in]: positionIds },
      date: { [Op.between]: [startDate, endDate] },
    };
    const childCondition = {};
    const userCondition = {};

    if (!isNil(projectIds)) {
      Object.assign(childCondition, {
        projectId: { [Op.in]: projectIds },
      });
    }

    if (!isNil(departmentIds)) {
      Object.assign(userCondition, {
        departmentId: { [Op.in]: departmentIds },
      });
    }

    const listRecords = await this.resourceEntity.findAll({
      where: condition,
      group: ['userProjectId', 'positionId'],
      include: {
        model: UserProjectEntity,
        attributes: ['userId', 'projectId'],
        as: 'userProject',
        required: true,
        where: childCondition,
        include: [
          {
            model: UserEntity,
            as: 'users',
            where: userCondition,
          },
        ],
      },
      nest: true,
      raw: true,
    });

    let userIds = listRecords.map((e) => e.userProject?.userId ?? '');
    userIds = userIds.filter((e) => e !== '');
    userIds = [...new Set(userIds)];

    return userIds;
  }

  async getListUserIdFilterOptions(
    startDate: Date,
    endDate: Date,
    positionIds?: number[],
    projectIds?: number[],
    departmentIds?: number[],
  ): Promise<string[]> {
    const condition = {
      date: { [Op.between]: [startDate, endDate] },
    };
    const childCondition = {};
    const userCondition = {};

    if (!isNil(positionIds) && positionIds.length > 0) {
      Object.assign(condition, {
        positionId: { [Op.in]: positionIds },
      });
    }

    if (!isNil(projectIds) && projectIds.length > 0) {
      Object.assign(childCondition, {
        projectId: { [Op.in]: projectIds },
      });
    }

    if (!isNil(departmentIds) && departmentIds.length > 0) {
      Object.assign(userCondition, {
        departmentId: { [Op.in]: departmentIds },
      });
    }

    const listRecords = await this.resourceEntity.findAll({
      where: condition,
      group: ['userProjectId', 'positionId'],
      include: {
        model: UserProjectEntity,
        attributes: ['userId', 'projectId'],
        as: 'userProject',
        required: true,
        where: childCondition,
        include: [
          {
            model: UserEntity,
            as: 'users',
            where: userCondition,
          },
        ],
      },
      nest: true,
      raw: true,
    });

    let userIds = listRecords.map((e) => e.userProject?.userId ?? '');
    userIds = userIds.filter((e) => e !== '');
    userIds = [...new Set(userIds)];

    return userIds;
  }

  async getResourcePms(userProjectIds: number[]): Promise<ResourceEntity[]> {
    const condition = {
      userProjectId: { [Op.in]: userProjectIds },
      positionId: 1,
    };

    const resources = await this.resourceEntity.findAll({
      where: condition,
      attributes: [
        'id',
        'userProjectId',
        'positionId',
        'date',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          required: true,
          attributes: ['id', 'userId', 'projectId', 'createdAt', 'updatedAt'],
          include: [
            {
              model: UserEntity,
              as: 'users', // ✅ đúng alias đã định nghĩa
              attributes: ['id', 'mail', 'displayName', 'status', 'createdAt', 'updatedAt'], // ✅ dùng đúng tên cột trong model
            },
          ],
        },
      ],
      order: [['date', 'ASC']],
    });
    
    
    
    // Tự group trong JS (nếu cần)
    const grouped = {}; // hoặc dùng lodash groupBy, tùy bạn
    for (const r of resources) {
      const key = `${r.userProjectId}-${r.positionId}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }
    
    return resources;
  }

  async deletetAllResourceByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto> {
    await this.resourceEntity.update(
      { checkDayoff: null },
      {
        where: {
          userProjectId: { [Op.in]: userProjectIds },
        },
        transaction: t,
      },
    );
    await this.resourceEntity.destroy({
      where: {
        userProjectId: { [Op.in]: userProjectIds },
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }
  async updateResourcesWhenSettingDaysOff(dto: ParamUpdateDayOffDto): Promise<SuccessResponseDto> {
    // get date_edit of daysOff -> restore resources
    const date: { startDate: Date; endDate: Date }[] = [];
    const edit = await this.daysOffRepository.getDaysOffGroupByEdit(['edit'], dto.idSame);
    edit.map((e) =>
      date.push({
        startDate: new Date(e.edit.slice(0, 10)),
        endDate: new Date(e.edit.slice(11)),
      }),
    );
    // restore and update check
    await Promise.all(
      date.map(async (d) => {
        await this.resourceEntity.restore({
          where: {
            date: { [Op.between]: [d.startDate, d.endDate] },
            checkDayoff: CHECKDAYOFF,
          },
        });
        await this.resourceEntity.update(
          { checkDayoff: null },
          {
            where: {
              date: { [Op.between]: [d.startDate, d.endDate] },
              checkDayoff: CHECKDAYOFF,
            },
          },
        );
      }),
    );
    // get date of daysOff -> destroy resources
    const dayOff = await this.daysOffRepository.getDaysOff(dto.idSame);
    // destroy and update check
    await Promise.all(
      dayOff.map(async (d) => {
        await this.resourceEntity.update(
          { checkDayoff: CHECKDAYOFF },
          {
            where: {
              date: d.date,
            },
          },
        );
        await this.resourceEntity.destroy({
          where: {
            date: d.date,
          },
        });
      }),
    );

    return new SuccessResponseDto(true);
  }

  async restoreResourcesWhenDeleteDayOff(dayOff: DaysOffEntity[]): Promise<SuccessResponseDto> {
    await Promise.all(
      dayOff.map(async (d) => {
        await this.resourceEntity.restore({
          where: {
            date: d.date,
            checkDayoff: CHECKDAYOFF,
            deletedAt: { [Op.ne]: null },
          },
        });
      }),
    );
    return new SuccessResponseDto(true);
  }
  async getMaxMinDateResources(id: number): Promise<ResourceEntity[]> {
    return await this.resourceEntity.findAll({
      attributes: [
        [Sequelize.fn('max', Sequelize.col('date')), 'endDate'],
        [Sequelize.fn('min', Sequelize.col('date')), 'startDate'],
        'positionId',
      ],
      where: {
        userProjectId: id,
      },
      group: ['positionId'], // Thêm dòng này
    });
  }
  async getProjectRankMember(
    positionId: number,
    userId: string,
    projectId: number,
    option: string,
  ): Promise<ResourceEntity[]> {
    const startDay = moment().startOf('days').toDate();
    const include = [
      {
        model: UserProjectEntity,
        as: 'userProject',
        where: {
          userId,
          projectId,
        },
      },
      {
        model: ProjectRankEntity,
        as: 'projectRank',
        paranoid: false,
      },
    ];
    if (option === 'before') {
      return await this.resourceEntity.findAll({
        where: {
          positionId,
          date: { [Op.lt]: startDay },
        },
        include,
      });
    }
    if (option === 'after') {
      return await this.resourceEntity.findAll({
        where: {
          positionId,
          date: { [Op.gt]: startDay },
        },
        include,
      });
    }
    return await this.resourceEntity.findAll({
      where: {
        positionId,
        date: startDay,
      },
      include,
    });
  }

  async getAllPositionUsing(paramPositionIdsDto: ParamPositionIdsDto): Promise<ResourcePositionDto[]> {
    const results = await this.resourceEntity.findAll({
      where: {
        deletedAt: null
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('positionId')), 'positionId']],
    });
    return results;
  }

}
