import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { HandleMasterDataDto } from './dtos/requests/handle-master-data.dto';
import {
  MasterDataDto,
  ContractTypeDto,
  DepartmentDto,
  JobRankDto,
  LineDto,
  ProjectStatusBiddingDto,
  ProjectStatusDevelopmentDto,
  ProjectRankDto,
  SettingOtherCostDto,
} from './dtos/master-data.dto';
import { PageDto } from '../../common/dto/page.dto';
import { ListMasterDataDto } from './dtos/requests/list-master-data.dto';
import { MasterDataOptionDto } from './dtos/responses/master-data-option.dto';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { default as ContractTypeEntity } from '../../entities/contract-type.entity';
import { CreateMasterDataDto } from './dtos/requests/create-master-data.dto';
import { UpdateDepartmentDto } from './dtos/requests/update-department.dto';
import { default as DepartmentEntity } from '../../entities/department.entity';
import { default as JobRankEntity } from '../../entities/job-rank.entity';
import { default as ProjectRankEntity } from '../../entities/project-rank.entity';
import { default as SettingOtherCostEntity } from '../../entities/setting-other-cost.entity';
import { CreateSettingOtherCostDto } from './dtos/requests/create-setting-other-cost.dto';
import { FilterDepartmentDto } from './dtos/requests/filter-department.dto';
import ProjectStatusBiddingEntity from 'entities/project-status-bidding.entity';
import ProjectStatusDevelopmentEntity from 'entities/project-status-development.entity';

export namespace MasterDataNS {
  export interface IMasterDataService {
    getMasterDataList(type: MasterDataNS.MasterDataCodeList, dto: ListMasterDataDto): Promise<PageDto<MasterDataDto>>;

    handleMasterData(dto: HandleMasterDataDto): Promise<SuccessResponseDto>;

    getMasterDataSummary(): Promise<MasterDataOptionDto[]>;

    getMasterDateContractType(id: number): Promise<ContractTypeDto>;
    getDepartment(params: FilterDepartmentDto): Promise<DepartmentDto[]>;
    createtDepartment(param: CreateMasterDataDto): Promise<DepartmentDto>;
    updateDepartment(id: number, param: UpdateDepartmentDto): Promise<DepartmentDto>;
    deleteDepartment(id: number): Promise<SuccessResponseDto>;
    getMasterDataJobRank(id: number): Promise<JobRankDto>;
    getMasterDataDepartment(id: number): Promise<DepartmentDto>;
    getMasterDataLine(id: number): Promise<LineDto>;
    checkProjectRank(id: number): Promise<ProjectRankDto | null>;
    getProjectStatusBidding(params: FilterDepartmentDto): Promise<ProjectStatusBiddingDto[]>;
    getProjectStatusDevelopment(params: FilterDepartmentDto): Promise<ProjectStatusDevelopmentDto[]>;
    checkProjectStatusBidding(id: number): Promise<ProjectStatusBiddingDto | null>;
    checkProjectStatusDevelopment(id: number): Promise<ProjectStatusDevelopmentDto | null>;
    checkOtherCost(id: number): Promise<SettingOtherCostDto | null>;
    getSettingOtherCost(): Promise<SettingOtherCostDto[]>;
    createSettingOtherCost(param: CreateSettingOtherCostDto): Promise<SuccessResponseDto>;
  }

  export interface IMasterDataRepository {
    getMasterDataList(type: MasterDataNS.MasterDataCodeList, dto: ListMasterDataDto): Promise<PageDto<MasterDataDto>>;

    handleMasterData(dto: HandleMasterDataDto): Promise<boolean>;

    getMasterDataSummary(): Promise<MasterDataOptionDto[]>;

    getMasterDateContractType(id: number): Promise<ContractTypeEntity>;
    getDepartment(params: FilterDepartmentDto): Promise<DepartmentEntity[]>;
    createtDepartment(param: CreateMasterDataDto): Promise<DepartmentEntity>;
    updateDepartment(id: number, param: UpdateDepartmentDto): Promise<DepartmentEntity>;
    deleteDepartment(id: number): Promise<SuccessResponseDto>;
    getMasterDataDepartment(id: number): Promise<DepartmentEntity>;
    getMasterDataJobRank(id: number): Promise<JobRankEntity>;
    getMasterDataLine(id: number): Promise<DepartmentEntity>;
    checkProjectRank(id: number): Promise<ProjectRankEntity | null>;
    getProjectStatusBidding(params: FilterDepartmentDto): Promise<ProjectStatusBiddingEntity[]>;
    getProjectStatusDevelopment(params: FilterDepartmentDto): Promise<ProjectStatusDevelopmentEntity[]>;
    checkProjectStatusBidding(id: number): Promise<ProjectStatusBiddingEntity | null>;
    checkProjectStatusDevelopment(id: number): Promise<ProjectStatusDevelopmentEntity | null>;
    checkSettingOtherCose(id: number): Promise<SettingOtherCostEntity | null>;
    getSettingOtherCost(): Promise<SettingOtherCostDto[]>;
    createSettingOtherCost(param: CreateSettingOtherCostDto): Promise<SuccessResponseDto>;
  }

  export enum MasterDataList {
    project_role = 'Project Role',
    line = 'Line',
    contract_type = 'Contract Type',
    daily_report_activities = 'Daily Report Activities',
    job_rank = 'Job Rank',
    project_rank = 'Project Rank',
    project_status_bidding = 'Project Status Bidding',
    project_status_development = 'Project Status Development',
    setting_other_cost = 'Cost Setting',
  }

  export enum MasterDataCodeList {
    project_role = 'project_role',
    line = 'line',
    contract_type = 'contract_type',
    daily_report_activities = 'daily_report_activities',
    job_rank = 'job_rank',
    project_rank = 'project_rank',
    project_status_bidding = 'project_status_bidding',
    project_status_development = 'project_status_development',
    setting_other_cost = 'setting_other_cost',
  }
  export const ERRORS = {
    MasterNotFound: new NotFoundException('master.not.exist'),
    DepartmentNotFound: new NotFoundException('department.not.exist'),
    DontDeleteDepartment: new ForbiddenException('Unable to delete departments containing members or projects!'),
    DepartmentExisted: new ConflictException('Department Name Existed '),
    ProjectRankNotFound: new NotFoundException('Project rank is not exists!'),
    ProjectStatusBiddingNotFound: new NotFoundException('Project status bidding is not exists!'),
    ProjectStatusDevelopmentNotFound: new NotFoundException('Project status development is not exists!'),
    SettingOtherCostNotFound: new NotFoundException('Other Cost is not exists!'),
    SettingOtherCostExisted: new ConflictException('Other Cost Name Existed '),
  };
}
