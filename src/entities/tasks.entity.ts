import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { TaskDto } from '../modules/tasks/dto/responses/task-dto'; // Sửa đường dẫn import

@Table({ modelName: 'tasks' })
@UseDto(TaskDto)
export default class TaskEntity extends AbstractEntity<TaskDto> {
  @Column({ type: DataType.INTEGER })
  taskId?: number;

  @Column({ type: DataType.STRING(3000), allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.INTEGER })
  projectId?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  createdBy: number;

  @Column({ type: DataType.INTEGER })
  assignee?: number;

  @Column({ type: DataType.INTEGER })
  effort?: number;

  @Column({ type: DataType.DATE })
  startDate?: Date;

  @Column({ type: DataType.DATE })
  endDate?: Date;

  @Column({ type: DataType.INTEGER })
  status?: number;

  @Column({ type: DataType.INTEGER })
  priority?: number;

  @DeletedAt
  deletedAt?: Date;
}