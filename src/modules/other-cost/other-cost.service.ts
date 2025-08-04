import { Inject, Injectable } from '@nestjs/common';
import { PageDto } from '../../common/dto/page.dto';
import { IOtherCostService } from './interface/other-cost.service.interface';
import { IOtherCostRepository } from './interface/other-cost.repository.interface';
import { CreateOtherCostDto } from './dto/requests/create-other-cost.dto';
import { OtherCostDto } from './dto/responses/other-cost.dto';
import { OtherCostFilterDto } from './dto/requests/other-cost-filter.dto';
import { UpdateOtherCostDto } from './dto/requests/update-other-cost.dto';
import { find, isNil } from 'lodash';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { FullUpdateOtherCostDto } from './dto/requests/full-update-other-cost.dto';
import { UserSalaryPaggingFilterDto } from '../../modules/user-salary/dto/requests/user-salary-pagging-filter.dto';
import { UserSalaryRepository } from '../../repositories/user-salary.repository';
import { MasterDataRepository } from '../../repositories/masterdata.repository';
import moment from 'moment';

@Injectable()
export class OtherCostService implements IOtherCostService {
  constructor(
    @Inject('IOtherCostRepository')
    private readonly otherCostRepository: IOtherCostRepository,
    @Inject('UserSalaryRepository')
    private readonly userSalaryRepository: UserSalaryRepository,
    @Inject('MasterDataRepository')
    private readonly masterDataRepository: MasterDataRepository,
  ) {}

  async deleteOtherCost(otherCostId: number): Promise<SuccessResponseDto> {
    return await this.otherCostRepository.deleteOtherCost(otherCostId);
  }

  async getOtherCost(params: OtherCostFilterDto): Promise<PageDto<OtherCostDto>> {
    let otherCost = await this.otherCostRepository.getOtherCost(params);
    let paramsCheckUserSalary: any = new UserSalaryPaggingFilterDto;
    paramsCheckUserSalary.month = params.month;
    paramsCheckUserSalary.year = params.year;
    paramsCheckUserSalary.departmentId = params.departmentId;
    const checkUserSalaryExisted = await this.userSalaryRepository.checkExisted(paramsCheckUserSalary);
    if(otherCost.data.length === 0 && !checkUserSalaryExisted) {
      if(params.month === "1") {
        params.month = "12";
        params.year = String(parseInt(params.year??"0") - 1);
      } else {
        params.month = String(parseInt(params.month??"0") - 1);
      }
      otherCost = await this.otherCostRepository.getOtherCost(params);
      if(otherCost.data.length === 0) {
        const settingOtherCost = await this.masterDataRepository.getSettingOtherCost();
        if(!isNil(settingOtherCost)) {
          settingOtherCost.forEach((item: any) => {
            return otherCost.data.push({
              id: item.id,
              settingOtherCostId: item.id,
              amount: 0,
              departmentId: parseInt(params.departmentId??"0"),
              year: parseInt(params.year??"0"),
              month: parseInt(params.month??"0"),
              date: moment(new Date(`${params.year}-${params.month}-01`)).toDate(),
              settingOtherCostName: item.name,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            });
          });
        }
      }
    }
    return otherCost;
  }
  async createOtherCost(createOtherCostDto: CreateOtherCostDto): Promise<OtherCostDto> {
    const flagExist = await this.otherCostRepository.checkExisted(createOtherCostDto);
    if(flagExist === true) {
      throw new Error("other cost existed during the month");
    }
    return await this.otherCostRepository.createOtherCost(createOtherCostDto);
  }

  async updateOtherCost(otherCostId: number, params: UpdateOtherCostDto): Promise<SuccessResponseDto> {
    const otherCost = await this.otherCostRepository.findById(otherCostId)
    if(!otherCost) {
      throw new Error("other cost not found.");
    }
    let paramsCheckOtherCost: any = new CreateOtherCostDto;
    paramsCheckOtherCost.month = otherCost.month;
    paramsCheckOtherCost.year = otherCost.year;
    paramsCheckOtherCost.departmentId = otherCost.departmentId;
    paramsCheckOtherCost.settingOtherCostId = params.settingOtherCostId;
    paramsCheckOtherCost.exeption = otherCostId;
    const flagExist = await this.otherCostRepository.checkExisted(paramsCheckOtherCost);
    if(flagExist === true) {
      throw new Error("other cost existed during the month");
    }
    return await this.otherCostRepository.updateOtherCost(otherCostId, params);
  }

  async getSettingOtherCostUsing(): Promise<Number[]> {
    let listSettingOtherCostId: Number[] = [];
    const listOtherCost = await this.otherCostRepository.getSettingOtherCostUsing();
    listOtherCost.forEach((item) => {
      if(!find(listSettingOtherCostId, item.settingOtherCostId)) {
        listSettingOtherCostId.push(item.settingOtherCostId);
      }
    });
    return listSettingOtherCostId;

  }
  async fullUpdateOtherCost(params: FullUpdateOtherCostDto): Promise<SuccessResponseDto> {
    return await this.otherCostRepository.fullUpdateOtherCost(params);
  }

  async deleteDepartmentCost(id: string, year: number, month: number): Promise<SuccessResponseDto> {
    return await this.otherCostRepository.deleteDepartmentCost(id, year, month);
  }
}
