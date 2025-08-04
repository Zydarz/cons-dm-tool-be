import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { DaysOffDto } from '../modules/days-off/dto/response/days-off-dto';

@Table({ modelName: 'day-offs' })
@UseDto(DaysOffDto)
export default class DaysOffEntity extends AbstractEntity<DaysOffDto> {
  @Column({ type: DataType.DATE })
  date: Date;

  @Column({ type: DataType.TEXT })
  note?: string;

  @Column({ type: DataType.STRING })
  idSame?: string;

  @Column({ type: DataType.STRING })
  edit?: string;
}
