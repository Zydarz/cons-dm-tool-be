import { isNil } from 'lodash';
import { ForbiddenException, Inject } from '@nestjs/common';
import { Op, Transaction, Sequelize, WhereOptions, fn, col } from 'sequelize';
import moment from 'moment';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { default as UserSalariesEntity } from '../entities/user-salaries.entity';
import { IUserSalaryRepository } from '../modules/user-salary/interface/user-salary.repository.interface';
import { CreateSalaryDto } from '../modules/user-salary/dto/requests/create-salary.dto';
import { SequelizeCodeErrs } from '../common/constants/sequelize-error';
import { UserSalaryDto } from '../modules/user-salary/dto/responses/user-salary.dto';
import { UserSalaryPaggingDto } from '../modules/user-salary/dto/responses/user-salary-paging.dto';
import { UpdateSalaryDto } from '../modules/user-salary/dto/requests/update-salary.dto';
import { UserSalaryFilterDto } from '../modules/user-salary/dto/requests/user-salary-filter.dto';
import { UserSalaryPaggingFilterDto } from '../modules/user-salary/dto/requests/user-salary-pagging-filter.dto';
import { default as UserEntity } from '../entities/users.entity';
import { FLAG_NOT_PROTECTED, FLAG_PROTECTED } from '../common/constants/unit';
import { FullUpdateSalaryDto } from '../modules/user-salary/dto/requests/full-update-salary.dto';
import { CostManagementFilterDto } from '../modules/user-salary/dto/requests/cost-management-filter.dto';
import { ManagementSalaryDto } from '../modules/user-salary/dto/responses/management-salary.dto';
import { UserNS } from '../modules/users/interface/users';
export class UserSalaryRepository implements IUserSalaryRepository {
  constructor(@Inject('UserSalariesEntity') private readonly userSalariesEntity: typeof UserSalariesEntity) {}

