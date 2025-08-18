import { Inject } from '@nestjs/common';
import { LogWorkNS } from '../modules/log-works/interfaces/logwork-interface';
import { default as LogWorkEntity } from '../entities/log-work.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { RequestLogWorkDto } from '../modules/projects/dto/requests/request-log-work-dto';
import { PageDto } from '../common/dto/page.dto';
import { LogWorkFilterOptionsDto } from '../modules/log-works/dto/requests/log-work-filter-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { isNil } from 'lodash';
import moment from 'moment';
import { Op, Transaction } from 'sequelize';
import { default as UserEntity } from '../entities/users.entity';
import { LogWorkDto } from '../modules/log-works/dto/responses/log-work-dto';
import { default as ProjectEntity } from '../entities/project.entity';
import { default as DailyReportActivitiesEntity } from '../entities/daily-report-activities.entity';

export class LogWorkRepository implements LogWorkNS.ILogWorkRepository {
  constructor(@Inject(LogWorkEntity.name) private readonly logWorkEntity: typeof LogWorkEntity) { }
  async createLogWork(userProjectId: number, logWorkDto: RequestLogWorkDto): Promise<SuccessResponseDto> {
    await this.logWorkEntity.create({
      userProjectId,
      reportDate: logWorkDto.reportDate,
      dailyReportActivitiesId: logWorkDto.activity,
      taskId: logWorkDto.taskId,
      actualEffort: logWorkDto.actualEffort,
      note: logWorkDto.note,
    });
    return new SuccessResponseDto(true);
  }

  async getLogWork(projectId: number, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>> {
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

    if (!isNil(logWorkFilterOptionsDto)) {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (!isNil(logWorkFilterOptionsDto.startDate) && !isNil(logWorkFilterOptionsDto.endDate)) {
        startDate = moment(logWorkFilterOptionsDto.startDate).startOf('day').toISOString();
        endDate = moment(logWorkFilterOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.between]: [startDate, endDate] },
        });
      } else if (!isNil(logWorkFilterOptionsDto.startDate) && isNil(logWorkFilterOptionsDto.endDate)) {
        startDate = moment(logWorkFilterOptionsDto.startDate).startOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.gte]: startDate },
        });
      } else if (isNil(logWorkFilterOptionsDto.startDate) && !isNil(logWorkFilterOptionsDto.endDate)) {
        endDate = moment(logWorkFilterOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.lte]: endDate },
        });
      }
      if (!isNil(logWorkFilterOptionsDto.userId)) {
        const user = logWorkFilterOptionsDto.userId.split(',');
        Object.assign(userProjectRelation, {
          where: {
            userId: { [Op.in]: user },
          },
        });
      }

      if (!isNil(logWorkFilterOptionsDto.q)) {
        Object.assign(condition, {
          [Op.or]: {
            taskId: { [Op.substring]: logWorkFilterOptionsDto.q },
            note: { [Op.substring]: logWorkFilterOptionsDto.q },
          },
        });
      }
    }
    const results = await this.logWorkEntity.findAndCountAll({
      where: condition,
      order: [
        ['reportDate', 'DESC'],
        [userProjectRelation, userRelation, 'username', 'ASC'],
      ],
      include: [userProjectRelation, dailyReportActivitiesRelation],
      limit: logWorkFilterOptionsDto.take,
      offset: logWorkFilterOptionsDto.skip,
      distinct: true,
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: logWorkFilterOptionsDto, itemCount: results.count });
    const items = results.rows;

    return items.toPageDto(pageMetaDto);
  }

  async getLogWorkByUserId(userId: string, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>> {
    const condition = {};
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
      where: {
        userId,
      },
      include: [userRelation,projectRelation],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    };

    if (!isNil(logWorkFilterOptionsDto)) {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (!isNil(logWorkFilterOptionsDto.startDate) && !isNil(logWorkFilterOptionsDto.endDate)) {
        startDate = moment(logWorkFilterOptionsDto.startDate).startOf('day').toISOString();
        endDate = moment(logWorkFilterOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.between]: [startDate, endDate] },
        });
      } else if (!isNil(logWorkFilterOptionsDto.startDate) && isNil(logWorkFilterOptionsDto.endDate)) {
        startDate = moment(logWorkFilterOptionsDto.startDate).startOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.gte]: startDate },
        });
      } else if (isNil(logWorkFilterOptionsDto.startDate) && !isNil(logWorkFilterOptionsDto.endDate)) {
        endDate = moment(logWorkFilterOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.lte]: endDate },
        });
      }
      if (!isNil(logWorkFilterOptionsDto.userId)) {
        const user = logWorkFilterOptionsDto.userId.split(',');
        Object.assign(userProjectRelation, {
          where: {
            userId: { [Op.in]: user },
          },
        });
      }

      

      if (!isNil(logWorkFilterOptionsDto.q)) {
        Object.assign(condition, {
          [Op.or]: {
            taskId: { [Op.substring]: logWorkFilterOptionsDto.q },
            note: { [Op.substring]: logWorkFilterOptionsDto.q },
          },
        });
      }
    }
    const results = await this.logWorkEntity.findAndCountAll({
      where: condition,
      order: [
        ['reportDate', 'DESC'],
        [userProjectRelation, userRelation, 'username', 'ASC'],
      ],
      include: [userProjectRelation, dailyReportActivitiesRelation],
      limit: logWorkFilterOptionsDto.take,
      offset: logWorkFilterOptionsDto.skip,
      distinct: true,
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: logWorkFilterOptionsDto, itemCount: results.count });
    const items = results.rows;

    return items.toPageDto(pageMetaDto);
  }

  
