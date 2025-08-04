import { PageDto } from '../../../common/dto/page.dto';
import { Transaction } from 'sequelize';
import ProjectSituationHistoryEntity from '../../../entities/project-situation-history.entity';
import ProjectSituationEntity from '../../../entities/project-situation.entity';

export interface IProjectSituationHistoryService {

  createProjectSituationHistory(
    dto: ProjectSituationEntity,
  ): Promise<ProjectSituationHistoryEntity>;

  getProjectSituationHistoryByProjectSituationId(
    projectSituationId: number,
  ): Promise<ProjectSituationHistoryEntity[]>;
}
