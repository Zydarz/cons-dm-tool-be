import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table, BelongsTo } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { ResourceDto } from '../modules/resources/dto/responses/resource-dto';
import { default as UserProjectEntity } from './user_project.entity';
import { default as PositionEntity } from './position.entity';
import { default as ProjectRankEntity } from './project-rank.entity';

@Table({ modelName: 'resources' })
@UseDto(ResourceDto)
export default class ResourceEntity extends AbstractEntity<ResourceDto> {
  @Column({ type: DataType.BIGINT })
  userProjectId: number;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column({ type: DataType.INTEGER })
  acPercent: number;

  @Column({ type: DataType.INTEGER })
  tcPercent?: number;

  @Column({ type: DataType.BIGINT })
  positionId: number;

  @Column({ type: DataType.BIGINT })
  projectRankId: number;

  @Column({ type: DataType.TEXT })
  note: string;

  @Column({ type: DataType.INTEGER })
  checkDayoff?: number;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => UserProjectEntity, 'userProjectId')
  userProject?: UserProjectEntity;

  @BelongsTo(() => PositionEntity, 'positionId')
  position?: PositionEntity;

  @BelongsTo(() => ProjectRankEntity, 'projectRankId')
  projectRank?: ProjectRankEntity;

  acPercentTotal?: number;

  tcPercentTotal?: number;

  startDate?: Date;

  endDate?: Date;

  count?: number;
}
