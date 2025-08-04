import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ResourceNS } from '../../../../modules/resources/interfaces/resource';

export class FilterUserSummaryDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly month: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ResourceNS.TypeComparisons)
  readonly type?: ResourceNS.TypeComparisons = ResourceNS.TypeComparisons.ALL;

  @ApiPropertyOptional()
  @IsOptional()
  comma?: string;

  @ApiPropertyOptional()
  @IsOptional()
  percent: string;

  @ApiPropertyOptional()
  @IsOptional()
  lineId?: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  positionIds?: number[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  memberIds?: String[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  divisionIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  projectDepartmentIds?: number[];
}
