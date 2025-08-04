import { default as TeamLogsEntity } from '../../../entities/team-logs.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class TeamLogsDto extends AbstractDto {
  projectId: number;

  projectName: string;

  errorMessage: string;

  constructor(teamLogsEntity: TeamLogsEntity) {
    super(teamLogsEntity);
    this.projectId = teamLogsEntity.projectId;
    this.projectName = teamLogsEntity.project.name;
    this.errorMessage = teamLogsEntity.errorMessage;
  }
}
