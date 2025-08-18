import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class LogWorkFilterOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly userId?: string;

  @IsOptional()
  @IsString()
  projects?: string; // Dạng '1,2,3'

  @IsOptional()
  @IsString()
  members?: string; // Dạng '1,2,3'
}
