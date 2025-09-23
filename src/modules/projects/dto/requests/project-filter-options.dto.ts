import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ProjectNS } from '../../interfaces/project';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class ProjectFilterOptionsDto extends PageOptionsDto {
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
  readonly projectId: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly customerId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  projectType?: string;
}
