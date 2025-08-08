import { isNil } from 'lodash';
import { Inject } from '@nestjs/common';
import { default as ResourceEntity } from '../entities/resource.entity';
import { Op, Transaction, Sequelize } from 'sequelize';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { UserProjectNS } from '../modules/user-projects/interfaces/user-project';
import { CreateResourceDto } from '../modules/resources/dto/requests/create-resource-dto';
import moment from 'moment';
import { CreateUserProjectDto } from '../modules/user-projects/dto/requests/create-user-project-dto';
import { default as ProjectEntity } from '../entities/project.entity';
import { default as PositionEntity } from '../entities/position.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { default as UserEntity } from '../entities/users.entity';
import { FilterUserSummaryDto } from '../modules/resources/dto/requests/filter-user-summary-dto';
import { default as ProjectRankEntity } from '../entities/project-rank.entity';
import { STATUS_ACTIVE, STATUS_INACTIVE } from '../common/constants/unit';
export class UserProjectRepository implements UserProjectNS.IUserProjectRepository {
  constructor(@Inject(UserProjectEntity.name) private readonly userProjectEntity: typeof UserProjectEntity) {}

  async checkDuplicate(createResourceDto: CreateResourceDto): Promise<string[]> {
    const results: Array<string> = [];
    for (const createResource of createResourceDto.resources) {
      const startDateIso = moment(createResource.startDate, 'YYYY/MM/DD').startOf('day').toISOString();
      const endDateIso = moment(createResource.endDate, 'YYYY/MM/DD').endOf('day').toISOString();
      const startDate = new Date(startDateIso);
      const endDate = new Date(endDateIso);
      const userProject = await this.userProjectEntity.findOne({
        where: {
          [Op.and]: {
            userId: { [Op.like]: createResource.userId },
            projectId: createResource.projectId,
          },
        },
        include: [
          {
            model: ResourceEntity,
            as: 'resources',
            where: {
              [Op.and]: {
                date: { [Op.between]: [startDate, endDate] },
                positionId: createResource.positionId,
              },
            },
          },
        ],
      });
      if (!isNil(userProject?.resources)) {
        results.push(createResource.userId);
      }
    }
    return results;
  }

  async findUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity | null> {
    const { projectId, userId } = params;
    return await this.userProjectEntity.findOne({
      where: {
        [Op.and]: {
          projectId,
          userId: { [Op.like]: userId },
        },
      },
    });
  }

  async createUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity> {
    const { userId, projectId } = params;
    return await this.userProjectEntity.create({
      userId,
      projectId,
    });
  }

  async detailResourceUserProject(params: CreateUserProjectDto): Promise<UserProjectEntity | null> {
    const { userId, projectId } = params;
    return await this.userProjectEntity.findOne({
      where: {
        [Op.and]: {
          userId: { [Op.like]: userId },
          projectId,
        },
      },
      include: [
        {
          model: ProjectEntity,
          as: 'projects',
        },
        {
          model: ResourceEntity,
          as: 'resources',
          include: [
            {
              model: PositionEntity,
              as: 'position',
            },
            {
              model: ProjectRankEntity,
              as: 'projectRank',
              paranoid: false,
              attributes: ['id', 'name', 'order', 'deletedAt'],
            },
          ],
        },
      ],
    });
  }

  async getAllUserId(): Promise<string[]> {
    const users = await this.userProjectEntity.findAll({
      attributes: ['userId'],
      group: ['userId'],
    });
    return users.map((e) => e.userId);
  }

  async getUserByProjectId(projectId: number): Promise<string[]> {
    const users = await this.userProjectEntity.findAll({
      attributes: ['userId'],
      where: { projectId },
      group: ['userId'],
    });
    return users.map((e) => e.userId);
  }

  async findById(id: number): Promise<UserProjectEntity | null> {
    return await this.userProjectEntity.findOne({
      where: { id },
      include: [
        {
          model: UserEntity,
          as: 'users',
        },
      ],
    });
  }

