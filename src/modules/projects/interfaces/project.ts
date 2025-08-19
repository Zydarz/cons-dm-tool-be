import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { default as ProjectEntity } from '../../../entities/project.entity';
import { PageDto } from '../../../common/dto/page.dto';
import { ProjectDto } from '../dto/responses/project-dto';
import { ProjectFilterOptionsDto } from '../dto/requests/project-filter-options.dto';
import { ResourceProjectFilterDto } from '../../resources/dto/requests/resource-project-filter.dto';
import { ProjectResourceAllocateDto } from '../../resources/dto/responses/project-resource-allocate-dto';
import { CreateLogWorkDto } from '../dto/requests/create-log-work-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { CreateUserProjectDto } from '../../../modules/user-projects/dto/requests/create-user-project-dto';
import { LogWorkFilterOptionsDto } from '../../../modules/log-works/dto/requests/log-work-filter-options.dto';
import { LogWorkDto } from '../../../modules/log-works/dto/responses/log-work-dto';
import { RequestLogWorkDto } from '../dto/requests/request-log-work-dto';
import { InformationProjectResponseDto } from '../dto/responses/information-project-response.dto';
import { CreateProjectDto } from '../dto/requests/create-project.dto';
import { UpdateProjectDto } from '../dto/requests/update-project.dto';
import { UserNS } from '../../../modules/users/interface/users';
import { default as UserEntity } from '../../../entities/users.entity';
import { ResourceSummaryMonth } from '../../../modules/resource-summaries/dtos/responses/resource-summary-month.dto';
import { FilterProjectDto } from '../dto/requests/filter-project.dto';
import { UserProjectDto } from '../../../modules/user-projects/dto/responses/user-project-dto';
import { Transaction } from 'sequelize';
import { TimeSheetProjectDto } from '../dto/responses/timesheet-project-dto';
import { TimeSheetProjectOfMemberDto } from '../dto/responses/timesheet-project-member-dto';

export namespace ProjectNS {
  export enum Type {
    LABO = 'Labo',
    FIXED = 'Fixed',
  }

  export enum Currency {
    YEN = 'JPY',
    DOLA = 'USD',
    VND = 'VND',
  }

  export enum Status {
    ALL = 'All',
    BIDDING = 'Bidding',
    OPEN = 'Open',
    RUNNING = 'Running',
    CLOSED = 'Closed',
    CLOSING = 'Closing',
  }

