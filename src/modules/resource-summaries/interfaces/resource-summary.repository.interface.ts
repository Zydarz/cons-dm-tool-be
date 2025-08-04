import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { default as ResourceSummaryEntity } from '../../../entities/resource-summary.entity';
import { TotalResourceProjectDto } from '../dtos/responses/total-resource-summary.dto';
import { CreateResourceSummaryDto } from '../dtos/requests/create-resource-summary.dto';
import { ResourceSummaryDto } from '../dtos/resource-summary.dto';

export interface IResourceSummaryRepository {
  getAll(projectId: number): Promise<ResourceSummaryEntity[]>;
  getResourceSummary(projectId: number, year: number, month: number): Promise<ResourceSummaryEntity | null>;
  getToTalResourceProject(projectId: number): Promise<TotalResourceProjectDto>;
  getAllSummary(projectId: number): Promise<ResourceSummaryEntity[]>;
  getToTalResourceProjects(projectIds: number, date: Date): Promise<TotalResourceProjectDto>;
  deleteResourceSummaryByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
  createResourceSummary(dto: CreateResourceSummaryDto): Promise<ResourceSummaryDto>;
}
