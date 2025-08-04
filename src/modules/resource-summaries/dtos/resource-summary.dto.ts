import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { default as UserEntity } from '../../../entities/users.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { default as ResourceSummaryEntity } from '../../../entities/resource-summary.entity';
import { ProjectDto } from '../../projects/dto/responses/project-dto';

export class ResourceSummaryDto extends AbstractDto {
  @ApiProperty()
  projectId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  committerId?: string;

  @ApiProperty()
  year?: number;

  @ApiProperty()
  month?: number;

  @ApiProperty()
  committed?: number;

  @ApiProperty()
  allocated?: number;

  @ApiProperty()
  temporaryAdded?: number;

  @ApiProperty()
  actual: number;

  @ApiProperty()
  project?: ProjectDto;

  @ApiPropertyOptional()
  committer?: UserEntity;

  @ApiPropertyOptional()
  committedTotal?: number;

  @ApiPropertyOptional()
  allocatedTotal?: number;

  @ApiPropertyOptional()
  temporaryAddedTotal?: number;

  @ApiPropertyOptional()
  actualTotal?: number;

  constructor(resourceSummary: ResourceSummaryEntity) {
    super(resourceSummary);
    this.projectId = resourceSummary.projectId;
    this.committerId = resourceSummary.committerId;
    this.year = resourceSummary.year;
    this.month = resourceSummary.month;
    this.committed = resourceSummary.committed;
    this.allocated = resourceSummary.allocated;
    this.temporaryAdded = resourceSummary.temporaryAdded;
    this.project = resourceSummary.project?.toDto();
    this.committer = resourceSummary.committer;
    this.committedTotal = resourceSummary.committedTotal;
    this.allocatedTotal = resourceSummary.allocatedTotal;
    this.temporaryAddedTotal = resourceSummary.temporaryAddedTotal;
    this.actual = resourceSummary.actual;
    this.actualTotal = resourceSummary.actualTotal;
  }
}
