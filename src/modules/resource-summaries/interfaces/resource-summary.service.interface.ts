import { AcAndTcPercentTotalDto } from '../../resources/dto/responses/ac-tc-percent-total-dto';
import { CreateResourceDto } from '../../../modules/resources/dto/requests/create-resource-dto';
import { UpdateResourceSummaryDto } from '../dtos/requests/update-resource-summary.dto';
import { UpdateResourceSummaryWhenEditLogworkDto } from '../dtos/requests/update-when-edit-log-work.dto';
import { ResourceSummaryDto } from '../dtos/resource-summary.dto';
import { TotalResourceProjectDto } from '../dtos/responses/total-resource-summary.dto';
import { DiffAcAndTcPercentInterface } from './diff-ac-and-tc-percent.interface';
import { UpdateResourceSummaryType } from '../dtos/enum';
import { default as UserEntity } from '../../../entities/users.entity';
import { ResourceSummaryMonth } from '../dtos/responses/resource-summary-month.dto';
import { default as ResourceSummaryEntity } from '../../../entities/resource-summary.entity';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';
import { CreateResourceSummaryDto } from '../dtos/requests/create-resource-summary.dto';

export interface IResourceSummaryService {
  getAll(projectId: number): Promise<ResourceSummaryEntity[]>;
  getAllMonth(projectId: number): Promise<ResourceSummaryMonth[]>;
  createResourceSummaryWhenAddResource(dto: CreateResourceDto): Promise<boolean>;
  getToTalResourceProject(projectId: number): Promise<TotalResourceProjectDto>;
  updateResourceSummaryWhenEditResource(diffAcAndTcPercent: DiffAcAndTcPercentInterface): Promise<boolean>;
  addResourceSummaryWhenAddLogWork(reportDate?: Date, actualEffort?: number, projectId?: number): Promise<void>;
  updateResourceSummaryWhenEditLogwork(dto: UpdateResourceSummaryWhenEditLogworkDto): Promise<void>;
  updateResourceSummaryWhenDeleteLogwork(month: number, year: number, projectId: number, actual: number): Promise<void>;
  updateResourceSummary(dto: UpdateResourceSummaryDto, user: UserEntity): Promise<ResourceSummaryDto>;
  getAllSummary(projectId: number): Promise<ResourceSummaryDto[]>;
  updateResourceSummaryWhenAddResource(
    projectId: number,
    month: number,
    year: number,
    acAndTcTotal: AcAndTcPercentTotalDto,
    type: UpdateResourceSummaryType,
  ): Promise<boolean>;
  getCommittedAlocated(projectIds: number, date: Date): Promise<TotalResourceProjectDto>;
  deleteResourceSummaryByProjectId(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
  createResourcesSummary(createDto: CreateResourceSummaryDto): Promise<ResourceSummaryDto>;
}
