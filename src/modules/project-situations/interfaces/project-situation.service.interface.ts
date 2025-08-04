import { UserNS } from '../../../modules/users/interface/users';
import { PageDto } from '../../../common/dto/page.dto';
import { ProjectSituationDto } from '../dtos/project-situation.dto';
import { CreateProjectSituationDtos } from '../dtos/requests/create-project-situation.dto';
import { EditProjectSituationDtos } from '../dtos/requests/edit-project-situation.dto';
import { GetAllProjectSituationDto } from '../dtos/requests/get-project-situations.dto';
import { default as ProjectSituationEntity } from '../../../entities/project-situation.entity';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { FilterDto } from '../dtos/requests/filter-project-situation.dto';
import { ProjectSituationAllDto, ProjectSituationFlag } from '../dtos/responses/project-situation-group.dto';
import { ProjectSituationResponseDto } from '../dtos/responses/project-situation.response.dto';
import { updatedByProjectDto } from '../dtos/responses/updated-by-project.response.dto';
import { projectSituationDetailDto } from '../dtos/responses/project-situation-detail.response.dto';

export interface IProjectSituationService {
  getAll(dto: GetAllProjectSituationDto): Promise<PageDto<ProjectSituationDto>>;
  createProjectSituation(
    userId: string,
    role: UserNS.Roles,
    dto: CreateProjectSituationDtos,
    username?: string,
  ): Promise<ProjectSituationResponseDto[]>;
  deleteProjectSituation(
    id: number,
    flag: number,
    role: UserNS.Roles,
    del?: string,
    username?: string,
  ): Promise<boolean>;
  editProjectSituation(
    userId: string,
    dto: EditProjectSituationDtos,
    role: UserNS.Roles,
    username?: string,
  ): Promise<ProjectSituationDto[]>;
  lastSitualation(projectId: number): Promise<ProjectSituationEntity>;
  deleteProjectSituationByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
  getProjectSituationByGroup(filter: FilterDto): Promise<ProjectSituationAllDto[] | PageDto<ProjectSituationFlag>>;
  getUpdatedByProject(projectId: number): Promise<updatedByProjectDto[]>;
  getProjectSituationbyId(id: number): Promise<projectSituationDetailDto>;
}