  export enum StatusFilter {
    ALL = 'All',
    WITHOUTBIDDING = 'WithoutBidding'
  }
  export enum StatusFilterList {
    ALL = 'Bidding, Open, Running, Closed, Closing',
    WITHOUTBIDDING = 'Open, Running, Closed, Closing'
  }
  export interface IProjectService {
    getAll(projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<PageDto<ProjectDto>>;
    detailProject(id: number, userId?: string, role?: UserNS.Roles): Promise<ProjectEntity>;
    getAllProjectOfUser(id?: string): Promise<ProjectEntity[]>;
    getProjectResource(
      resourceProjectFilterDto: ResourceProjectFilterDto,
      user: UserEntity,
    ): Promise<PageDto<ProjectResourceAllocateDto>>;
    createProject(createProjectDto: CreateProjectDto): Promise<ProjectDto>;
    updateProject(projectId: number, updateProjectDto: UpdateProjectDto, user: UserEntity): Promise<ProjectDto>;
    deleteProject(projectId: number, user: UserEntity): Promise<SuccessResponseDto>;
    createLogWork(
      param: CreateUserProjectDto,
      createLogWorkDto: CreateLogWorkDto,
      user: UserEntity,
    ): Promise<SuccessResponseDto>;
    getLogWork(projectId: number, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>>;
    getLogWorkByUserId(userId: string, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>>;
 
    getDetailLogWork(logWorkId: number): Promise<LogWorkDto>;
    updateLogWork(
      logWorkId: number,
      updateLogWorkDto: RequestLogWorkDto,
      user: UserEntity,
    ): Promise<SuccessResponseDto>;
    destroyLogWork(logWorkId: number, user: UserEntity): Promise<SuccessResponseDto>;
    getInformationProject(
      projectId: number,
      userId?: string,
      role?: UserNS.Roles,
    ): Promise<InformationProjectResponseDto>;
    getPmProject(id: number): Promise<ProjectDto | undefined>;
    isProjectManager(id: number, userId: string): Promise<boolean>;
    updateProjectPm(projectId: number, pm: string): Promise<void>;
    getAllResourceSummaries(projectIs: number): Promise<ResourceSummaryMonth[]>;
    getProjectbyId(id: number): Promise<ProjectDto>;
    getProjectForPm(email: string): Promise<ProjectDto[]>;
    getProjectOfUser(id: string): Promise<ProjectDto[]>;
    getProjectAndMemberForTimesheets(user: UserEntity): Promise<TimeSheetProjectDto>;
    getInfoAllProject(projectFilterOptionsDto: ProjectFilterOptionsDto, user: UserEntity): Promise<ProjectDto[]>;
    deleteMemberProject(projectId: number, userId: string, userEntity: UserEntity): Promise<SuccessResponseDto>;
    detailProject2(id: number, userId?: string, role?: UserNS.Roles): Promise<ProjectDto>;
    // getProjectSalaries(projectId: string, projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<object>;
    getProjectSalaries(projectId: string, resourceProjectFilterDto: ResourceProjectFilterDto, user: UserEntity): Promise<object>;
    getMemberInProject(user: UserEntity, projectId?: number): Promise<UserProjectDto[] | ProjectDto[]>;
    updateCustomerIdInProjectRecords(customerId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getProjectsOfCustomer(customerId: number): Promise<ProjectDto[]>;
    deleteCustomer(id: number): Promise<SuccessResponseDto>;
    getProjectByDepartment(id: number): Promise<ProjectDto[]>;
  }

  export interface IProjectRepository {
    getAll(projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<PageDto<ProjectDto>>;
    findById(id: number): Promise<ProjectEntity | null>;
    getAllProjectOfUser(id: string): Promise<ProjectEntity[]>;
    getProjectResource(
      resourceProjectFilterDto: ResourceProjectFilterDto,
    ): Promise<PageDto<ProjectResourceAllocateDto>>;
    createProject(createProjectDto: CreateProjectDto, type: string, name?: string): Promise<ProjectDto>;
    updateProject(
      projectId: number,
      updateProjectDto: UpdateProjectDto,
      name?: string,
      type?: string,
    ): Promise<ProjectDto>;
    deleteProject(projectId: number, t?: Transaction): Promise<SuccessResponseDto>;
    updateProjectPm(projectId: number, pm: string): Promise<void>;
    getProjectForPm(email: string): Promise<ProjectDto[]>;
    getProjectOfUser(id: string): Promise<ProjectDto[]>;
    getProjectByUserId(id: string): Promise<TimeSheetProjectOfMemberDto[]>;
    getAllProjectsForTimesheet(): Promise<TimeSheetProjectOfMemberDto[]> ;
    getInfoAllProject(projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<ProjectDto[]>;
    getProject(filter: FilterProjectDto): Promise<ProjectDto | null>;
    updateCustomerIdInProjectRecords(customerId: number, t?: Transaction): Promise<SuccessResponseDto>;
    getProjectsOfCustomer(customerId: number): Promise<ProjectDto[]>;
    getAllProjects(): Promise<ProjectDto[]>;
    deleteCustomer(id: number): Promise<SuccessResponseDto>;
    getProjectByDepartment(id: number): Promise<ProjectDto[]>;
  }

  export const errMsg = {
    ProjectNotFound: new NotFoundException('Project Not Found'),
    ProjectExisted: new ConflictException('Project Name Existed '),
    CodeIsEmpty: new BadRequestException('code is empty'),
  };
}
