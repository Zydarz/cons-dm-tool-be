import { isNil } from 'lodash';
import { ForbiddenException, Inject } from '@nestjs/common';
import { Op, Sequelize, col, fn } from 'sequelize';
import moment from 'moment';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { default as OtherCostEntity } from '../entities/other-cost.entity';
import { IOtherCostRepository } from '../modules/other-cost/interface/other-cost.repository.interface';
import { CreateOtherCostDto } from '../modules/other-cost/dto/requests/create-other-cost.dto';
import { OtherCostDto } from '../modules/other-cost/dto/responses/other-cost.dto';
import { UpdateOtherCostDto } from '../modules/other-cost/dto/requests/update-other-cost.dto';
import { OtherCostFilterDto } from '../modules/other-cost/dto/requests/other-cost-filter.dto';
import { FLAG_NOT_PROTECTED, FLAG_PROTECTED } from '../common/constants/unit';
import { SettingOtherCostUsingDto } from '../modules/other-cost/dto/requests/setting-other-cost-using-dto';
import SettingOtherCostEntity from '../entities/setting-other-cost.entity';
import DepartmentEntity from '../entities/department.entity';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { FullUpdateOtherCostDto } from '../modules/other-cost/dto/requests/full-update-other-cost.dto';
import { ManagementOtherCostDto } from '../modules/other-cost/dto/responses/management-other-cost.dto';
export class OtherCostRepository implements IOtherCostRepository {
  constructor(@Inject('OtherCostEntity') private readonly otherCostEntity: typeof OtherCostEntity) {}

