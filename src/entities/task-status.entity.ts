import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { TaskStatusDto } from '../modules/master-data/dtos/master-data.dto';

@Table({ modelName: 'task_status', freezeTableName: true })
@UseDto(TaskStatusDto)
export default class TaskStatusEntity extends AbstractEntity<TaskStatusDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @DeletedAt
  deletedAt: Date;
}
