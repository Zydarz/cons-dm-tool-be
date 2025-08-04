import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { PageDto } from '../../common/dto/page.dto';
import { IUserSalaryService } from './interface/user-salary.service.interface';
import { IUserSalaryRepository } from './interface/user-salary.repository.interface';
import { UsersRepository } from '../../repositories/users.repository';
import { OtherCostRepository } from '../../repositories/other-cost.repository';
import { UserProjectRepository } from '../../repositories/user-project.repository';
import { CreateSalaryDto } from './dto/requests/create-salary.dto';
import { UserSalaryDto } from './dto/responses/user-salary.dto';
import { UserSalaryPaggingDto } from './dto/responses/user-salary-paging.dto';
import { UpdateSalaryDto } from './dto/requests/update-salary.dto';
import { UserSalaryFilterDto } from './dto/requests/user-salary-filter.dto';
import { UserSalaryPaggingFilterDto } from './dto/requests/user-salary-pagging-filter.dto';
import { Cron } from '@nestjs/schedule';
import { UserNS } from '../../modules/users/interface/users';
import { find, forEach, intersectionWith, isEmpty, isNil, isObject, isString, orderBy } from 'lodash';
import { FLAG_NOT_PROTECTED, FLAG_PROTECTED } from '../../common/constants/unit';
import { CostManagementFilterDto } from './dto/requests/cost-management-filter.dto';
import { UserForSalaryCostDto } from '../../modules/users/dto/response/users-for-salary-cost';
import { FullUpdateSalaryDto } from './dto/requests/full-update-salary.dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { ComputeSalaryDto } from './dto/responses/compute-salary.dto';
import { ComputeSalaryParamsDto } from './dto/requests/compute-salary-params.dto';
import { FilterUserSummaryDto } from '../../modules/resources/dto/requests/filter-user-summary-dto';
import moment from 'moment';
import { GetSalaryDto } from '../../modules/users/dto/request/get-salary-dto';
import { MasterDataNS } from '../../modules/master-data/master-data';
import { OtherCostFilterDto } from '../../modules/other-cost/dto/requests/other-cost-filter.dto';
import { CreateOtherCostDto } from '../../modules/other-cost/dto/requests/create-other-cost.dto';

@Injectable()
export class UserSalaryService implements IUserSalaryService {
  constructor(
    @Inject('IUserSalaryRepository')
    private readonly userSalaryRepository: IUserSalaryRepository,
    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,
    @Inject('IUserRepository')
    private readonly userRepository: UsersRepository,
    @Inject('OtherCostRepository')
    private readonly otherCostRepository: OtherCostRepository,
    @Inject('UserProjectRepository')
    private readonly userProjectRepository: UserProjectRepository,

    @Inject('IMasterDataService')
    private readonly masterDataService: MasterDataNS.IMasterDataService,
  ) {}

