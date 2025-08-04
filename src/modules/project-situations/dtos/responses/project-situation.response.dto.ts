import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as ProjectSituationEntity } from '../../../../entities/project-situation.entity';
import { UserDto } from '../../../../modules/users/dto/response/user-dto';
import { default as UserEntity } from '../../../../entities/users.entity';
import { ProjectSituationHistoryDto } from '../../../../modules/project-situation-history/dtos/project-situation-history.dto';

export class ProjectSituationResponseDto extends AbstractDto {
  @ApiProperty()
  readonly submitterId: string;

  @ApiProperty()
  readonly projectId: number;

  @ApiProperty()
  readonly note: string;

  @ApiProperty()
  readonly flag: number;

  @ApiProperty()
  readonly date: Date;

  @ApiProperty()
  readonly submitter?: UserDto;

  @ApiProperty()
  readonly project?: ProjectDto;

  @ApiProperty()
  readonly projectSituationHistory?: ProjectSituationHistoryDto[];

  constructor(projectSituationEntity: ProjectSituationEntity, user?: UserEntity, project?: ProjectDto, projectSituationHistory?: ProjectSituationHistoryDto[]) {
    super(projectSituationEntity);
    this.submitterId = projectSituationEntity.submitterId;
    this.projectId = projectSituationEntity.projectId;
    this.note = projectSituationEntity.note;
    this.flag = projectSituationEntity.flag;
    if (user) {
      this.submitter = new UserDto(user);
    }
    this.project = project;
    this.date = projectSituationEntity.date;
    this.projectSituationHistory = projectSituationHistory?.toDtos();
  }
}
