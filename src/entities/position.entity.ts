import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, HasMany, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { PositionDto } from '../modules/master-data/dtos/master-data.dto';
import ResourceEntity from './resource.entity';

@Table({ modelName: 'positions' })
@UseDto(PositionDto)
export default class PositionEntity extends AbstractEntity<PositionDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @Column({ type: DataType.STRING })
  code: string;

  @Column({ type: DataType.NUMBER })
  flag_protected: number;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => ResourceEntity, 'positionId')
  resources: ResourceEntity[];
}