  async getSalaries(params: UserSalaryPaggingFilterDto): Promise<PageDto<UserSalaryPaggingDto>> {
    let usersSalariesEntity = await this.userSalaryRepository.getSalaries(params);
    let paramsCheckOtherCost: any = new ComputeSalaryDto;
    paramsCheckOtherCost.month = params.month;
    paramsCheckOtherCost.year = params.year;
    paramsCheckOtherCost.departmentId = params.departmentId;
    const checkOtherCostExisted = await this.otherCostRepository.checkExisted(paramsCheckOtherCost);
    if(usersSalariesEntity.data.length === 0 && !checkOtherCostExisted) {
      let paramsUserDepartment: any = new FilterUserSummaryDto;
      paramsUserDepartment.month = moment(new Date(`${params.year}-${params.month}-01`)).toDate();
      paramsUserDepartment.divisionIds = [params.departmentId];
      const userByDepartment = await this.userProjectRepository.getUserInMonth(paramsUserDepartment);
      let userIds: string[] = [];
      if(!isNil(userByDepartment)) {
        userByDepartment.forEach((item: any) => {
          userIds.push(item.userId);
        });
      }
      let paramsUserSalaries: any = new UserSalaryPaggingFilterDto;
      paramsUserSalaries.userIds = userIds;
      paramsUserSalaries.divisionIds = params.departmentId;

      const oldMonth = parseInt(params.month);
      const oldYear = parseInt(params.year);
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      if(month === 0) {
        year -= 1;
        month = 12;
      }
      if(oldMonth > 1) {
        month = oldMonth - 1;
        year = oldYear;
      } else {
        month = 12;
        year = oldYear - 1;
      }
      paramsUserSalaries.month = month;
      paramsUserSalaries.year = year;
      paramsUserSalaries.take = params.take;
      // let usersSalaries = await this.userRepository.getUserSalaryPagging(paramsUserSalaries);
      let usersSalaries = await this.userSalaryRepository.getSalaries(paramsUserSalaries);
      if(!isNil(userByDepartment)) {
        userByDepartment.forEach((user: any) => {
          let thisSalary: any = {};
          usersSalaries.data.forEach((salary) => {
            if(user.userId === salary.userId) {
              thisSalary = salary;
            }
          });
          let userSalaryStatus:any = thisSalary.status;
          let userSalaryType:any = thisSalary.type;
          if(isNil(userSalaryStatus)) {
            userSalaryStatus = user['users.status']??UserNS.Status.ACTIVE;
          }
          if(userSalaryStatus === UserNS.Status.ACTIVE) {
            if(isNil(userSalaryType)) {
              userSalaryType = user['users.type']??UserNS.Type.FULLTIMEC;
            }
          }
          return usersSalariesEntity.data.push({
            id: user.userId,
            name: user['users.surName'],
            userName: user['users.username'],
            displayName: user['users.displayName'],
            accountNumber: (thisSalary.accountNumber) ?? user['users.bankId'],
            bankName: (thisSalary.bankName) ?? user['users.bankName'],
            divisionId: user['users.departmentId'],
            status: userSalaryStatus,
            type: userSalaryType,
            dependentPerson: (thisSalary.dependentPerson) ?? (user['users.dependent']??0),
            salaryGross: thisSalary.salary??0,
            insuranceSalary: (thisSalary.insuranceSalary) ?? (user['users.socialInsuranceSalary']??0),
            taxableSalary: 0,
            personalIncomeTaxParttime: 0,
            staffSocialInsurance: 0,
            staffHealthInsurance: 0,
            staffVoluntaryInsurance: 0,
            companySocialInsurance: 0,
            companyHealthInsurance: 0,
            companyVoluntaryInsurance: 0,
            personalIncomeTax: 0,
            salaryReceived: 0,
            retainedSalary: 0,
            companyWillPayMoney: 0,
            unaccountedCompanyMoney: 0,
            paymentType: (thisSalary.paymentType) ?? (user['users.paymentType']??'CK'),
            userId: user['users.userId'],
            salary: thisSalary.salary??0,
            year: thisSalary.year??0,
            month: thisSalary.month??0,
            date: thisSalary.date??new Date(),
            flag_protected: thisSalary.flag_protected??0,
            createdAt: thisSalary.createdAt??new Date(),
            updatedAt: thisSalary.updatedAt??new Date()
          });
        });
      }
    }
    usersSalariesEntity.data.forEach((item: any) => {
      item = this.computeSalary(item);
    });
    return usersSalariesEntity;
  }

