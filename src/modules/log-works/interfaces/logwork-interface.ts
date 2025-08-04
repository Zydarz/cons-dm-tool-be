import { RequestLogWorkDto } from '../../../modules/projects/dto/requests/request-log-work-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { CreateLogWorkDto } from '../../../modules/projects/dto/requests/create-log-work-dto';
import { LogWorkFilterOptionsDto } from '../dto/requests/log-work-filter-options.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { LogWorkDto } from '../dto/responses/log-work-dto';
import { default as LogWorkEntity } from '../../../entities/log-work.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';

export namespace LogWorkNS {
  export enum LogWorkActivity {
    Management = 'Management',
    Trans = 'Trans & Comm',
    Investigate = 'Investigate',
    DevOps = 'DevOps',
    Coding = 'Coding',
    Test = 'Test',
    ReviewCD = 'Review CD',
    ReviewTC = 'Review TC',
    Report = 'Report',
    Other = 'Other',
  }

  export interface ILogWorkService {
    createLogWork(userProjectId: number, createLogWorkDto: CreateLogWorkDto): Promise<SuccessResponseDto>;
    getLogWork(projectId: number, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>>;
    getDetailLogWork(logWorkId: number): Promise<LogWorkDto>;
    updateLogWork(logWorkId: number, updateLogWorkDto: RequestLogWorkDto): Promise<SuccessResponseDto>;
    checkPermission(userId: string, logWorkId: number): Promise<SuccessResponseDto>;
    destroyLogWork(logWorkId: number): Promise<SuccessResponseDto>;
    findById(logWorkId: number): Promise<LogWorkEntity>;
    findAllActualEffort(userId: string, projectId: number): Promise<LogWorkDto[]>;
    deleteLogWorksUser(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    deleteLogWorkByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto>;
  }
  export interface ILogWorkRepository {
    createLogWork(userProjectId: number, logWorkDto: RequestLogWorkDto): Promise<SuccessResponseDto>;
    getLogWork(projectId: number, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>>;
    getDetailLogWork(logWorkId: number): Promise<LogWorkEntity | null>;
    updateLogWork(logWork: LogWorkEntity, updateLogWorkDto: RequestLogWorkDto): Promise<SuccessResponseDto>;
    checkPermission(userId: string, logWorkId: number): Promise<LogWorkEntity | null>;
    findAllActualEffort(userId: string, projectId: number): Promise<LogWorkEntity[]>;
    deleteLogWorksUser(userProjectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    deleteLogWorkByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto>;
  }

  export const errMsg = {
    LogWorkNotFound: new NotFoundException('Log Work Not Found'),
    UserPermission: new ForbiddenException('User Permission'),
  };
}
