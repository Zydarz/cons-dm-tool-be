import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as OtherCostEntity } from 'entities/other-cost.entity';
import { DepartmentDto, SettingOtherCostDto } from '../../../../modules/master-data/dtos/master-data.dto';

export class OtherCostDto extends AbstractDto {

  @ApiProperty()
  settingOtherCostId: Number;

  @ApiProperty()
  departmentId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  note?: string;

  @ApiPropertyOptional()
  settingOtherCostName?: String;

  @ApiProperty()
  amountTotal?: Number;

  constructor(otherCost: OtherCostEntity) {
    super(otherCost);
    this.settingOtherCostId = otherCost.settingOtherCostId;
    this.departmentId = otherCost.departmentId;
    this.year = otherCost.year;
    this.month = otherCost.month;
    this.amount = otherCost.amount;
    this.note = otherCost.note;
    this.settingOtherCostName = otherCost.settingOtherCost?.name;
    this.amountTotal = otherCost.amountTotal;
  }
}
