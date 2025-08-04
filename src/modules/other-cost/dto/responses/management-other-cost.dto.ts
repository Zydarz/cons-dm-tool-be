
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as OtherCostEntity } from 'entities/other-cost.entity';

// import OtherCostEntity from 'entities/other-cost.entity';

export class ManagementOtherCostDto {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  departmentId?: string;

  @ApiProperty()
  amountTotal?: Number;

  constructor(year: number, month: number, date: Date, departmentId: string, amountTotal: number) {
    this.year = year;
    this.month = month;
    this.date = date;
    this.departmentId = departmentId;
    this.amountTotal = amountTotal;
  }
}
