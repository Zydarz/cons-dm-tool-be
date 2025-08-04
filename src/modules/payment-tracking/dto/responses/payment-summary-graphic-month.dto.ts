import { ApiProperty } from '@nestjs/swagger';
import { TotalSummaryGraphicDto } from './summary-graphic.dto';
export class PaymentSummaryGraphicMonthDto extends TotalSummaryGraphicDto {
  @ApiProperty()
  month?: string;

  @ApiProperty()
  projectName?: string;

  constructor(total: TotalSummaryGraphicDto, month?: string, projectName?: string) {
    super(total);
    this.month = month;
    this.projectName = projectName;
  }
}
