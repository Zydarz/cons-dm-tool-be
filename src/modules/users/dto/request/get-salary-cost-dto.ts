import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsDateString, IsNumber } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetSalaryCostDto extends PageOptionsDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  year?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  month?: string;

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  userIds?: string[];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  lineIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  divisionId?: string // departmentId in users table

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string // departmentId in user_salaries table

  @ApiPropertyOptional()
  @IsOptional()
  flagOnsite?: string;
}
