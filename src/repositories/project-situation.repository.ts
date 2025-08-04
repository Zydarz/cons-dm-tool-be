import { Inject } from '@nestjs/common';
import { PageDto } from '../common/dto/page.dto';
import { ProjectSituationDto } from '../modules/project-situations/dtos/project-situation.dto';
import { default as ProjectSituationEntity } from '../entities/project-situation.entity';
import { IProjectSituationRepository } from '../modules/project-situations/interfaces/project-situation.repository.interface';
import { default as UserEntity } from '../entities/users.entity';
import { CreateProjectSituationDto } from '../modules/project-situations/dtos/requests/create-project-situation.dto';
import { GetAllProjectSituationDto } from '../modules/project-situations/dtos/requests/get-project-situations.dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import sequelize, { Transaction, Op, Sequelize, WhereOptions } from 'sequelize';
import { FilterDto } from '../modules/project-situations/dtos/requests/filter-project-situation.dto';
import { default as ProjectEntity } from '../entities/project.entity';
import { GroupBy } from '../common/constants/group-by';
import { ProjectSituationNS } from '../modules/project-situations/interfaces/project-situation.interface';
import { ProjectNS } from '../modules/projects/interfaces/project';
import { isNil, orderBy } from 'lodash';
import ProjectSituationHistoryEntity from '../entities/project-situation-history.entity';
import { updatedByProjectDto } from '../modules/project-situations/dtos/responses/updated-by-project.response.dto';
import { projectSituationDetailDto } from '../modules/project-situations/dtos/responses/project-situation-detail.response.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

export class ProjectSituationRepository implements IProjectSituationRepository {
  constructor(
    @Inject(ProjectSituationEntity.name) private readonly projectSituationEntity: typeof ProjectSituationEntity,
  ) {}
  async getAll(dto: GetAllProjectSituationDto): Promise<PageDto<ProjectSituationDto>> {
    const condition = {
      projectId: dto.projectId,
      deletedAt: null,
    };
    const relation = {
      model: UserEntity,
      required: true,
      where: {},
      as: 'submitter',
    };
    const projectSituation = await this.projectSituationEntity.findAndCountAll({
      where : condition,
      include: [
        relation
      ],
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: dto.take,
      offset: dto.skip
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: dto, itemCount: projectSituation.count });
    const items = projectSituation.rows;
    return items.toPageDto(pageMetaDto);
  }

  async createProjectSituation(
    submitterId: string,
    dto: CreateProjectSituationDto,
    index: number,
  ): Promise<ProjectSituationEntity> {
    const projectSituation = await this.projectSituationEntity.create({ submitterId, ...dto, flag: index });
    return projectSituation;
  }

  async deleteProjectSituation(flag: number, id: number, del?: string): Promise<number> {
    if (del) {
      return await this.projectSituationEntity.destroy({
        where: { id, flag },
      });
    }
    return await this.projectSituationEntity.destroy({
      where: { flag },
    });
  }

  async findById(id: number): Promise<ProjectSituationEntity | null> {
    return await this.projectSituationEntity.findOne({
      where: { id },
      include: [
        {
          model: UserEntity,
          as: 'submitter',
        },
        {
          model: ProjectEntity,
          as: 'project',
        },
      ],
    });
  }
  async getGroupMax(): Promise<ProjectSituationEntity[]> {
    return await this.projectSituationEntity.findAll({
      attributes: [[sequelize.fn('max', sequelize.col('flag')), 'count']],
    });
  }

  async getLastSitualation(id: number): Promise<ProjectSituationEntity[]> {
    return await this.projectSituationEntity.findAll({
      where: { projectId: id },
      include: [
        {
          model: UserEntity,
          as: 'submitter',
        },
      ],
      order: [['date', 'DESC']],
    });
  }

