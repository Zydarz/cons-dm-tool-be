import { default as PaymentEntity } from '../../entities/payment-tracking.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ComputeEffortDto } from './computeEffort.dto';

export class PaymentResDto {
  @ApiPropertyOptional()
  data: PaymentEntity[];

  @ApiPropertyOptional()
  paymentSum: ComputeEffortDto;
}
