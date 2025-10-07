import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { PageDto } from '../../common/dto/page.dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateCommentDto } from '../comments/dto/requests/create-comment-dto';
import { CommentOptionsDto } from './dto/requests/comments-filter-options.dto';
import { CommentDto } from './dto/responses/comments-dto';
import { CommentNS } from './interfaces/comments-interface';
import { default as CommentEntity } from '../../entities/comments.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class CommentsService implements CommentNS.ICommentService {
  constructor(
    @Inject('ICommentRepository') private readonly commentRepository: CommentNS.ICommentRepository,
  ) { }
  async  createComment(commentDto: CreateCommentDto): Promise<SuccessResponseDto>{
    await this.commentRepository.createComment(commentDto);

    return new SuccessResponseDto(true);
  }

  async getComment(projectId: number, CommentFilterOptionsDto: CommentOptionsDto): Promise<PageDto<CommentDto>> {
    return await this.commentRepository.getComment(projectId, CommentFilterOptionsDto);
  }

  async getDetailComment(commentId: number): Promise<CommentDto> {
    const comment = await this.findById(commentId);
    return comment.toDto();
  }

  async updateComment(commentId: number, commentDto: CreateCommentDto): Promise<SuccessResponseDto> {
    const comment = await this.findById(commentId);
    return this.commentRepository.updateComment(comment,commentDto);
  }




  async findById(commentId: number): Promise<CommentEntity> {
    const comment = await this.commentRepository.getDetailComment(commentId);
    if (isNil(comment)) {
      throw CommentNS.errMsg.CommentNotFound;
    }
    return comment;
  }

  async deleteComment(commentId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.commentRepository.deleteComment(commentId, t);
  }
}
