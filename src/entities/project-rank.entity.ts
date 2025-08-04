import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { MasterDataDto, ProjectRankDto } from '../modules/master-data/dtos/master-data.dto';

@Table({ modelName: 'project_rank', freezeTableName: true })
@UseDto(ProjectRankDto)
export default class ProjectRankEntity extends AbstractEntity<ProjectRankDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @DeletedAt
  deletedAt: Date;
}
