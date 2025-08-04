import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DetailFullUpdateOtherCostDto } from './detail-full-update-other-cost.dto';
import { Type } from 'class-transformer';

export class FullUpdateOtherCostDto {

  @ApiProperty({ type: [DetailFullUpdateOtherCostDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailFullUpdateOtherCostDto)
  create: DetailFullUpdateOtherCostDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  delete?: string[];

  @ApiProperty({ type: [DetailFullUpdateOtherCostDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailFullUpdateOtherCostDto)
  update: DetailFullUpdateOtherCostDto[];

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
