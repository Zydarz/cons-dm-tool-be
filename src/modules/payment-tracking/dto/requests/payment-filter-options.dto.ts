import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentNS } from '../../interfaces/payment-tracking';
export class PaymentFilterOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PaymentNS.Status)
  readonly status?: PaymentNS.Status = PaymentNS.Status.ALL;

  @ApiProperty()
  @IsString()
  projectId: string;
}
