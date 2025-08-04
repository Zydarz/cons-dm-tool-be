import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentSummaryGraphicMonthDto } from './payment-summary-graphic-month.dto';
import { TotalEffortGraphicDto } from './total-effort-graphic-dto';

export class PaymentSummaryGraphicAllDto {
  @ApiPropertyOptional()
  data?: PaymentSummaryGraphicMonthDto[];
  @ApiProperty()
  totalPayment: TotalEffortGraphicDto;
  constructor(total: TotalEffortGraphicDto, optionMonth?: PaymentSummaryGraphicMonthDto[]) {
    this.data = optionMonth;
    this.totalPayment = total;
  }
}
