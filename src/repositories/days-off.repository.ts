import { Inject } from '@nestjs/common';
import { DaysOffNS } from '../modules/days-off/interface/days-off.interface';
import { default as DaysOffEntity } from '../entities/days-off.entity';
import { CreateDaysOffDto } from '../modules/days-off/dto/request/param-create-dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import moment from 'moment';
import { UpdateDaysOffDto } from '../modules/days-off/dto/request/param-update-dto';
import { isNil } from 'lodash';
import sequelize, { Op } from 'sequelize';
import { SequelizeCodeErrs } from '../common/constants/sequelize-error';

export class DaysOffRepository implements DaysOffNS.IDaysOffRepository {
  constructor(@Inject(DaysOffEntity.name) private readonly daysOffEntity: typeof DaysOffEntity) {}

  async getDaysOff(idSame?: string): Promise<DaysOffEntity[]> {
    if (idSame) {
      return await this.daysOffEntity.findAll({
        where: {
          idSame,
        },
      });
    }
    return await this.daysOffEntity.findAll();
  }
  async create(param: CreateDaysOffDto, edit?: string): Promise<SuccessResponseDto> {
    const startDate = moment(param.startDate, 'YYYY/MM/DD');
    const endDate = moment(param.endDate, 'YYYY/MM/DD');
    const idSame = `${param.startDate}-${param.endDate}`;
    let idEdit: string = idSame;
    if (edit && param.edit) {
      idEdit = param.edit;
    }
    const dayDiff = endDate.diff(startDate, 'days') + 1;
    await Promise.all(
      [...Array(dayDiff)].map(async (_, i) => {
        const dateResouse = moment(new Date(param.startDate)).add('days', i);
        try {
          await this.daysOffEntity.create({
            date: dateResouse,
            note: param.note,
            idSame,
            edit: idEdit,
          });
        } catch (e) {
          if (e.name === SequelizeCodeErrs.DUPLICATE) {
            throw DaysOffNS.errMsg.DayOffExisted;
          }
        }
      }),
    );
    return new SuccessResponseDto(true);
  }
  async update(param: UpdateDaysOffDto, idSame: string): Promise<SuccessResponseDto> {
    const { startDate, endDate } = param;
    if (!isNil(startDate) && !isNil(endDate)) {
      const dates = await this.getDaysOffNotId(idSame);
      dates.map((d) => {
        if (new Date(startDate) <= d.date && d.date <= new Date(endDate)) {
          throw DaysOffNS.errMsg.DayOffExisted;
        }
      });
      await this.delete(idSame);
      await this.create({ startDate, endDate, note: param.note, edit: idSame }, 'edit');
      return new SuccessResponseDto(true);
    }
    const dateOffs = await this.daysOffEntity.findAll({
      where: {
        idSame,
      },
    });
    dateOffs.map((date) =>
      date.update({
        note: param.note,
      }),
    );

    return new SuccessResponseDto(true);
  }

  async delete(idSame: string): Promise<SuccessResponseDto> {
    await this.daysOffEntity.destroy({
      where: {
        idSame,
      },
    });
    return new SuccessResponseDto(true);
  }
  async getDaysOffNotId(id: string): Promise<DaysOffEntity[]> {
    return await this.daysOffEntity.findAll({
      where: {
        idSame: { [Op.not]: id },
      },
    });
  }

  async getDaysOffYearNow(yearnow: string) {
    let condition;
    if (!isNaN(+yearnow)) {
      condition = sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), yearnow);
    }
    const days = await this.daysOffEntity.findAll({
      attributes: [
        'idSame',
        [sequelize.fn('MAX', sequelize.col('note')), 'note'], // 👈 hoặc dùng ANY_VALUE nếu MySQL hỗ trợ
        [sequelize.fn('MAX', sequelize.col('updatedAt')), 'updatedAt'],
        [sequelize.fn('MAX', sequelize.col('date')), 'endDate'],
        [sequelize.fn('MIN', sequelize.col('date')), 'startDate'],
      ],
      where: condition,
      group: ['idSame'],
      order: [[sequelize.fn('MAX', sequelize.col('updatedAt')), 'DESC']],
      raw: true,
    });
    
    return days;
  }
  async getDaysOffGroupByEdit(field: Array<string>, idSame: string) {
    const days = await this.daysOffEntity.findAll({
      attributes: field,
      where: {
        idSame,
      },
      group: field,
      raw: true,
    });
    return days;
  }

  async getDaysOffBetween(startDate: Date, endDate: Date): Promise<DaysOffEntity[]> {
    const condition = {};
    if (!isNil(startDate) && !isNil(endDate)) {
      Object.assign(condition, {
        date: { [Op.between]: [startDate, endDate] },
      });
    }
    const days = await this.daysOffEntity.findAll({
      attributes: [
        'date',
        'note',
        'idSame'
      ],
      where: condition,
      order: [['updatedAt', 'DESC']],
      raw: true,
    });
    return days;
  }
}
