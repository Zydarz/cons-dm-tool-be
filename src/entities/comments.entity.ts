import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { CommentDto } from '../modules/comments/dto/responses/comments-dto';

@Table({ modelName: 'comments' })
@UseDto(CommentDto)
export default class CommentEntity extends AbstractEntity<CommentDto> {
  @Column({ type: DataType.INTEGER })
  taskId?: number;

  @Column({ type: DataType.INTEGER })
  projectId?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  createdBy: number;

  @Column({ type: DataType.STRING, allowNull: false })
  creator: string;

  @Column({ type: DataType.TEXT })
  content?: string;

  @DeletedAt
  deletedAt?: Date;
}