import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as ProjectEntity } from '../../../../entities/project.entity';
import { PositionResourcesAllocateDto } from './position-resources-allocate-dto';

export type ProjectAllocatelDtoOptions = Partial<{
  positions: PositionResourcesAllocateDto[];
}>;

export class ProjectResourceSummaryDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: () => [PositionResourcesAllocateDto] })
  positions?: PositionResourcesAllocateDto[];

  @ApiProperty()
  status?: string;

  constructor(project: ProjectEntity, options?: ProjectAllocatelDtoOptions) {
    super(project);
    this.name = project.name;
    this.status = project.status;
    this.positions = options?.positions;
  }
}
