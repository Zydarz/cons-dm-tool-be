import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional, Length, Max, Min, MaxLength } from 'class-validator';
import { PaymentNS } from '../../interfaces/payment-tracking';
export class UpdatePaymentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Max(99999)
  @Min(0)
  effort?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Max(999999999999999)
  @Min(0)
  amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Max(999999999999999)
  @Min(0)
  amountVND?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  paydate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: PaymentNS.Status;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;
}
