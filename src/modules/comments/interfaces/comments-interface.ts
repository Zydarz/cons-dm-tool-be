import { CreateCommentDto } from '../../comments/dto/requests/create-comment-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { CommentOptionsDto } from '../dto/requests/comments-filter-options.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { CommentDto } from '../dto/responses/comments-dto';
import { default as CommentEntity } from '../../../entities/comments.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';

export namespace CommentNS {


  export interface ICommentService {
    createComment(commentDto: CreateCommentDto): Promise<SuccessResponseDto>;
    updateComment(commentId: number,  updateCommentDto: CreateCommentDto): Promise<SuccessResponseDto>;
    getDetailComment(commentId: number): Promise<CommentDto | null>;
    deleteComment(commentId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getComment(commentId: number, commentOptionsDto: CommentOptionsDto): Promise<PageDto<CommentDto>>;
  }
  export interface ICommentRepository {
    createComment(commentDto: CreateCommentDto): Promise<SuccessResponseDto>;
    updateComment(comment: CommentEntity, updateCommentDto: CreateCommentDto): Promise<SuccessResponseDto>;
    getDetailComment(commentId: number): Promise<CommentEntity | null>;
    deleteComment(commentId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getComment(commentId: number, commentOptionsDto: CommentOptionsDto): Promise<PageDto<CommentDto>>;
  }

  export const errMsg = {
    CommentNotFound: new NotFoundException('Log Work Not Found'),
    UserPermission: new ForbiddenException('User Permission'),
  };
}
