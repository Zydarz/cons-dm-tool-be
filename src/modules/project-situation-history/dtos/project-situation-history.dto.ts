import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../../modules/projects/dto/responses/project-dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { default as ProjectSituationEntity } from '../../../entities/project-situation.entity';
import { UserDto } from '../../../modules/users/dto/response/user-dto';
import ProjectSituationHistoryEntity from '../../../entities/project-situation-history.entity';

export class ProjectSituationHistoryDto extends AbstractDto {
  @ApiProperty()
  readonly submitterId: string;

  @ApiProperty()
  readonly projectSituationId: number;

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


  constructor(projectSituationHistoryEntity: ProjectSituationHistoryEntity) {
    super(projectSituationHistoryEntity);
    this.projectSituationId = projectSituationHistoryEntity.projectSituationId;
    this.submitterId = projectSituationHistoryEntity.submitterId;
    this.projectId = projectSituationHistoryEntity.projectId;
    this.note = projectSituationHistoryEntity.note;
    this.flag = projectSituationHistoryEntity.flag;
    this.date = projectSituationHistoryEntity.date;
    if (projectSituationHistoryEntity.submitter) {
      this.submitter = new UserDto(projectSituationHistoryEntity.submitter);
    }
  }
}
