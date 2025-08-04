import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PageDto } from '../../common/dto/page.dto';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { UserNS } from '../../modules/users/interface/users';
import { isEmpty, isNil } from 'lodash';
import { default as ProjectSituationEntity } from '../../entities/project-situation.entity';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { GroupBy } from '../../common/constants/group-by';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import moment from 'moment';
import { IProjectSituationHistoryService } from './interfaces/project-situation-history.service.interface';
import { IProjectSituationHistoryRepository } from './interfaces/project-situation-history.repository.interface';
import { CreateProjectSituationHistoryDto, CreateProjectSituationHistoryDtos } from './dtos/requests/create-project-situation-history.dto';
import { ProjectSituationHistoryResponseDto } from './dtos/responses/project-situation-history.response.dto';
import ProjectSituationHistoryEntity from '../../entities/project-situation-history.entity';

@Injectable()
export class ProjectSituationHistoryService implements IProjectSituationHistoryService {
  constructor(
    @Inject('IProjectSituationHistoryRepository')
    private readonly projectSituationHistoryRepository: IProjectSituationHistoryRepository,
  ) {}

  async createProjectSituationHistory(
    dto: ProjectSituationEntity,
  ): Promise<ProjectSituationHistoryEntity> {
    let param : CreateProjectSituationHistoryDto = {
      projectSituationId : dto.id,
      submitterId : dto.submitterId,
      projectId : dto.projectId,
      note : dto.note,
      date : dto.date,
      flag : dto.flag,
    }
 
    const projectSituation = await this.projectSituationHistoryRepository.createProjectSituationHistory(param);
    return projectSituation;
  }

  async getProjectSituationHistoryByProjectSituationId(
    projectSituationId: number,
  ): Promise<ProjectSituationHistoryEntity[]>{
    return await this.projectSituationHistoryRepository.getProjectSituationHistoryByProjectSituationId(projectSituationId);
  }

}
