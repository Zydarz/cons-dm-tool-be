import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table, HasMany, BelongsTo } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { OtherCostDto } from '../modules/other-cost/dto/responses/other-cost.dto';
import SettingOtherCostEntity from './setting-other-cost.entity';
import DepartmentEntity from './department.entity';

@Table({ modelName: 'other_cost', freezeTableName: true })
@UseDto(OtherCostDto)
export default class OtherCostEntity extends AbstractEntity<OtherCostDto> {

  @Column({ type: DataType.INTEGER })
  settingOtherCostId: number;

  @Column({ type: DataType.INTEGER })
  departmentId: number;

  @Column({ type: DataType.INTEGER })
  amount: number;

  @Column({ type: DataType.INTEGER })
  year: number;

  @Column({ type: DataType.INTEGER })
  month: number;

  @Column({ type: DataType.INTEGER })
  date: Date;

  @Column({ type: DataType.TEXT })
  note?: string;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => SettingOtherCostEntity, 'settingOtherCostId')
  settingOtherCost?: SettingOtherCostEntity;

  amountTotal?: number;
}
