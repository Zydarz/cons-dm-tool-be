import { Inject } from '@nestjs/common';
import { MasterDataNS } from './master-data';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { HandleMasterDataDto } from './dtos/requests/handle-master-data.dto';
import { PageDto } from '../../common/dto/page.dto';
import {
  ContractTypeDto,
  DepartmentDto,
  JobRankDto,
  LineDto,
  MasterDataDto,
  ProjectStatusBiddingDto,
  ProjectStatusDevelopmentDto,
  TaskStatusDto,
  ProjectRankDto,
  SettingOtherCostDto,
} from './dtos/master-data.dto';
import { ListMasterDataDto } from './dtos/requests/list-master-data.dto';
import { MasterDataOptionDto } from './dtos/responses/master-data-option.dto';
import { CreateMasterDataDto } from './dtos/requests/create-master-data.dto';
import { UpdateDepartmentDto } from './dtos/requests/update-department.dto';
import { isEmpty } from 'lodash';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { UserNS } from '../../modules/users/interface/users';
import { CreateSettingOtherCostDto } from './dtos/requests/create-setting-other-cost.dto';
import { FilterDepartmentDto } from './dtos/requests/filter-department.dto';

export class MasterDataService implements MasterDataNS.IMasterDataService {
  constructor(
    @Inject('IMasterDataRepository') private readonly masterDataRepo: MasterDataNS.IMasterDataRepository,
    @Inject('IProjectService') private readonly projectService: ProjectNS.IProjectService,
    @Inject('IUserService') private readonly userService: UserNS.IUserService,
  ) { }

  async getMasterDataList(
    type: MasterDataNS.MasterDataCodeList,
    dto: ListMasterDataDto,
  ): Promise<PageDto<MasterDataDto>> {
    return this.masterDataRepo.getMasterDataList(type, dto);
  }

  async handleMasterData(dto: HandleMasterDataDto): Promise<SuccessResponseDto> {
    const isHandled = await this.masterDataRepo.handleMasterData(dto);
    return new SuccessResponseDto(isHandled);
  }

  async getMasterDataSummary(): Promise<MasterDataOptionDto[]> {
    return await this.masterDataRepo.getMasterDataSummary();
  }
  async getMasterDateContractType(id: number): Promise<ContractTypeDto> {
    const master = await this.masterDataRepo.getMasterDateContractType(id);
    return master.toDto();
  }
  async getMasterDataJobRank(id: number): Promise<JobRankDto> {
    const master = await this.masterDataRepo.getMasterDataJobRank(id);
    return master.toDto();
  }
  async getMasterDataDepartment(id: number): Promise<DepartmentDto> {
    const master = await this.masterDataRepo.getMasterDataDepartment(id);
    return master.toDto();
  }
  async getMasterDataLine(id: number): Promise<LineDto> {
    const master = await this.masterDataRepo.getMasterDataLine(id);
    return master.toDto();
  }
  async getDepartment(params: FilterDepartmentDto): Promise<DepartmentDto[]> {
    const department = await this.masterDataRepo.getDepartment(params);
    return department.toDtos();
  }
  async createtDepartment(param: CreateMasterDataDto): Promise<DepartmentDto> {
    const departments = await this.getDepartment({});
    departments.map((d) => {
      if (d.name === param.name) {
        throw MasterDataNS.ERRORS.DepartmentExisted;
      }
    });
    const department = await this.masterDataRepo.createtDepartment(param);
    return department.toDto();
  }
  async updateDepartment(id: number, param: UpdateDepartmentDto): Promise<DepartmentDto> {
    const departments = await this.getDepartment({});
    departments.map((d) => {
      if (d.name === param.name && d.id !== id) {
        throw MasterDataNS.ERRORS.DepartmentExisted;
      }
    });
    const department = await this.masterDataRepo.updateDepartment(id, param);
    return department.toDto();
  }
  async deleteDepartment(id: number): Promise<SuccessResponseDto> {
    const users = await this.userService.getUserByDepartment(id);
    const projects = await this.projectService.getProjectByDepartment(id);
    if (!isEmpty(users) || !isEmpty(projects)) {
      throw MasterDataNS.ERRORS.DontDeleteDepartment;
    }
    return await this.masterDataRepo.deleteDepartment(id);
  }

  async checkProjectRank(id: number): Promise<ProjectRankDto | null> {
    return await this.masterDataRepo.checkProjectRank(id);
  }

  async getProjectStatusBidding(params: FilterDepartmentDto): Promise<ProjectStatusBiddingDto[]> {
    const projectStatus = await this.masterDataRepo.getProjectStatusBidding(params);
    return projectStatus.toDtos();
  }

  async getProjectStatusDevelopment(params: FilterDepartmentDto): Promise<ProjectStatusDevelopmentDto[]> {
    const projectStatus = await this.masterDataRepo.getProjectStatusDevelopment(params);
    return projectStatus.toDtos();
  }


  async checkProjectStatusBidding(id: number): Promise<ProjectStatusBiddingDto | null> {
    return await this.masterDataRepo.checkProjectStatusBidding(id);
  }

  async checkProjectStatusDevelopment(id: number): Promise<ProjectStatusDevelopmentDto | null> {
    return await this.masterDataRepo.checkProjectStatusDevelopment(id);
  }

  async getTaskStatus(params: FilterDepartmentDto): Promise<TaskStatusDto[]> {
    const projectStatus = await this.masterDataRepo.getTaskStatus(params);
    return projectStatus.toDtos();
  }

   async checkTaskStatus(id: number): Promise<TaskStatusDto | null> {
    return await this.masterDataRepo.checkTaskStatus(id);
  }


  async checkOtherCost(id: number): Promise<SettingOtherCostDto | null> {
    return await this.masterDataRepo.checkSettingOtherCose(id);
  }
  async getSettingOtherCost(): Promise<SettingOtherCostDto[]> {
    const settingOtherCost = await this.masterDataRepo.getSettingOtherCost();
    return settingOtherCost.toDtos();
  }
  async createSettingOtherCost(params: CreateSettingOtherCostDto): Promise<SuccessResponseDto> {
    const settingOtherCosts = await this.getSettingOtherCost();
    settingOtherCosts.map((d) => {
      if (d.name === params.name) {
        throw MasterDataNS.ERRORS.DepartmentExisted;
      }
    });
    return await this.masterDataRepo.createSettingOtherCost(params);
  }
}
