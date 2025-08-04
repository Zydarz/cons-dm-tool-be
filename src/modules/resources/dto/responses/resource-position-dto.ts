import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterDataDto } from '../../../../modules/master-data/dtos/master-data.dto';
import { ResourceAllocateDto } from './resource-allocate-dto';
import ResourceEntity from '../../../../entities/resource.entity';

export class ResourcePositionDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  positionId?: number;

  constructor(resource: ResourceEntity) {
    this.id = resource.id;
    this.positionId = resource.positionId;
  }
}
