import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/response/user-dto';
import { ProjectAllocateDto } from './project-allocate-dto';

export type UserResourceAllocatelDtoOptions = Partial<{ projectAllocate: ProjectAllocateDto[] }>;

export class UserResourceAllocateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  mail: string;

  @ApiPropertyOptional()
  line?: string;

  @ApiPropertyOptional()
  allocates?: ProjectAllocateDto[];

  constructor(userDto: UserDto, options?: UserResourceAllocatelDtoOptions) {
    this.id = userDto.id;
    this.name = userDto.displayName;
    this.username = userDto.username;
    this.mail = userDto.mail;
    this.line = userDto.lineName;
    this.allocates = options?.projectAllocate;
  }
}
