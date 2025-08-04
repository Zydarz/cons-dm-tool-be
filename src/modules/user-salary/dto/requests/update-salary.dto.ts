import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min, Max, Length } from 'class-validator';

export class UpdateSalaryDto {

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 15 })
  @IsOptional()
  @Max(999999999999999)
  @Min(0)
  salary: number;

}
