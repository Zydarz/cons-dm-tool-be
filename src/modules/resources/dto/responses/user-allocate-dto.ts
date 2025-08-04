import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceAllocateDto } from './resource-allocate-dto';
import { UserDto } from '../../../users/dto/response/user-dto';
import { MasterDataDto } from '../../../../modules/master-data/dtos/master-data.dto';

export type UserAllocatelDtoOptions = Partial<{ resources: ResourceAllocateDto[]; positions: MasterDataDto[] }>;

export class UserAllocateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: () => [ResourceAllocateDto] })
  resources?: ResourceAllocateDto[];

  @ApiPropertyOptional({ type: () => [MasterDataDto] })
  positions?: MasterDataDto[];

  constructor(userDto: UserDto, options?: UserAllocatelDtoOptions) {
    this.id = userDto.id;
    this.name = userDto.displayName;
    this.resources = options?.resources;
    this.positions = options?.positions;
  }
}
