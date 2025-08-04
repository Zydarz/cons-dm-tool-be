import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { JobRankDto } from '../modules/master-data/dtos/master-data.dto';

@Table({ modelName: 'job_rank', freezeTableName: true })
@UseDto(JobRankDto)
export default class JobRankEntity extends AbstractEntity<JobRankDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @DeletedAt
  deletedAt: Date;
}