  async findById(id: number): Promise<OtherCostEntity> {
    const otherCost = await this.otherCostEntity.findByPk(id);
    if (isNil(otherCost)) {
      throw new Error('Not found.');
    }
    return otherCost;
  }
  checkOtherCostExisted(createOtherCostDto: CreateOtherCostDto): Promise<Boolean> {
    throw new Error('Method not implemented.');
  }
  async checkExisted(params: CreateOtherCostDto): Promise<Boolean> {
    let whereCondition:any = {
      year : params.year,
      month : params.month
    }
    if(!isNil(params.departmentId)) {
      whereCondition.departmentId = params.departmentId;
    }
    if(!isNil(params.settingOtherCostId)) {
      whereCondition.settingOtherCostId = params.settingOtherCostId;
    }
    let otherCost: any = new OtherCostEntity;
    if(!isNil(params.exeption)) {
      otherCost = await this.otherCostEntity.findOne({
        where: { ...whereCondition, id: { [Op.not]: params.exeption }}
      });
    } else {
      otherCost = await this.otherCostEntity.findOne({
        where: { ...whereCondition }
      });
    }

    if(isNil(otherCost)) {
      return false;
    }
    return true;
  }
  async checkSalaryExisted(createOtherCostDto: CreateOtherCostDto): Promise<Boolean> {
    let salary = await this.otherCostEntity.findOne({
      where: {
        [Op.and]: {
          settingOtherCostId: createOtherCostDto.settingOtherCostId,
          year: createOtherCostDto.year,
          month: createOtherCostDto.month,
          departmentId: createOtherCostDto.departmentId
        },
      },
    });
    if(isNil(salary)) {
      return false;
    }
    return true;
  }
  async updateOtherCost(otherCostId: number, updateOtherCostDto: UpdateOtherCostDto): Promise<SuccessResponseDto> {
    try{
      await this.otherCostEntity.update({ ...updateOtherCostDto }, {
        where: { id: otherCostId },
      });
      return new SuccessResponseDto(true);
    } catch(e) {
      return new SuccessResponseDto(false);
    }
  }
  async getOtherCost(params: OtherCostFilterDto): Promise<PageDto<OtherCostDto>> {
    let whereCondition:any = {
      year : params.year,
      month : params.month
    }
    if(!isNil(params.departmentId)) {
      whereCondition.departmentId = params.departmentId;
    }
    if(!isNil(params.departmentIds)) {
      whereCondition.departmentId = { [Op.in]: params.departmentIds };
    }
    const otherCost = await this.otherCostEntity.findAndCountAll({
      where : { ...whereCondition },
      include: [
        {
          model: SettingOtherCostEntity,
          as: 'settingOtherCost',
        },
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: params.take,
      offset: params.skip
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: params, itemCount: otherCost.count });
    const items = otherCost.rows;
    return items.toPageDto(pageMetaDto);
  }
  async getManagementOtherCost(params: OtherCostFilterDto): Promise<ManagementOtherCostDto[]> {
    let whereCondition:any = {};
    const group = ['departmentId', 'year', 'month'];
    if(!isNil(params.startDate) && !isNil(params.endDate)) {
      whereCondition.date = { [Op.between]: [params.startDate, params.endDate] };
    }
    if(!isNil(params.year)) {
      whereCondition.year = params.year;
    }
    if(!isNil(params.month)) {
      whereCondition.month = params.month;
    }
    if(!isNil(params.departmentId)) {
      whereCondition.departmentId = params.departmentId;
    }
    if(!isNil(params.departmentIds)) {
      whereCondition.departmentId = { [Op.in]: params.departmentIds };
    }
    const otherCost = await this.otherCostEntity.findAll({
      where: { ...whereCondition },
      group: ['departmentId', 'year', 'month', 'date'],
      attributes: [
        [fn('SUM', col('amount')), 'amountTotal'],
        'departmentId',
        'year',
        'month',
        'date',
      ],
    });
    
    
    let result: ManagementOtherCostDto[] = [];
    otherCost.forEach((item: any) => {
        let tesst = new ManagementOtherCostDto(item.year, item.month, item.date, item.departmentId, item.dataValues.amountTotal)
        result.push(tesst)
      })
    return result;
  }

  async getSettingOtherCostUsing(): Promise<SettingOtherCostUsingDto[]> {
    return await this.otherCostEntity.findAll({attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('settingOtherCostId')), 'settingOtherCostId']]});
  }

  async createOtherCost(createProjectDto: CreateOtherCostDto): Promise<OtherCostDto> {
    let salary: OtherCostEntity;
    try {
      salary = await this.otherCostEntity.create({
        ...createProjectDto, flag_protected : FLAG_NOT_PROTECTED, date : `${createProjectDto.year}-${createProjectDto.month}-01`
      });
    } catch (e) {
      throw e;
    }
    return salary.toDto();
  }
  async deleteOtherCost(otherCostId: number): Promise<SuccessResponseDto> {
    await this.otherCostEntity.destroy({
      where: {
        id: otherCostId
      }
    });
    return new SuccessResponseDto(true);
  }
  async fullUpdateOtherCost(params: FullUpdateOtherCostDto): Promise<SuccessResponseDto> {
    try{
      let whereCondition:any = {
        year : params.year,
        month : params.month
      }
      if(!isNil(params.delete)) {
        await this.otherCostEntity.destroy({
          where : {
            year : params.year,
            month : params.month,
            id: { [Op.in]: params.delete }
          }
        });
      }
      if(!isNil(params.create)) {
        let dataCreate: Array<any> = [];
        params.create.forEach(async (itemCreate, index) => {
          if(itemCreate.hasOwnProperty('id')) {
            delete itemCreate.id;
          }
          dataCreate[index] = itemCreate;
          dataCreate[index].departmentId = params.departmentId;
          dataCreate[index].year = params.year;
          dataCreate[index].month = params.month;
          dataCreate[index].date = `${params.year}-${params.month}-01`;
        });
        await this.otherCostEntity.bulkCreate(dataCreate);
      }
      if(!isNil(params.update)) {
        params.update.forEach(async (item) => {
          whereCondition.id = item.id;
          const dataUpdate = {
            settingOtherCostId: item.settingOtherCostId,
            amount: item.amount,
            note: item.note
          };
          await this.otherCostEntity.update({ ...dataUpdate }, {
            where: { ...whereCondition }
          });
        })
      }
      return new SuccessResponseDto(true);
    } catch(e) {
      return new SuccessResponseDto(false);
    }
  }

  async deleteDepartmentCost(id: string, year: number, month: number): Promise<SuccessResponseDto> {
    await this.otherCostEntity.update({
      deletedAt: new Date()
    },{
      where: {
        departmentId: id,
        year: year,
        month: month
      }
    });
    return new SuccessResponseDto(true);
  }
}