  async getSalaries(params: UserSalaryPaggingFilterDto): Promise<PageDto<UserSalaryPaggingDto>> {
    const userCondition: WhereOptions = {};
    const salaryCondition: WhereOptions = {
      month: params.month,
      year: params.year,
    };
    if(!isNil(params.userIds)) {
      userCondition.id = { [Op.in]: params.userIds };
    }
    if(!isNil(params.divisionId)) {
      userCondition.departmentId = params.divisionId;
    }
    if(!isNil(params.departmentId)) {
      salaryCondition.departmentId = params.departmentId;
    }
    const userSalaries = await this.userSalariesEntity.findAndCountAll({
      where : salaryCondition,
      include: [
        {
          model: UserEntity,
          as: 'users',
          required: true,
          where : userCondition
        },
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: params.take,
      offset: params.skip
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: params, itemCount: userSalaries.count });
    const items = userSalaries.rows;
    return items.toPageDto(pageMetaDto);
  }

  async createSalary(createProjectDto: CreateSalaryDto): Promise<UserSalaryDto> {
    let salary: UserSalariesEntity;
    try {
      salary = await this.userSalariesEntity.create({
        ...createProjectDto, flag_protected : FLAG_NOT_PROTECTED, date : `${createProjectDto.year}-${createProjectDto.month}-01`
      });
    } catch (e) {
      throw e;
    }
    return salary.toDto();
  }

  async updateSalary(salaryId: number, updateProjectDto: UpdateSalaryDto): Promise<UserSalaryDto> {
    let salary = await this.findById(salaryId);
    if (isNil(salary)) {
      throw new ForbiddenException("record does not exist");
    }
    if(salary.flag_protected !== FLAG_NOT_PROTECTED) {
      throw new ForbiddenException("The record is not allowed to be changed");
    }

    try {
      salary = await salary.update({
        ...updateProjectDto
      });
    } catch (e) {
      throw e;
    }
    return salary.toDto();
  }

  async setSalaryFlagProtected(salaryId: number): Promise<Boolean> {
    let salary = await this.findById(salaryId);
    if (isNil(salary)) {
      return false;
    }
    if(salary.flag_protected !== FLAG_NOT_PROTECTED) {
      throw new ForbiddenException("The record is not allowed to be changed");
    }

    try {
      salary = await salary.update({
        flag_protected: FLAG_PROTECTED
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async checkSalaryExisted(createProjectDto: CreateSalaryDto): Promise<Boolean> {
    let salary = await this.userSalariesEntity.findOne({
      where: {
        [Op.and]: {
          userId: createProjectDto.userId,
          year: createProjectDto.year,
          month: createProjectDto.month,
        },
      },
    });
    if(isNil(salary)) {
      return false;
    }
    return true;
  }

  async checkExisted(params: UserSalaryPaggingFilterDto): Promise<Boolean> {
    let whereCondition:any = {
      year : params.year,
      month : params.month
    }
    if(!isNil(params.departmentId)) {
      whereCondition.departmentId = params.departmentId;
    }
    const salary = await this.userSalariesEntity.findOne({
      where: { ...whereCondition },
    });
    if(isNil(salary)) {
      return false;
    }
    return true;
  }

  async findById(id: number): Promise<UserSalariesEntity | null> {
    return await this.userSalariesEntity.findByPk(id);
  }

  async getAllSalaryLastMonth(): Promise<UserSalariesEntity[]> {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    if(month === 0) {
      year -= 1;
      month = 12;
    }
    return await this.userSalariesEntity.findAll({
      where : {
        'year' : year,
        'month' : month,
      }
    });
  }

  async insertSalaries(dataInsert: any): Promise<Boolean> {
    try{
      await this.userSalariesEntity.bulkCreate(dataInsert);
      return true;
    } catch(e) {
      return false;
    }
  }

  async updateSalaries(dataUpdate: object, whereUpdate: object): Promise<Boolean> {
    try{
      await this.userSalariesEntity.update({ ...dataUpdate }, {
        where: { ...whereUpdate },
      });
      return true;
    } catch(e) {
      return false;
    }
  }
  async getSalaryByUser(params: UserSalaryFilterDto): Promise<UserSalariesEntity[]> {
    const startDate = moment(params.startDate, 'YYYY/MM/DD').startOf('month').toISOString();
    const endDate = moment(params.endDate, 'YYYY/MM/DD').endOf('month').toISOString();
    let whereCondition:any = {
      date: { [Op.between]: [startDate, endDate] },
      userId: { [Op.in]: params.userIds },
    }
    if(!isNil(params.departmentId)) {
      whereCondition.departmentId = params.departmentId;
    }
    return await this.userSalariesEntity.findAll({
      where: { ...whereCondition }
    });
  }

  async fullUpdateSalaryDto(fullUpdateSalaryDto: FullUpdateSalaryDto): Promise<SuccessResponseDto> {
    try{
      let whereCondition:any = {
        year : fullUpdateSalaryDto.year,
        month : fullUpdateSalaryDto.month
      }
      if(!isNil(fullUpdateSalaryDto.delete)) {
        await this.userSalariesEntity.destroy({
          where : {
            year : fullUpdateSalaryDto.year,
            month : fullUpdateSalaryDto.month,
            userId: { [Op.in]: fullUpdateSalaryDto.delete }
          }
        });
      }
      if(!isNil(fullUpdateSalaryDto.create)) {
        // check Existed
        const dataCheckExisted = await this.userSalariesEntity.findAll({
          where : {
            'year' : fullUpdateSalaryDto.year,
            'month' : fullUpdateSalaryDto.month,
            'departmentId' : fullUpdateSalaryDto.departmentId,
          }
        });
        let dataCreate: Array<any> = [];
        fullUpdateSalaryDto.create.forEach(async (itemCreate, index) => {
          let continueItem = 1;
          if(!isNil(dataCheckExisted)) {
            dataCheckExisted.forEach((item: any) => {
              if(item.userId == itemCreate.userId) {
                let itemUpdate = {
                  userId: itemCreate.userId,
                  bankId: itemCreate.bankId,
                  bankName: itemCreate.bankName,
                  dependent: itemCreate.dependent,
                  paymentType: itemCreate.paymentType,
                  salary: itemCreate.salary,
                  socialInsuranceSalary: itemCreate.socialInsuranceSalary,
                  type: itemCreate.type,
                  status: itemCreate.status
                };
                fullUpdateSalaryDto.update.push(itemUpdate);
                continueItem = 0;
              }
            });
          }
          if(continueItem === 1) {
            whereCondition.userId = itemCreate.userId;
            dataCreate[index] = itemCreate;
            dataCreate[index].departmentId = fullUpdateSalaryDto.departmentId;
            dataCreate[index].year = fullUpdateSalaryDto.year;
            dataCreate[index].month = fullUpdateSalaryDto.month;
            dataCreate[index].date = `${fullUpdateSalaryDto.year}-${fullUpdateSalaryDto.month}-01`;
            dataCreate[index].flag_protected = 0;
            dataCreate[index].companyWillPayMoney = this.computeCompanyWillPayMoney(itemCreate); //20
          }
        });
        await this.userSalariesEntity.bulkCreate(dataCreate);
      }
      if(!isNil(fullUpdateSalaryDto.update)) {
        fullUpdateSalaryDto.update.forEach(async (item) => {
          whereCondition.userId = item.userId;
          const companyWillPayMoney = this.computeCompanyWillPayMoney(item); //20
          const dataUpdate = {
            bankId: item.bankId,
            bankName: item.bankName,
            dependent: item.dependent,
            paymentType: item.paymentType,
            salary: item.salary,
            socialInsuranceSalary: item.socialInsuranceSalary,
            type: item.type,
            status: item.status,
            companyWillPayMoney: companyWillPayMoney
          };
          await this.userSalariesEntity.update({ ...dataUpdate }, {
            where: { ...whereCondition }
          });
        })
      }
      return new SuccessResponseDto(true);
    } catch(e) {
      return new SuccessResponseDto(false);
    }
  }

  computeCompanyWillPayMoney(item: any): number {
    let companyWillPayMoney = 0;
    let companySocialInsurance = 0;
    let companyHealthInsurance = 0;
    let companyVoluntaryInsurance = 0;
    if(item.type === UserNS.Type.FULLTIMEC) {
      companySocialInsurance = Number((item.socialInsuranceSalary*17.5/100).toFixed(0)); // 14
      companyHealthInsurance = Number((item.socialInsuranceSalary*3/100).toFixed(0)); // 15
      companyVoluntaryInsurance = Number((item.socialInsuranceSalary/100).toFixed(0)); // 16
    }
    companyWillPayMoney =  item.salary + companySocialInsurance + companyHealthInsurance + companyVoluntaryInsurance; // 20
    return companyWillPayMoney;
  }

  async getManagementSalaryCost(costManagementFilterDto: CostManagementFilterDto): Promise<ManagementSalaryDto[]> {
    const { startDate, endDate, departmentIds } = costManagementFilterDto;
    let group = ['departmentId', 'year', 'month'];

    const condition = {
      date: { [Op.between]: [startDate, endDate] },
    };
    if (!isNil(departmentIds)) {
      Object.assign(condition, {
        departmentId: { [Op.in]: departmentIds },
      });
    }

    try {
      let resultDB = await this.userSalariesEntity.findAll({
        where: condition,
        group: ['departmentId', 'year', 'month'], // chắc chắn phải có đủ các cột trong SELECT mà không phải aggregate
        attributes: [
          [fn('SUM', col('companyWillPayMoney')), 'salaryTotal'],
          'departmentId',
          'year',
          'month',
          // 'date' bị lỗi nếu không có trong group hoặc aggregate
        ],
      });
      

      let result: ManagementSalaryDto[] = [];
      resultDB.forEach((item: any) => {
        let tesst = new ManagementSalaryDto(item.year, item.month, item.date, item.departmentId, item.dataValues.salaryTotal)
        result.push(tesst)
      })
      return result;
    } catch (e) {
      throw e;
    }
  }
}
