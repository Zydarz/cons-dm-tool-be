import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/response/user-dto';
import { ProjectDto } from './project-dto';

export class InformationProjectPmResponseDto {
  @ApiProperty({ type: () => [ProjectDto] })
  project?: ProjectDto;

  @ApiProperty({ type: () => [UserDto] })
  user?: UserDto[];

  constructor(projectDto?: ProjectDto) {
    this.project = projectDto;
    this.user = projectDto?.user;
  }
}
