import { ConflictException, NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { default as DaysOffEntity } from '../../../entities/days-off.entity';
import { CreateDaysOffDto } from '../dto/request/param-create-dto';
import { UpdateDaysOffDto } from '../dto/request/param-update-dto';
import { DaysOffDto } from '../dto/response/days-off-dto';

export namespace DaysOffNS {
  export interface IDaysOffService {
    getDaysOff(field?: string): Promise<DaysOffDto[]>;
    create(param: CreateDaysOffDto): Promise<SuccessResponseDto>;
    update(param: UpdateDaysOffDto, idSame: string): Promise<SuccessResponseDto>;
    delete(idSame: string): Promise<SuccessResponseDto>;
    getDaysOffBetween(startDate: Date, endDate: Date): Promise<DaysOffDto[]>;
  }
  export interface IDaysOffRepository {
    getDaysOff(idSame?: string): Promise<DaysOffEntity[]>;
    delete(idSame: string): Promise<SuccessResponseDto>;
    update(param: UpdateDaysOffDto, idSame: string): Promise<SuccessResponseDto>;
    create(param: CreateDaysOffDto): Promise<SuccessResponseDto>;
    getDaysOffYearNow(year?: string);
    getDaysOffGroupByEdit(fields: Array<string>, idSame: string);
    getDaysOffBetween(startDate: Date, endDate: Date): Promise<DaysOffDto[]>;
  }

  export const errMsg = {
    DayOffNotExist: new NotFoundException('day off not exist!'),
    DayOffExisted: new ConflictException('day Existed '),
  };
  export enum Field {
    YEAR = 'year',
  }
}