  computeSalary(item: any): [UserSalaryPaggingDto] {
    if(isNil(item.dependentPerson)) {
      item.dependentPerson = 0;
    }
    if(item.status === UserNS.Status.ACTIVE && isNil(item.type)) {
      item.type = UserNS.Type.FULLTIMEC;
    }
    if(item.type == UserNS.Type.INTERN) { // INTERN
      item.insuranceSalary = 0; // 8
      item.taxableSalary = 0; // 9
      item.personalIncomeTaxParttime = 0; // 10
      item.staffSocialInsurance = 0; // 11
      item.staffHealthInsurance = 0; // 12
      item.staffVoluntaryInsurance = 0; // 13
      item.companySocialInsurance = 0; // 14
      item.companyHealthInsurance = 0; // 15
      item.companyVoluntaryInsurance = 0; // 16
      item.personalIncomeTax = 0; // 17
    } else if (item.type == UserNS.Type.FULLTIMEC) { // fulltime official
      item.personalIncomeTaxParttime = 0; // 10
      item.staffSocialInsurance = Number((item.insuranceSalary*8/100).toFixed(0)); // 11
      item.staffHealthInsurance = Number((item.insuranceSalary*1.5/100).toFixed(0)); // 12
      item.staffVoluntaryInsurance = Number((item.insuranceSalary/100).toFixed(0)); // 13
      item.companySocialInsurance = Number((item.insuranceSalary*17.5/100).toFixed(0)); // 14
      item.companyHealthInsurance = Number((item.insuranceSalary*3/100).toFixed(0)); // 15
      item.companyVoluntaryInsurance = Number((item.insuranceSalary/100).toFixed(0)); // 16
      let taxableSalary = item.salaryGross - item.staffSocialInsurance - item.staffHealthInsurance - item.staffVoluntaryInsurance - 11000000 - 4400000*item.dependentPerson; // 9 = NO.7 - NO.11 - NO.12 - NO.13 - 11.000.000 - 4.400.000 * NO.6
      taxableSalary = (isNaN(taxableSalary) || taxableSalary <= 0) ? 0 : taxableSalary;
      item.taxableSalary = Number(taxableSalary.toFixed(0));
      const tr = 1000000;
      if(taxableSalary <= 5*tr) {
        item.personalIncomeTax = Number((taxableSalary*5/100).toFixed(0)); // 17
      } else if (taxableSalary <= 10*tr) {
        item.personalIncomeTax = Number((5*tr*5/100 + (taxableSalary - 5*tr)*10/100).toFixed(0)); // 17
      } else if (taxableSalary <= 18*tr) {
        item.personalIncomeTax = Number((5*tr*5/100 + 5*tr*10/100 + (taxableSalary - 10*tr)*15/100).toFixed(0)); // 17
      } else if (taxableSalary <= 32*tr) {
        item.personalIncomeTax = Number((5*tr*5/100 + 5*tr*10/100 + 8*tr*15/100 + (taxableSalary - 18*tr)*20/100).toFixed(0)); // 17
      } else if (taxableSalary <= 52*tr) {
        item.personalIncomeTax = Number((5*tr*5/100 + 5*tr*10/100 + 8*tr*15/100 + 14*tr*20/100 + (taxableSalary - 32*tr)*25/100).toFixed(0)); // 17
      } else if (taxableSalary <= 80*tr) {
        item.personalIncomeTax = Number((5*tr*5/100 + 5*tr*10/100 + 8*tr*15/100 + 14*tr*20/100 + 20*tr*25/100 + (taxableSalary - 52*tr)*30/100).toFixed(0)); // 17
      } else {
        item.personalIncomeTax = Number((5*tr*5/100 + 5*tr*10/100 + 8*tr*15/100 + 14*tr*20/100 + 20*tr*25/100 + 28*tr*30/100 + (taxableSalary - 80*tr)*35/100).toFixed(0)); // 17
      }
    } else { // fulltime probation, part-time
      let taxableSalary = item.salaryGross;
      item.insuranceSalary = 0; // 8
      item.taxableSalary = taxableSalary; // 9 = salaryGross
      item.personalIncomeTaxParttime = Number((taxableSalary / 10).toFixed(0)); // 10
      item.staffSocialInsurance = 0; // 11
      item.staffHealthInsurance = 0; // 12
      item.staffVoluntaryInsurance = 0; // 13
      item.companySocialInsurance = 0; // 14
      item.companyHealthInsurance = 0; // 15
      item.companyVoluntaryInsurance = 0; // 16
      item.personalIncomeTax = 0; // 17
    }
    item.salaryReceived = Number((item.salaryGross - item.personalIncomeTaxParttime - (item.staffSocialInsurance + item.staffHealthInsurance + item.staffVoluntaryInsurance) - item.personalIncomeTax).toFixed(0)); // 18
    item.retainedSalary = Number((item.salaryGross - item.salaryReceived).toFixed(0)); // 19
    item.companyWillPayMoney =  item.salaryGross + item.companySocialInsurance + item.companyHealthInsurance + item.companyVoluntaryInsurance; //20
    item.unaccountedCompanyMoney = Number((item.companyWillPayMoney - item.salaryReceived).toFixed(0));// 21
    if(isNil(item.paymentType)) {
      item.paymentType = "CK";
    }
    return item;
  }

