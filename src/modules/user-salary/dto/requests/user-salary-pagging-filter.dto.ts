import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class UserSalaryPaggingFilterDto extends PageOptionsDto {

  @ApiPropertyOptional()
  @IsString()
  year: string;

  @ApiPropertyOptional()
  @IsString()
  month: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly departmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly divisionId?: string;

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  userIds?: string[];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  lineIds?: string[];

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
