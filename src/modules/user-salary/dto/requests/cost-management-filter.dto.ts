import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class CostManagementFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly endDate: Date;
  
  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  departmentIds?: string[]
}
