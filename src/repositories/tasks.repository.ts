import { Inject } from '@nestjs/common';
import { TaskNS } from '../modules/tasks/interfaces/tasks-interface';
import { default as TaskEntity } from '../entities/tasks.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { CreateTaskDto } from '../modules/tasks/dto/requests/create-task-dto';
import { PageDto } from '../common/dto/page.dto';
import { TaskOptionsDto } from '../modules/tasks/dto/requests/tasks-filter-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { isNil } from 'lodash';
import moment from 'moment';
import { Op, Transaction } from 'sequelize';
import { default as UserEntity } from '../entities/users.entity';
import { TaskDto } from '../modules/tasks/dto/responses/task-dto';
import { default as ProjectEntity } from '../entities/project.entity';
import { default as DailyReportActivitiesEntity } from '../entities/daily-report-activities.entity';

export class TaskRepository implements TaskNS.ITaskRepository {
  constructor(@Inject(TaskEntity.name) private readonly taskEntity: typeof TaskEntity) { }
  async createTask(taskDto: CreateTaskDto): Promise<SuccessResponseDto> {
    await this.taskEntity.create({
      taskId: taskDto.taskId,
      content: taskDto.content,
      createdBy: taskDto.createdBy,
      creator: taskDto.creator,
      projectId: taskDto.projectId,
    });
    return new SuccessResponseDto(true);
  }

  async getTasks(taskOptionsDto: TaskOptionsDto): Promise<PageDto<TaskDto>> {
    const condition = {};
    const userRelation = {
      model: UserEntity,
      as: 'users',
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    };

    const dailyReportActivitiesRelation = {
      model: DailyReportActivitiesEntity,
      as: 'dailyReportActivity',
      attributes: ['id', 'name', 'deletedAt'],
      paranoid: false,
    };

    var projectId = taskOptionsDto.projectId;

    const userProjectRelation = {
      model: UserProjectEntity,
      as: 'userProject',
      where: {
        projectId,
      },
      include: [userRelation],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    };

    if (!isNil(taskOptionsDto)) {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (!isNil(taskOptionsDto.startDate) && !isNil(taskOptionsDto.endDate)) {
        startDate = moment(taskOptionsDto.startDate).startOf('day').toISOString();
        endDate = moment(taskOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.between]: [startDate, endDate] },
        });
      } else if (!isNil(taskOptionsDto.startDate) && isNil(taskOptionsDto.endDate)) {
        startDate = moment(taskOptionsDto.startDate).startOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.gte]: startDate },
        });
      } else if (isNil(taskOptionsDto.startDate) && !isNil(taskOptionsDto.endDate)) {
        endDate = moment(taskOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.lte]: endDate },
        });
      }
    

      if (!isNil(taskOptionsDto.q)) {
        Object.assign(condition, {
          [Op.or]: {
            taskId: { [Op.substring]: taskOptionsDto.q },
            note: { [Op.substring]: taskOptionsDto.q },
          },
        });
      }
    }
    const results = await this.taskEntity.findAndCountAll({
      where: condition,
      order: [
        ['reportDate', 'DESC'],
        [userProjectRelation, userRelation, 'username', 'ASC'],
      ],
      include: [userProjectRelation, dailyReportActivitiesRelation],
      limit: taskOptionsDto.take,
      offset: taskOptionsDto.skip,
      distinct: true,
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: taskOptionsDto, itemCount: results.count });
    const items = results.rows;

    return items.toPageDto(pageMetaDto);
  }


  async getDetailTask(TaskId: number): Promise<TaskEntity | null> {
    const userRelation = {
      model: UserEntity,
      as: 'users',
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    };
    const projectRelation = {
      model: ProjectEntity,
      as: 'projects',
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    };

    const dailyReportActivitiesRelation = {
      model: DailyReportActivitiesEntity,
      as: 'dailyReportActivity',
      attributes: ['id', 'name', 'deletedAt'],
      paranoid: false,
    };

    const userProjectRelation = {
      model: UserProjectEntity,
      as: 'userProject',
      include: [userRelation, projectRelation],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    };
    return await this.taskEntity.findOne({
      where: {
        id: TaskId,
      },
      include: [userProjectRelation, dailyReportActivitiesRelation],
    });
  }

  async updateTask(task: TaskEntity, taskDto: CreateTaskDto): Promise<SuccessResponseDto> {
    await task.update({
       taskId: taskDto.taskId,
      content: taskDto.content,
      createdBy: taskDto.createdBy,
      creator: taskDto.creator,
      projectId: taskDto.projectId,
    });
    return new SuccessResponseDto(true);
  }

 
  async deleteTask(taskId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.taskEntity.destroy({
      where: {
        taskId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

}
