import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class OtherCostFilterDto extends PageOptionsDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  year?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  departmentIds?: string[]

}
