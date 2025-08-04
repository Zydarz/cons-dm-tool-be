import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { TotalResourceProjectDto } from '../../../resource-summaries/dtos/responses/total-resource-summary.dto';
import { ProjectDto } from './project-dto';

export class InformationProjectResponseDto {
  @ApiPropertyOptional()
  @IsOptional()
  startDatePlan?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDatePlan?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startDateActual?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDateActual?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  committed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  allocated?: number;

  @ApiPropertyOptional()
  @IsOptional()
  temporaryAdded?: number;

  @ApiPropertyOptional()
  @IsOptional()
  actual?: number;

  @ApiPropertyOptional()
  @IsOptional()
  channelId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  groupId?: string;

  constructor(projectDto?: ProjectDto, totalResourceProjectDto?: TotalResourceProjectDto) {
    this.startDatePlan = projectDto?.startDate;
    this.endDatePlan = projectDto?.endDate;
    this.startDateActual = projectDto?.startDateActual;
    this.endDateActual = projectDto?.endDateActual;
    this.budget = projectDto?.budget ?? 0;
    this.committed = totalResourceProjectDto?.committedTotal ?? 0;
    this.allocated = totalResourceProjectDto?.allocatedTotal ?? 0;
    this.temporaryAdded = totalResourceProjectDto?.temporaryAddedTotal ?? 0;
    this.actual = totalResourceProjectDto?.actualTotal ?? 0;
    this.channelId = projectDto?.channelId;
    this.groupId = projectDto?.groupId;
  }
}
