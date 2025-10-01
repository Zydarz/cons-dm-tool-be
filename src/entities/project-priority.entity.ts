import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { ProjectPriorityDto } from '../modules/master-data/dtos/master-data.dto';

@Table({ modelName: 'project_priorities', freezeTableName: true })
@UseDto(ProjectPriorityDto)
export default class ProjectPriorityEntity extends AbstractEntity<ProjectPriorityDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @DeletedAt
  deletedAt: Date;
}
