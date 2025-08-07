import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { RequestLogWorkDto } from '../../modules/projects/dto/requests/request-log-work-dto';
import { PageDto } from '../../common/dto/page.dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateLogWorkDto } from '../../modules/projects/dto/requests/create-log-work-dto';
import { LogWorkFilterOptionsDto } from './dto/requests/log-work-filter-options.dto';
import { LogWorkDto } from './dto/responses/log-work-dto';
import { LogWorkNS } from './interfaces/logwork-interface';
import { default as LogWorkEntity } from '../../entities/log-work.entity';
import { IResourceSummaryService } from '../resource-summaries/interfaces/resource-summary.service.interface';
import { UserProjectNS } from '../user-projects/interfaces/user-project';
import { Transaction } from 'sequelize';

@Injectable()
export class LogWorksService implements LogWorkNS.ILogWorkService {
  constructor(
    @Inject('ILogWorkRepository') private readonly logWorkRepository: LogWorkNS.ILogWorkRepository,
    @Inject('IResourceSummaryService') private readonly resourceSummaryService: IResourceSummaryService,
    @Inject('IUserProjectService') private readonly userProjectService: UserProjectNS.IUserProjectServices,
  ) {}
  async createLogWork(userProjectId: number, createLogWorkDto: CreateLogWorkDto): Promise<SuccessResponseDto> {
    for (const logWorkDto of createLogWorkDto.logWorks) {
      const { reportDate, actualEffort } = logWorkDto;
      const userProject = await this.userProjectService.findById(userProjectId);
      await this.logWorkRepository.createLogWork(userProjectId, logWorkDto);
      await this.resourceSummaryService.addResourceSummaryWhenAddLogWork(
        reportDate,
        actualEffort,
        userProject?.projectId,
      );
    }
    return new SuccessResponseDto(true);
  }

  async getLogWork(projectId: number, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>> {
    return await this.logWorkRepository.getLogWork(projectId, logWorkFilterOptionsDto);
  }

  
  async getLogWorkByUserId(userId: string, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>> {
    return await this.logWorkRepository.getLogWorkByUserId(userId, logWorkFilterOptionsDto);
  }

  async getDetailLogWork(logWorkId: number): Promise<LogWorkDto> {
    const logWork = await this.findById(logWorkId);
    return logWork.toDto();
  }

  async updateLogWork(logWorkId: number, updateLogWorkDto: RequestLogWorkDto): Promise<SuccessResponseDto> {
    const logWork = await this.findById(logWorkId);
    const reportDateBefore = logWork.reportDate;
    const reportDateAfter = updateLogWorkDto.reportDate;
    const actualEffortBefore = logWork.actualEffort ?? 0;
    const actualEffortAfter = updateLogWorkDto.actualEffort ?? 0;
    const projectId = logWork.userProject?.projectId ?? 0;

    await this.logWorkRepository.updateLogWork(logWork, updateLogWorkDto);
    await this.resourceSummaryService.updateResourceSummaryWhenEditLogwork({
      reportDateBefore,
      reportDateAfter,
      actualEffortBefore,
      actualEffortAfter,
      projectId,
    });
    return new SuccessResponseDto(true);
  }

  async checkPermission(userId: string, logWorkId: number): Promise<SuccessResponseDto> {
    const logWork = await this.logWorkRepository.checkPermission(userId, logWorkId);
    if (isNil(logWork)) {
      throw LogWorkNS.errMsg.UserPermission;
    }
    return new SuccessResponseDto(true);
  }

  async destroyLogWork(logWorkId: number): Promise<SuccessResponseDto> {
    const logWork = await this.findById(logWorkId);
    const actual = logWork.actualEffort ?? 0;
    const month = logWork.reportDate?.getMonth() ?? 0;
    const year = logWork.reportDate?.getFullYear() ?? 0;
    const projectId = logWork.userProject?.projectId ?? 0;
    await this.resourceSummaryService.updateResourceSummaryWhenDeleteLogwork(month + 1, year, projectId, actual);
    await logWork.destroy();
    return new SuccessResponseDto(true);
  }

  async findById(logWorkId: number): Promise<LogWorkEntity> {
    const logWork = await this.logWorkRepository.getDetailLogWork(logWorkId);
    if (isNil(logWork)) {
      throw LogWorkNS.errMsg.LogWorkNotFound;
    }
    return logWork;
  }
  async findAllActualEffort(userId: string, projectId: number): Promise<LogWorkDto[]> {
    const logwork = await this.logWorkRepository.findAllActualEffort(userId, projectId);
    return logwork.toDtos();
  }

  async deleteLogWorksUser(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.logWorkRepository.deleteLogWorksUser(userProjectId, t);
  }

  async deleteLogWorkByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto> {
    return await this.logWorkRepository.deleteLogWorkByUserProjectIds(userProjectIds, t);
  }
}
