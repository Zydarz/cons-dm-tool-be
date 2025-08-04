import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentSummaryDto } from './payment-summary-month.dto';
import { TotalEffortDto } from './total-effort-dto';

export class PaymentSummaryAllDto {
  @ApiPropertyOptional()
  data?: PaymentSummaryDto[];
  @ApiProperty()
  totalPayment: TotalEffortDto;
  constructor(total: TotalEffortDto, optionMonth?: PaymentSummaryDto[]) {
    this.data = optionMonth;
    this.totalPayment = total;
  }
}
