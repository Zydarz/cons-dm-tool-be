import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { ResourceSummaryDto } from '../modules/resource-summaries/dtos/resource-summary.dto';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { default as ProjectEntity } from './project.entity';
import { default as UserEntity } from './users.entity';

@Table({ modelName: 'resource_summaries' })
@UseDto(ResourceSummaryDto)
export default class ResourceSummaryEntity extends AbstractEntity<ResourceSummaryDto> {
  @Column({ type: DataType.INTEGER })
  projectId: number;

  @Column({ type: DataType.STRING })
  committerId?: string;

  @Column({ type: DataType.INTEGER })
  year: number;

  @Column({ type: DataType.INTEGER })
  month: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  committed: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  allocated: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  temporaryAdded: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  actual: number;

  committedTotal?: number;

  allocatedTotal?: number;

  temporaryAddedTotal?: number;

  actualTotal?: number;

  @BelongsTo(() => ProjectEntity, 'projectId')
  project?: ProjectEntity;

  @BelongsTo(() => UserEntity, 'committerId')
  committer?: UserEntity;
}
