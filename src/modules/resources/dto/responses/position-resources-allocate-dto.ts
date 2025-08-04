import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterDataDto } from '../../../../modules/master-data/dtos/master-data.dto';
import { ResourceAllocateDto } from './resource-allocate-dto';

export class PositionResourcesAllocateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code?: string;

  @ApiPropertyOptional()
  actualEffort?: number;

  @ApiPropertyOptional({ type: () => [ResourceAllocateDto] })
  resources?: ResourceAllocateDto[];
  constructor(position: MasterDataDto) {
    this.id = position.id;
    this.name = position.name;
    this.code = position.code;
  }
}
