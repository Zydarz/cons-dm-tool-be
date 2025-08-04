import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateOtherCostDto {

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly settingOtherCostId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly note: string;

}