  async createSalary(createSalaryDto: CreateSalaryDto): Promise<UserSalaryDto> {
    const flagExist = await this.userSalaryRepository.checkSalaryExisted(createSalaryDto);
    if(flagExist === true) {
      throw "salary existed during the month";
    }
    return await this.userSalaryRepository.createSalary(createSalaryDto);
  }

  async updateSalary(salaryId: number, updateProjectDto: UpdateSalaryDto): Promise<UserSalaryDto> {
    return await this.userSalaryRepository.updateSalary(salaryId, updateProjectDto);
  }

  async getUserDefault(userId: string): Promise<UserSalaryPaggingDto> {
    let user = await this.userRepository.getOnlyUserById(userId);
    let userDefault: any = {};
    if (!isEmpty(user)) {
      let userType:any = user.type;
      if(user.status === UserNS.Status.ACTIVE) {
        if(isNil(userType)) {
          userType = UserNS.Type.FULLTIMEC;
        }
      } else {
        userType = null;
      }
      userDefault.id = user.id;
      userDefault.name = user.surName;
      userDefault.userName = user.username;
      userDefault.displayName = user.displayName;
      userDefault.accountNumber = (user.bankId)??'';
      userDefault.bankName = (user.bankName)??'';
      userDefault.divisionId = user.departmentId;
      userDefault.status = user.status;
      userDefault.type = userType;
      userDefault.dependentPerson = +((user.dependent)??0);
      userDefault.salaryGross = 0;
      userDefault.insuranceSalary = (user.socialInsuranceSalary)??0;
      userDefault.taxableSalary = 0;
      userDefault.personalIncomeTaxParttime = 0;
      userDefault.staffSocialInsurance = 0;
      userDefault.staffHealthInsurance = 0;
      userDefault.staffVoluntaryInsurance = 0;
      userDefault.companySocialInsurance = 0;
      userDefault.companyHealthInsurance = 0;
      userDefault.companyVoluntaryInsurance = 0;
      userDefault.personalIncomeTax = 0;
      userDefault.salaryReceived = 0;
      userDefault.retainedSalary = 0;
      userDefault.companyWillPayMoney = 0;
      userDefault.unaccountedCompanyMoney = 0;
      userDefault.paymentType = (user.paymentType)??'CK';
    }
    return userDefault;
  }
  async fullUpdateSalaryDto(fullUpdateSalaryDto: FullUpdateSalaryDto): Promise<SuccessResponseDto> {
    return await this.userSalaryRepository.fullUpdateSalaryDto(fullUpdateSalaryDto);
  }

