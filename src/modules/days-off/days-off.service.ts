import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ResourceNS } from '../../modules/resources/interfaces/resource';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateDaysOffDto } from './dto/request/param-create-dto';
import { UpdateDaysOffDto } from './dto/request/param-update-dto';
import { DaysOffDto } from './dto/response/days-off-dto';
import { DaysOffYearDto } from './dto/response/days-off-year-dto';
import { DaysOffNS } from './interface/days-off.interface';

@Injectable()
export class DaysOffService implements DaysOffNS.IDaysOffService {
  constructor(
    @Inject('IDaysOffRepository') private readonly daysOffRepository: DaysOffNS.IDaysOffRepository,
    @Inject(forwardRef(() => 'IResourceService')) private readonly resourceSevice: ResourceNS.IResourceService,
  ) {}

  async getDaysOff(year: string): Promise<DaysOffDto[]> {
    const daysOff = await this.daysOffRepository.getDaysOffYearNow(year);
    const dayoff = await Promise.all(
      daysOff.map((day) => {
        const { startDate, endDate, note, idSame, updatedAt } = day;
        return new DaysOffYearDto(startDate, endDate, note, idSame, updatedAt);
      }),
    );
    return dayoff;
  }
  async create(param: CreateDaysOffDto): Promise<SuccessResponseDto> {
    const dates = await this.daysOffRepository.getDaysOff();
    dates.map((d) => {
      if (new Date(param.startDate) <= d.date && d.date <= new Date(param.endDate)) {
        throw DaysOffNS.errMsg.DayOffExisted;
      }
    });
    return await this.daysOffRepository.create(param);
  }

  async update(param: UpdateDaysOffDto, isSame: string): Promise<SuccessResponseDto> {
    return await this.daysOffRepository.update(param, isSame);
  }
  async delete(idSame: string): Promise<SuccessResponseDto> {
    const dayOff = await this.daysOffRepository.getDaysOff(idSame);
    await this.daysOffRepository.delete(idSame);
    return await this.resourceSevice.restoreResourcesWhenDeleteDayOff(dayOff);
  }

  async getDaysOffBetween(startDate: Date, endDate: Date): Promise<DaysOffDto[]> {
    return await this.daysOffRepository.getDaysOffBetween(startDate, endDate);
  }
}
