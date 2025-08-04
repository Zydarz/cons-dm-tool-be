import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, HasMany, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { default as UserEntity } from './users.entity';
import { LineDto } from '../modules/master-data/dtos/master-data.dto';

@Table({ modelName: 'lines' })
@UseDto(LineDto)
export default class LineEntity extends AbstractEntity<LineDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @Column({ type: DataType.NUMBER})
  flag_protected: number;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => UserEntity, 'lineId')
  users: UserEntity[];
}