// Gợi ý: Đổi tên hàm để thể hiện rõ chức năng hơn (ví dụ: getLogWorks)
async getLogWorksMember(
  userIds: string[],
  projectIds: string[], // <-- 1. Thêm tham số projectIds
  logWorkFilterOptionsDto: LogWorkFilterOptionsDto,
): Promise<PageDto<LogWorkDto>> {
  // 2. Xây dựng điều kiện lọc cho bảng user_projects một cách linh hoạt
  const userProjectWhereConditions = {};

  if (userIds && userIds.length > 0) {
    Object.assign(userProjectWhereConditions, {
      userId: { [Op.in]: userIds },
    });
  }

  if (projectIds && projectIds.length > 0) {
    Object.assign(userProjectWhereConditions, {
      projectId: { [Op.in]: projectIds },
    });
  }

  // 3. Xử lý trường hợp không có bộ lọc nào được cung cấp -> trả về rỗng để an toàn
  if (Object.keys(userProjectWhereConditions).length === 0) {
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: logWorkFilterOptionsDto, itemCount: 0 });
    return new PageDto([], pageMetaDto);
  }

  const condition = {};
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
    where: userProjectWhereConditions, // <-- 4. Áp dụng các điều kiện đã xây dựng
    include: [userRelation, projectRelation],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    },
  };

  if (!isNil(logWorkFilterOptionsDto)) {
    // Logic xử lý ngày tháng giữ nguyên
    if (!isNil(logWorkFilterOptionsDto.startDate) && !isNil(logWorkFilterOptionsDto.endDate)) {
      const startDate = moment(logWorkFilterOptionsDto.startDate).startOf('day').toISOString();
      const endDate = moment(logWorkFilterOptionsDto.endDate).endOf('day').toISOString();
      Object.assign(condition, {
        reportDate: { [Op.between]: [startDate, endDate] },
      });
    } else if (!isNil(logWorkFilterOptionsDto.startDate)) {
      const startDate = moment(logWorkFilterOptionsDto.startDate).startOf('day').toISOString();
      Object.assign(condition, {
        reportDate: { [Op.gte]: startDate },
      });
    } else if (!isNil(logWorkFilterOptionsDto.endDate)) {
      const endDate = moment(logWorkFilterOptionsDto.endDate).endOf('day').toISOString();
      Object.assign(condition, {
        reportDate: { [Op.lte]: endDate },
      });
    }
    
    // Logic tìm kiếm theo query string giữ nguyên
    if (!isNil(logWorkFilterOptionsDto.q)) {
      Object.assign(condition, {
        [Op.or]: {
          taskId: { [Op.substring]: logWorkFilterOptionsDto.q },
          note: { [Op.substring]: logWorkFilterOptionsDto.q },
        },
      });
    }
  }

  const results = await this.logWorkEntity.findAndCountAll({
    where: condition,
    order: [
      ['reportDate', 'DESC'],
      [userProjectRelation, userRelation, 'username', 'ASC'],
    ],
    include: [userProjectRelation, dailyReportActivitiesRelation],
    limit: logWorkFilterOptionsDto.take,
    offset: logWorkFilterOptionsDto.skip,
    distinct: true,
  });

  const pageMetaDto = new PageMetaDto({ pageOptionsDto: logWorkFilterOptionsDto, itemCount: results.count });
  const items = results.rows;

  return items.toPageDto(pageMetaDto);
}

  async getDetailLogWork(logWorkId: number): Promise<LogWorkEntity | null> {
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
    return await this.logWorkEntity.findOne({
      where: {
        id: logWorkId,
      },
      include: [userProjectRelation, dailyReportActivitiesRelation],
    });
  }
  async updateLogWork(logWork: LogWorkEntity, updateLogWorkDto: RequestLogWorkDto): Promise<SuccessResponseDto> {
    await logWork.update({
      reportDate: updateLogWorkDto.reportDate,
      dailyReportActivitiesId: updateLogWorkDto.activity,
      taskId: updateLogWorkDto.taskId,
      actualEffort: updateLogWorkDto.actualEffort,
      note: updateLogWorkDto.note,
    });
    return new SuccessResponseDto(true);
  }

  async checkPermission(userId: string, logWorkId: number): Promise<LogWorkEntity | null> {
    return await this.logWorkEntity.findOne({
      where: {
        id: logWorkId,
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
    });
  }
  async findAllActualEffort(userId: string, projectId: number): Promise<LogWorkEntity[]> {
    const logwork = await this.logWorkEntity.findAll({
      include: [
        {
          model: UserProjectEntity,
          as: 'userProject',
          where: {
            projectId,
            userId,
          },
        },
      ],
    });
    return logwork;
  }

  async deleteLogWorksUser(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.logWorkEntity.destroy({
      where: {
        userProjectId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

  async deleteLogWorkByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto> {
    await this.logWorkEntity.destroy({
      where: {
        userProjectId: { [Op.in]: userProjectIds },
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }
}
