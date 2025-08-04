import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table, HasMany } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { MasterDataDto, SettingOtherCostDto } from '../modules/master-data/dtos/master-data.dto';
import OtherCostEntity from './other-cost.entity';

@Table({ modelName: 'setting_other_cost', freezeTableName: true })
@UseDto(SettingOtherCostDto)
export default class SettingOtherCostEntity extends AbstractEntity<SettingOtherCostDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.DOUBLE(8, 4), defaultValue: 1 })
  order: number;

  @Column({ type: DataType.NUMBER })
  flag_protected: number;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => OtherCostEntity, 'settingOtherCostId')
  other_cost: OtherCostEntity[];
}
