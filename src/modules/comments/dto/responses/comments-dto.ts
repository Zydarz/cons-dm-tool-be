import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as CommentEntity }  from '../../../../entities/comments.entity';
export class CommentDto extends AbstractDto {
  @ApiPropertyOptional()
  readonly taskId?: number;

  @ApiPropertyOptional()
  readonly projectId?: number;

  @ApiProperty()
  readonly createdBy: number;

  @ApiProperty()
  readonly creator: string;

  @ApiPropertyOptional()
  readonly content?: string;

  constructor(commentEntity: CommentEntity) {
    super(commentEntity);
    this.taskId = commentEntity.taskId;
    this.projectId = commentEntity.projectId;
    this.createdBy = commentEntity.createdBy;
    this.creator = commentEntity.creator;
    this.content = commentEntity.content;
  }
}