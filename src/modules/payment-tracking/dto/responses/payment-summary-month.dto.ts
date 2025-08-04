import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';
import { PaymentDto } from './payment-dto';
import { TotalSummaryDto } from './summary.dto';
export class PaymentSummaryDto extends TotalSummaryDto {
  @ApiProperty()
  month?: string;

  @ApiProperty()
  project?: ProjectDto;

  @ApiProperty()
  payments: PaymentDto[];
  constructor(total: TotalSummaryDto, payment: PaymentDto[], month?: string, project?: ProjectDto) {
    super(total);
    this.month = month;
    this.project = project;
    this.payments = payment;
  }
}