  async deleteProjectSituationByProjectId(projectId: number, t?: Transaction | undefined): Promise<SuccessResponseDto> {
    await this.projectSituationEntity.destroy({
      where: {
        projectId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

  async deleteSituationWhenEdit(flag: number, id: number[]): Promise<number> {
    return await this.projectSituationEntity.destroy({
      where: {
        id: { [Op.in]: id },
        flag,
      },
    });
  }

  async getSituationByflag(flag: number): Promise<number[]> {
    const projectSituations = await this.projectSituationEntity.findAll({
      where: {
        flag,
      },
    });
    return projectSituations.map((p) => p.id);
  }

  async getArrayByGroup(filter: FilterDto) {
    const condition: WhereOptions = {};
    let conditionIncludeProject: WhereOptions = {};
    let include;
    if (filter.startDate && filter.endDate) {
      condition.date = { [Op.between]: [filter.startDate, filter.endDate] };
    }

    if (filter.status !== ProjectNS.Status.ALL) {
      if(isNil(filter.projectIds)) {
        conditionIncludeProject = {
          [Op.and]: {
            status: filter.status,
          },
        }
      } else {
        conditionIncludeProject = {
          [Op.and]: {
            status: filter.status,
            id:  { [Op.in]: filter.projectIds },
          },
        }
      }

      include = [
        {
          model: ProjectEntity,
          as: 'project',
          where: conditionIncludeProject
          ,
        },
      ];
    } else {
      if(isNil(filter.projectIds)) {
        conditionIncludeProject = {}
      } else {
        conditionIncludeProject = {
          [Op.and]: {
            id:  { [Op.in]: filter.projectIds },
          },
        }
      }

      include = [
        {
          model: ProjectEntity,
          as: 'project',
          where: conditionIncludeProject
        },
      ];
    }

    let group;
    if (filter.groupBy === GroupBy.PROJECT) {
      group = [ProjectSituationNS.Type.PROJECTID];
      const payment = await this.projectSituationEntity.findAll({
        where: condition,
        attributes: [
          'projectId',
          [sequelize.fn('MAX', sequelize.col('project_situations.updatedAt')), 'latestUpdate'],
        ],
        include,
        group: ['projectId'],
        order: [[sequelize.literal('latestUpdate'), 'DESC']],
        raw: true,
      });
      
      
      const array = payment.map((p) => p.projectId);
      return array;
    }
    group = [ProjectSituationNS.Type.MONTH, ProjectSituationNS.Type.YEAR];
    const payment = await this.projectSituationEntity.findAll({
      where: condition,
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('date')), ProjectSituationNS.Type.MONTH],
        [sequelize.fn('YEAR', sequelize.col('date')), ProjectSituationNS.Type.YEAR],
      ],
      include,
      group,
      order: [['updatedAt', 'DESC']],
    });
    const array = payment.map((p) => ({
      month: p.getDataValue(ProjectSituationNS.Type.MONTH),
      year: p.getDataValue(ProjectSituationNS.Type.YEAR),
    }));
    return array;
  }

  async getSituationByProjectId(projectId: number, filter: FilterDto): Promise<ProjectSituationDto[]> {
    const condition: WhereOptions = {};
    if (filter.startDate && filter.endDate) {
      condition.date = { [Op.between]: [filter.startDate, filter.endDate] };
    }
    condition.projectId = projectId;
    const projectSituation = await this.projectSituationEntity.findAll({
      where: condition,
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: UserEntity,
          as: 'submitter',
          required: true,
        },
        {
          model: ProjectSituationHistoryEntity,
          as: 'projectSituationHistory',
          required: false,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'projectSituationId', 'submitterId', 'createdAt'],
          include: [
            {
              model: UserEntity,
              as: 'submitter',
              required: true,
              attributes: ['id', 'displayName', 'username'],
            },
          ],
        },
      ]
    });

    return projectSituation.toDtos();
  }

  async getFlag(filter: FilterDto, option?: string, month?: number, year?: number): Promise<number[]> {
    let projectSituation: ProjectSituationEntity[];
    const condition: WhereOptions = {};
    const where: WhereOptions = {};

    if (filter?.status !== ProjectNS.Status.ALL) {
      condition.status = filter?.status;
    }

    if (filter?.startDate && filter?.endDate) {
      where.date = { [Op.between]: [filter.startDate, filter.endDate] };
    }
    if (option) {
      projectSituation = await this.projectSituationEntity.findAll({
        where,
        order: [['updatedAt', 'DESC']],
        include: [
          {
            model: ProjectEntity,
            as: 'project',
            where: condition,
          },
        ],
      });
    } else {
      projectSituation = await this.projectSituationEntity.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('flag')), 'flag']],
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
            where,
          ],
        },
        order: [['updatedAt', 'DESC']],
      });
    }
    return projectSituation.map((p) => p.flag);
  }

  async getSituationByFlag(flag: number, filter: FilterDto): Promise<ProjectSituationDto[]> {
    const condition: WhereOptions = {};
    if (filter?.status !== ProjectNS.Status.ALL) {
      condition.status = filter?.status;
    }
    if (!isNil(filter?.projectIds)) {
      condition.id = { [Op.in]: filter?.projectIds };
    }

    const projectSituation = await this.projectSituationEntity.findAll({
      where: {
        flag,
      },
      include: [
        {
          model: UserEntity,
          as: 'submitter',
          required: true,
        },
        {
          model: ProjectEntity,
          as: 'project',
          where: condition,
          required: true,
        },
        {
          model: ProjectSituationHistoryEntity,
          as: 'projectSituationHistory',
          required: false,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'projectSituationId', 'submitterId', 'createdAt'],
          include: [
            {
              model: UserEntity,
              as: 'submitter',
              required: true,
              attributes: ['id', 'displayName', 'username'],
            },
          ],
        },
      ],
    });
    return projectSituation.toDtos();
  }
  async getUpdatedByProject(projectId: number): Promise<updatedByProjectDto[]> {
    const projectSituation = await this.projectSituationEntity.findAll({
      attributes: ['id', 'date', 'updatedAt'],
      where: { projectId: projectId },
      order: [['updatedAt', 'DESC']],
    });
    return projectSituation;
  }
  async getSituationById(id: number): Promise<projectSituationDetailDto> {
    const projectSituation = await this.projectSituationEntity.findOne({
      where: { id }
    });
    if (isNil(projectSituation)) {
      return {} as projectSituationDetailDto;
    }
    return projectSituation.toDto();
  }
}
