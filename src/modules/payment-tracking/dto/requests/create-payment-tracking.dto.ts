import { IsString, IsNumber, IsDateString, IsOptional, Length, Max, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentNS } from '../../interfaces/payment-tracking';
export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Max(99999)
  @Min(0)
  effort: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Max(999999999999999)
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  amountVND?: number;

  @ApiProperty()
  @IsDateString()
  paydate: Date;

  @ApiProperty()
  @IsString()
  status: PaymentNS.Status;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(300)
  note?: string;

  @ApiProperty()
  @IsNumber()
  projectId: number;
}
