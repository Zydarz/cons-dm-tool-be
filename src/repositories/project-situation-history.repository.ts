import { Inject } from '@nestjs/common';
import { isNil } from 'lodash';
import ProjectSituationHistoryEntity from '../entities/project-situation-history.entity';
import { IProjectSituationHistoryRepository } from '../modules/project-situation-history/interfaces/project-situation-history.repository.interface';
import { CreateProjectSituationHistoryDto } from '../modules/project-situation-history/dtos/requests/create-project-situation-history.dto';
import UserEntity from '../entities/users.entity';

export class ProjectSituationProjectRepository implements IProjectSituationHistoryRepository {
  constructor(
    @Inject(ProjectSituationHistoryEntity.name) private readonly projectSituationHistoryEntity: typeof ProjectSituationHistoryEntity,
  ) {}

  async createProjectSituationHistory(
    dto: CreateProjectSituationHistoryDto,
  ): Promise<ProjectSituationHistoryEntity> {
    const projectSituation = await this.projectSituationHistoryEntity.create({ ...dto});
    return projectSituation;
  }

  async getProjectSituationHistoryByProjectSituationId(
    projectSituationId: number,
  ): Promise<ProjectSituationHistoryEntity[]> {
    return await this.projectSituationHistoryEntity.findAll({
      where: {
        projectSituationId,
      },
      attributes: ['id', 'projectSituationId', 'submitterId', 'createdAt'],
      include: [
        {
          model: UserEntity,
          as: 'submitter',
          required: true,
          attributes: ['id', 'displayName', 'username'],
        },
      ],
    });
  }
}
