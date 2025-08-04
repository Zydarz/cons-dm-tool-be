import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DetailFullUpdateSalaryDto } from './detail-full-update-salary.dto';
import { Type } from 'class-transformer';

export class FullUpdateSalaryDto {

  @ApiProperty({ type: [DetailFullUpdateSalaryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailFullUpdateSalaryDto)
  create: DetailFullUpdateSalaryDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  delete?: string[];

  @ApiProperty({ type: [DetailFullUpdateSalaryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailFullUpdateSalaryDto)
  update: DetailFullUpdateSalaryDto[];

  @ApiPropertyOptional()
  @IsNumber()
  year: number;

  @ApiPropertyOptional()
  @IsNumber()
  month: number;

  @ApiPropertyOptional()
  @IsString()
  departmentId: string;

}
