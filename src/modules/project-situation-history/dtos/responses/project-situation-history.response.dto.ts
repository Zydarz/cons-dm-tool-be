import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../../../modules/projects/dto/responses/project-dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserDto } from '../../../../modules/users/dto/response/user-dto';
import { default as UserEntity } from '../../../../entities/users.entity';
import ProjectSituationHistoryEntity from '../../../../entities/project-situation-history.entity';

export class ProjectSituationHistoryResponseDto extends AbstractDto {
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


  constructor(projectSituationHistoryEntity: ProjectSituationHistoryEntity, user?: UserEntity, project?: ProjectDto) {
    super(projectSituationHistoryEntity);
    this.submitterId = projectSituationHistoryEntity.submitterId;
    this.projectId = projectSituationHistoryEntity.projectId;
    this.note = projectSituationHistoryEntity.note;
    this.flag = projectSituationHistoryEntity.flag;
    this.date = projectSituationHistoryEntity.date;
  }
}
