import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { UserNS } from '../../../../modules/users/interface/users';

export class DetailFullUpdateSalaryDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 15 })
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  salary: number;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 15 })
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  socialInsuranceSalary: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dependent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.Type)
  type: UserNS.Type;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.Status)
  status: UserNS.Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.KeyPaymentType)
  paymentType: UserNS.KeyPaymentType;

}