  async getCostManagement(costManagementFilterDto: CostManagementFilterDto): Promise<any> {
    const { startDate, endDate, departmentIds } = costManagementFilterDto;
    let paramsOtherCost: any = new OtherCostFilterDto;
    paramsOtherCost.startDate = costManagementFilterDto.startDate;
    paramsOtherCost.endDate = costManagementFilterDto.endDate;
    paramsOtherCost.departmentIds = costManagementFilterDto.departmentIds;
    const managementSalary = await this.userSalaryRepository.getManagementSalaryCost(costManagementFilterDto);
    const managementOtherCost = await this.otherCostRepository.getManagementOtherCost(paramsOtherCost);
    const departmentList = await this.masterDataService.getDepartment({});
    const listMonth = this.getMonths(startDate, endDate);
    let result: object = {};
    listMonth?.forEach((monthItem: any) => {
      const iMonth = monthItem.month;
      const iYear = monthItem.year;
      departmentList?.forEach((departmentItem: any) => {
        const managementSalaryItem = find(managementSalary, {'year' : iYear, 'month' : iMonth, 'departmentId' : departmentItem.id});
        const managementOtherCostItem = find(managementOtherCost, {'year' : iYear, 'month' : iMonth, 'departmentId' : departmentItem.id});
        if(managementSalaryItem || managementOtherCostItem) {{
          if(result[departmentItem.id] == undefined) {
            result[departmentItem.id] = {
              'id' : departmentItem.id,
              'name' : departmentItem.name,
              'info' : []
            }
          }
          let salaryTotal = managementSalaryItem?.salaryTotal??0;
          let amountTotal = managementOtherCostItem?.amountTotal??0;
          result[departmentItem.id]['info'].push({
            'year' : iYear,
            'month' : iMonth,
            'salary_cost' : +salaryTotal,
            'other_cost' : +amountTotal,
          })
        }}
      })
    })
    return result;
  }

  getMonths(start: Date, end: Date): [any] {
    let resultList:any = [];
    let startDate = new Date(start);
    let endDate = new Date(end);

    while (startDate <= endDate)
    {
        resultList.push({
          year:startDate.getFullYear(),
          month:startDate.getMonth() + 1,
        });
        startDate.setMonth(startDate.getMonth() + 1);
    }
    return resultList;
  }
  async checkExisted(params: UserSalaryPaggingFilterDto): Promise<Boolean> {
    let paramsCheckOtherCost: any = new CreateOtherCostDto;
    paramsCheckOtherCost.month = params.month;
    paramsCheckOtherCost.year = params.year;
    paramsCheckOtherCost.departmentId = params.departmentId;
    const flagOtherCostExist = await this.otherCostRepository.checkExisted(paramsCheckOtherCost);
    const flagSalaryExist = await this.userSalaryRepository.checkExisted(params);
    return flagOtherCostExist || flagSalaryExist;
  }

  async clientCompute(salaryGross: string, insuranceSalary: string, type: string, dependentPerson: string): Promise<ComputeSalaryDto> {
    let params: any = {};
    params.salaryGross = parseInt(salaryGross);
    params.insuranceSalary = parseInt(insuranceSalary);
    params.dependentPerson = parseInt(dependentPerson);
    params.type = type;
    const computed = this.computeSalary(params);
    let item: any = new ComputeSalaryDto;
    if(!isNil(computed)) {
      item = computed;
    }
    return item;
  }

  /**
   * Update last month's salary
   */
  // @Cron('0 0 1 10 * *')
  async handleCronSalary() {
    try{
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      if(month === 0) {
        year -= 1;
        month = 12;
      }

      let dataInsert: object[] = [];

      let userSalaries: object[] = [];
      let salaries = await this.userSalaryRepository.getAllSalaryLastMonth();
      salaries.forEach((item: any) => {
        userSalaries.push({'userId' : item.dataValues.userId})
      });

      let users = await this.userService.getAllUser({});
      users.forEach((item) => {
        if(!find(userSalaries, {'userId': item.id})) {
          dataInsert.push({
            userId : item.id,
            year : year,
            month : month,
            flag_protected : FLAG_NOT_PROTECTED,
            date : `${year}-${month}-01`
          });
        }
      });

      // await this.userSalaryRepository.updateSalaries({'flag_protected' : FLAG_PROTECTED}, {
      //   year : year,
      //   month : month,
      // })

      await this.userSalaryRepository.insertSalaries(dataInsert);
    } catch(e) {
      throw e;
    }
  }

}
