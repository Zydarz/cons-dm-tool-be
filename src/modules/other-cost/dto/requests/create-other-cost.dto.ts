import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateOtherCostDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly settingOtherCostId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly departmentId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  amount: number;

  @ApiPropertyOptional()
  @IsNumber()
  year: number;

  @ApiPropertyOptional()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  exeption?: Number;
}
