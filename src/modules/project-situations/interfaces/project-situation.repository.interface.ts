import { default as ProjectSituationEntity } from '../../../entities/project-situation.entity';
import { PageDto } from '../../../common/dto/page.dto';
import { ProjectSituationDto } from '../dtos/project-situation.dto';
import { CreateProjectSituationDto } from '../dtos/requests/create-project-situation.dto';
import { GetAllProjectSituationDto } from '../dtos/requests/get-project-situations.dto';
import { Transaction } from 'sequelize';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { FilterDto } from '../dtos/requests/filter-project-situation.dto';
import { updatedByProjectDto } from '../dtos/responses/updated-by-project.response.dto';
import { projectSituationDetailDto } from '../dtos/responses/project-situation-detail.response.dto';

export interface IProjectSituationRepository {
  getAll(dto: GetAllProjectSituationDto): Promise<PageDto<ProjectSituationDto>>;
  createProjectSituation(
    userId: string,
    dto: CreateProjectSituationDto,
    index: number,
  ): Promise<ProjectSituationEntity>;
  deleteProjectSituation(flag: number, id?: number, del?: string): Promise<number>;
  findById(id: number): Promise<ProjectSituationEntity | null>;
  getLastSitualation(id: number): Promise<ProjectSituationEntity[]>;
  deleteProjectSituationByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
  getGroupMax(): Promise<ProjectSituationEntity[]>;
  getArrayByGroup(filter: FilterDto);
  getSituationByProjectId(projectId: number, filter: FilterDto): Promise<ProjectSituationDto[]>;
  getFlag(filter: FilterDto, option?: string, month?: number, year?: number): Promise<number[]>;
  getSituationByFlag(flag: number, filter: FilterDto): Promise<ProjectSituationDto[]>;
  deleteSituationWhenEdit(flag: number, id: number[]): Promise<number>;
  getSituationByflag(flag: number): Promise<number[]>;
  getUpdatedByProject(projectId: number): Promise<updatedByProjectDto[]>;
  getSituationById(id: number): Promise<projectSituationDetailDto>;

}
