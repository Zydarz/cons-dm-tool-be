import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Max, Min, IsString, IsEnum } from 'class-validator';
import { UserNS } from '../../../../modules/users/interface/users';

export class DetailUpdateSalaryDto {
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
  @IsNumber()
  year: number;

  @ApiPropertyOptional()
  @IsNumber()
  month: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dependent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.Type)
  type?: UserNS.Type;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.Status)
  status: UserNS.Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserNS.KeyPaymentType)
  paymentType: UserNS.KeyPaymentType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  departmentId?: number;
}
