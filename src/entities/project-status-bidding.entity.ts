import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { MasterDataDto, ProjectStatusBiddingDto } from '../modules/master-data/dtos/master-data.dto';

@Table({ modelName: 'project_status_bidding', freezeTableName: true })
@UseDto(ProjectStatusBiddingDto)
export default class ProjectStatusBiddingEntity extends AbstractEntity<ProjectStatusBiddingDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @DeletedAt
  deletedAt: Date;
}
