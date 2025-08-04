import { default as ProjectSituationEntity } from '../../../entities/project-situation.entity';
import { PageDto } from '../../../common/dto/page.dto';
import { Transaction } from 'sequelize';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import ProjectSituationHistoryEntity from '../../../entities/project-situation-history.entity';
import { CreateProjectSituationHistoryDto } from '../dtos/requests/create-project-situation-history.dto';

export interface IProjectSituationHistoryRepository {
  createProjectSituationHistory(
    dto: CreateProjectSituationHistoryDto,
  ): Promise<ProjectSituationHistoryEntity>;

  getProjectSituationHistoryByProjectSituationId(
    projectSituationId: number,
  ): Promise<ProjectSituationHistoryEntity[]>;
}
