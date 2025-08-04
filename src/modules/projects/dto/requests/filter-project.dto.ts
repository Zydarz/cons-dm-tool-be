import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ProjectNS } from '../../interfaces/project';

export class FilterProjectDto {
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
  readonly projectId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: ProjectNS.Status;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;
}