  async getUserProjectByProjectId(id: number): Promise<UserProjectEntity[] | null> {
    return await this.userProjectEntity.findAll({
      where: { projectId: id },
    });
  }
  async getUserById(id: number): Promise<string[]> {
    const users = await this.userProjectEntity.findAll({
      attributes: ['userId'],
      where: { id },
      group: ['userId'],
    });
    return users.map((e) => e.userId);
  }

  async getUserProjectByProjectIdAndUserId(userId: string, projectId: number): Promise<UserProjectEntity[]> {
    return await this.userProjectEntity.findAll({
      where: {
        [Op.and]: {
          userId,
          projectId,
        },
      },
    });
  }
  async getAllUserIdWithProject(projectIds: number[]): Promise<string[]> {
    const users = await this.userProjectEntity.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('userId')), 'userId']],
      where: {
        projectId: { [Op.in]: projectIds },
      },
    });
    return users.map((e) => e.userId);
  }

  async deleteUserProjectById(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.userProjectEntity.destroy({
      where: {
        id: userProjectId,
      },
      transaction: t,
    });
   
    return new SuccessResponseDto(true);
  }
  async getMemberByProjectId(projectId?: number): Promise<UserProjectEntity[]> {
    const condition = {};

    if (projectId) {
      Object.assign(condition, {
        projectId,
      });
    }
  
    const users = await this.userProjectEntity.findAll({
      where: condition,
      group: [
        'user_projects.id',
        'user_projects.userId',
        'user_projects.projectId',
        'user_projects.createdAt',
        'user_projects.updatedAt',
        'users.id',
        'users.mail',
        'users.displayName',
        'users.status',
        'users.createdAt',
        'users.updatedAt',
      ],
      include: [
        {
          model: UserEntity,
          as: 'users', // phải đúng alias
        },
      ],
    });
    
    
    return users;
  }

  async deleteUserProjectByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.userProjectEntity.destroy({
      where: {
        projectId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

  async getUserInMonth(filterOptions: FilterUserSummaryDto): Promise<UserProjectEntity[]> {
    const condition = {};
    
    if (filterOptions.lineId) {
      const lineIds = filterOptions.lineId.split(',');
      Object.assign(condition, {
        lineId: { [Op.in]: lineIds },
      });
    }
    
    if (filterOptions.status && [STATUS_ACTIVE, STATUS_INACTIVE].includes(filterOptions.status)) {
      Object.assign(condition, {
        status: filterOptions.status,
      });
    } else {
      Object.assign(condition, {
        status: { [Op.in]: [STATUS_ACTIVE, STATUS_INACTIVE] },
      });
    }
  
    if (!isNil(filterOptions.divisionIds) && filterOptions.divisionIds.length > 0) {
      Object.assign(condition, {
        departmentId: { [Op.in]: filterOptions.divisionIds },
      });
    }
    
    let include: any[] = [
      {
        model: UserEntity,
        as: 'users',
        attributes: [],
        where: condition,
      },
    ];
  
    // Cast về any để tránh TypeScript error
    const monthValue = filterOptions.month as any;
    if (monthValue && monthValue !== -1 && monthValue !== '-1') {
      const startDate = moment(new Date(filterOptions.month)).startOf('month').toDate();
      const endDate = moment(new Date(filterOptions.month)).endOf('month').toDate();
      
      // Kiểm tra xem date có hợp lệ không
      if (moment(startDate).isValid() && moment(endDate).isValid()) {
        include.push({
          model: ResourceEntity,
          as: 'resources',
          attributes: [],
          where: {
            date: { [Op.between]: [startDate, endDate] },
          },
        });
      }
    } else {
      // Nếu không có month filter, vẫn include ResourceEntity nhưng không có where condition
      include.push({
        model: ResourceEntity,
        as: 'resources',
        attributes: [],
      });
    }
    
    if (!isNil(filterOptions.projectDepartmentIds) && filterOptions.projectDepartmentIds.length > 0) {
      include.push({
        model: ProjectEntity,
        as: 'projects',
        attributes: [],
        where: {
          departmentId: { [Op.in]: filterOptions.projectDepartmentIds },
        },
      });
    }
    
    return await this.userProjectEntity.findAll({
      attributes: ['userId'],
      include: include,
      group: ['userId'],
      raw: true
    });
  }
  
}
