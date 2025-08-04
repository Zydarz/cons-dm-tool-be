import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterDataDto } from '../../../../modules/master-data/dtos/master-data.dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as ProjectEntity } from '../../../../entities/project.entity';
import { ResourceAllocateDto } from './resource-allocate-dto';

export type ProjectAllocatelDtoOptions = Partial<{ resources: ResourceAllocateDto[]; positions: MasterDataDto[] }>;

export class ProjectAllocateDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: () => [ResourceAllocateDto] })
  resources?: ResourceAllocateDto[];

  @ApiPropertyOptional({ type: () => [MasterDataDto] })
  positions?: MasterDataDto[];

  @ApiProperty()
  status?: string;

  constructor(project: ProjectEntity, options?: ProjectAllocatelDtoOptions) {
    super(project);
    this.name = project.name;
    this.status = project.status;
    this.resources = options?.resources;
    this.positions = options?.positions;
  }
}
