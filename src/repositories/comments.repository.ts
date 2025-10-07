import { Inject } from '@nestjs/common';
import { CommentNS } from '../modules/comments/interfaces/comments-interface';
import { default as CommentEntity } from '../entities/comments.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { CreateCommentDto } from '../modules/comments/dto/requests/create-comment-dto';
import { PageDto } from '../common/dto/page.dto';
import { CommentOptionsDto } from '../modules/comments/dto/requests/comments-filter-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { default as UserProjectEntity } from '../entities/user_project.entity';
import { isNil } from 'lodash';
import moment from 'moment';
import { Op, Transaction } from 'sequelize';
import { default as UserEntity } from '../entities/users.entity';
import { CommentDto } from '../modules/comments/dto/responses/comments-dto';
import { default as ProjectEntity } from '../entities/project.entity';
import { default as DailyReportActivitiesEntity } from '../entities/daily-report-activities.entity';

export class CommentRepository implements CommentNS.ICommentRepository {
  constructor(@Inject(CommentEntity.name) private readonly commentEntity: typeof CommentEntity) { }
  async createComment(commentDto: CreateCommentDto): Promise<SuccessResponseDto> {
    await this.commentEntity.create({
      taskId: commentDto.taskId,
      content: commentDto.content,
      createdBy: commentDto.createdBy,
      creator: commentDto.creator,
      projectId: commentDto.projectId,
    });
    return new SuccessResponseDto(true);
  }

  async getComment(projectId: number, commentOptionsDto: CommentOptionsDto): Promise<PageDto<CommentDto>> {
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

    if (!isNil(commentOptionsDto)) {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (!isNil(commentOptionsDto.startDate) && !isNil(commentOptionsDto.endDate)) {
        startDate = moment(commentOptionsDto.startDate).startOf('day').toISOString();
        endDate = moment(commentOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.between]: [startDate, endDate] },
        });
      } else if (!isNil(commentOptionsDto.startDate) && isNil(commentOptionsDto.endDate)) {
        startDate = moment(commentOptionsDto.startDate).startOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.gte]: startDate },
        });
      } else if (isNil(commentOptionsDto.startDate) && !isNil(commentOptionsDto.endDate)) {
        endDate = moment(commentOptionsDto.endDate).endOf('day').toISOString();
        Object.assign(condition, {
          reportDate: { [Op.lte]: endDate },
        });
      }
    

      if (!isNil(commentOptionsDto.q)) {
        Object.assign(condition, {
          [Op.or]: {
            taskId: { [Op.substring]: commentOptionsDto.q },
            note: { [Op.substring]: commentOptionsDto.q },
          },
        });
      }
    }
    const results = await this.commentEntity.findAndCountAll({
      where: condition,
      order: [
        ['reportDate', 'DESC'],
        [userProjectRelation, userRelation, 'username', 'ASC'],
      ],
      include: [userProjectRelation, dailyReportActivitiesRelation],
      limit: commentOptionsDto.take,
      offset: commentOptionsDto.skip,
      distinct: true,
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: commentOptionsDto, itemCount: results.count });
    const items = results.rows;

    return items.toPageDto(pageMetaDto);
  }


  async getDetailComment(CommentId: number): Promise<CommentEntity | null> {
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
    return await this.commentEntity.findOne({
      where: {
        id: CommentId,
      },
      include: [userProjectRelation, dailyReportActivitiesRelation],
    });
  }

  async updateComment(comment: CommentEntity, commentDto: CreateCommentDto): Promise<SuccessResponseDto> {
    await comment.update({
       taskId: commentDto.taskId,
      content: commentDto.content,
      createdBy: commentDto.createdBy,
      creator: commentDto.creator,
      projectId: commentDto.projectId,
    });
    return new SuccessResponseDto(true);
  }

 
  async deleteComment(commentId: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.commentEntity.destroy({
      where: {
        commentId,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }

}
