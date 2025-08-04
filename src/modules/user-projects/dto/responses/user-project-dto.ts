import { ResourceDto } from './../../../resources/dto/responses/resource-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as UserProjectEntity } from '../../../../entities/user_project.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserDto } from '../../../users/dto/response/user-dto';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';

export class UserProjectDto extends AbstractDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly projectId: number;

  @ApiPropertyOptional({ type: () => [ResourceDto] })
  resources?: ResourceDto[];

  @ApiPropertyOptional()
  projects?: ProjectDto;

  @ApiPropertyOptional()
  users?: UserDto;

  constructor(userProject: UserProjectEntity) {
    super(userProject);
    this.userId = userProject.userId;
    this.projectId = userProject.projectId;
    this.users = userProject.users?.get();
    this.projects = userProject.projects?.toDto();
    this.resources = userProject.resources?.toDtos();
  }
}
