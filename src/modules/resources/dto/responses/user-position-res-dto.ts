import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceAllocateDto } from './resource-allocate-dto';
import { UserDto } from '../../../users/dto/response/user-dto';
import { PositionResourcesAllocateDto } from './position-resources-allocate-dto';

export type UserAllocatelDtoOptions = Partial<{
  resources: ResourceAllocateDto[];
  positions: PositionResourcesAllocateDto[];
}>;

export class UserPostionResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  mail?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  departmentId?: number;

  @ApiPropertyOptional({ type: () => [PositionResourcesAllocateDto] })
  positions?: PositionResourcesAllocateDto[];

  constructor(userDto: UserDto, options?: UserAllocatelDtoOptions) {
    this.id = userDto.id;
    this.mail = userDto.mail;
    this.name = userDto.displayName;
    this.username = userDto.username;
    this.departmentId = userDto.departmentId;
    this.positions = options?.positions;
  }
}
