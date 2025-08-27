import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { isArray, isEmpty, isNil, isObject } from 'lodash';
import { ResourceProjectFilterDto } from '../../modules/resources/dto/requests/resource-project-filter.dto';
import { UserSalaryFilterDto } from '../../modules/user-salary/dto/requests/user-salary-filter.dto';
import { ProjectResourceAllocateDto } from '../../modules/resources/dto/responses/project-resource-allocate-dto';
import { PageDto } from '../../common/dto/page.dto';
import { ProjectFilterOptionsDto } from './dto/requests/project-filter-options.dto';
import { ProjectDto } from './dto/responses/project-dto';
import { ProjectNS } from './interfaces/project';
import { default as ProjectEntity } from '../../entities/project.entity';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateLogWorkDto } from './dto/requests/create-log-work-dto';
import { UserProjectNS } from '../../modules/user-projects/interfaces/user-project';
import { LogWorkNS } from '../../modules/log-works/interfaces/logwork-interface';
import { CreateUserProjectDto } from '../../modules/user-projects/dto/requests/create-user-project-dto';
import { LogWorkFilterOptionsDto } from '../../modules/log-works/dto/requests/log-work-filter-options.dto';
import { LogWorkDto } from '../../modules/log-works/dto/responses/log-work-dto';
import { RequestLogWorkDto } from './dto/requests/request-log-work-dto';
import { InformationProjectResponseDto } from './dto/responses/information-project-response.dto';
import { IResourceSummaryService } from '../resource-summaries/interfaces/resource-summary.service.interface';
import { CreateProjectDto } from './dto/requests/create-project.dto';
import { UpdateProjectDto } from './dto/requests/update-project.dto';
import { CustomerNS } from '../../modules/customers/interfaces/customer';
import { ResourceNS } from '../../modules/resources/interfaces/resource';
import { DaysOffNS } from '../../modules/days-off/interface/days-off.interface';
import { IUserSalaryRepository } from '../../modules/user-salary/interface/user-salary.repository.interface';

import { UserNS } from '../../modules/users/interface/users';
import { default as UserEntity } from '../../entities/users.entity';
import moment from 'moment';
import { IProjectSituationService } from '../../modules/project-situations/interfaces/project-situation.service.interface';
import { TotalResourceProjectDto } from '../../modules/resource-summaries/dtos/responses/total-resource-summary.dto';
import { MAN_MONTH_PERCENT } from '../../common/constants/unit';
import { ResourceSummaryMonth } from '../../modules/resource-summaries/dtos/responses/resource-summary-month.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { ITeamsService } from '../../modules/teams/interfaces/teams.service.interface';
import { UserProjectDto } from '../../modules/user-projects/dto/responses/user-project-dto';
import { PaymentNS } from '../../modules/payment-tracking/interfaces/payment-tracking';
import { MasterDataNS } from '../../modules/master-data/master-data';
import { Util } from '../../common/util';
import { TimeSheetProjectDto } from './dto/responses/timesheet-project-dto';
import { TimeSheetMemberDto } from '../../modules/users/dto/response/user-project-dto';
@Injectable()
export class ProjectsService implements ProjectNS.IProjectService {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: ProjectNS.IProjectRepository,

    @Inject('ICustomerService')
    private readonly customerService: CustomerNS.ICustomerService,

    @Inject('IUserProjectService')
    private readonly userProjectService: UserProjectNS.IUserProjectServices,

    @Inject('ILogWorkService')
    private readonly logWorkService: LogWorkNS.ILogWorkService,

    @Inject('IResourceSummaryService')
    private readonly resourceSummaryService: IResourceSummaryService,

    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,




    @Inject('ITeamsService')
    private readonly teamsService: ITeamsService,

    @Inject('IPaymentTrackingService')
    private readonly paymentTracking: PaymentNS.IPaymentTrackingService,

    @Inject('IProjectSituationService') private readonly projectSituationService: IProjectSituationService,

    @Inject(forwardRef(() => 'IResourceService'))
    private readonly resourceService: ResourceNS.IResourceService,

    @Inject('IMasterDataService')
    private readonly masterDataService: MasterDataNS.IMasterDataService,

    @Inject('IResourceRepository')
    private readonly resourceRepository: ResourceNS.IResourceRepository,

    @Inject('IDaysOffService')
    private readonly daysOffService: DaysOffNS.IDaysOffService,

    @Inject('IUserSalaryRepository')
    private readonly userSalaryRepository: IUserSalaryRepository,



    @Inject(Sequelize.name)
    private readonly sequelize: Sequelize,
  ) { }

  private async sumActualByProject(id: number): Promise<number> {
    let sum = +0;
    const summary = await this.resourceSummaryService.getAllSummary(id);
    for (const s of summary) {
      sum += s.actual;
    }
    return sum;
  }

  private async checkMemberInProject(projectId: number, userId?: string) {
    const userProjects = await this.userProjectService.getUserByProjectId(projectId);
    if (userId && !userProjects.includes(userId)) {
      throw new ForbiddenException();
    }
  }

  async getAll(projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<PageDto<ProjectDto>> {
    const results = await this.projectRepository.getAll(projectFilterOptionsDto);
    const projectDtos = results.data;
    await Promise.all(
      projectDtos.map(async (p) => {
        if (!isNil(p.pm) && !isEmpty(p.pm)) {
          const pm = JSON.parse(p.pm);
          let userProjectIdPms = await Promise.all(
            pm.map(async (e: string) => {
              const user = await this.userService.getUserByUsername(e);
              if (!isEmpty(user)) {
                return await this.userProjectService.getUserProjectByProjectIdAndUserId(user.id, p.id);
              }
              return [];
            }),
          );

          userProjectIdPms = userProjectIdPms.filter((e) => !isEmpty(e)).flat();
          const listResourcePm = await this.resourceService.getResourcePms(userProjectIdPms);

          const pms = listResourcePm
            .map((e) => e.userProject?.users?.username)
            .filter(username => username && username.trim() !== '');

          p.pm = JSON.stringify(pms);
        }

        const lastProjectSituation = await this.projectSituationService.lastSitualation(p.id);
        if (lastProjectSituation) {
          p.noteSituation = lastProjectSituation.note;
          p.dateSituation = lastProjectSituation.date;
          p.usernameSituation = lastProjectSituation.submitter.username;
        }
        const sum = await this.sumActualByProject(p.id);
        const total = await this.resourceService.getResourceInProject(p.id);
        const ce = parseFloat(total[0].acPercentTotal) + parseFloat(total[0].tcPercentTotal);
        p.calendarEffort = Math.round((ce / MAN_MONTH_PERCENT) * 100) / 100;
        p.actual = parseFloat(sum.toFixed(2));
      }),
    );
    return results;
  }

  async detailProject(id: number, userId?: string, role?: UserNS.Roles): Promise<ProjectEntity> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      return {} as ProjectEntity;
    }
    // TODO: role admin
    if (role === UserNS.Roles.ADMIN || role === UserNS.Roles.LOS) {
      return project;
    }
    // TODO: check user existed in project
    await this.checkMemberInProject(id, userId);
    return project;
  }

  async detailProject2(id: number, userId?: string | undefined, role?: UserNS.Roles | undefined): Promise<ProjectDto> {
    const project = await this.projectRepository.getProject({ projectId: id });

    if (!project) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
    // TODO: role admin
    if (role === UserNS.Roles.ADMIN || role === UserNS.Roles.LOS) {
      return project;
    }
    // TODO: check user existed in project
    await this.checkMemberInProject(id, userId);
    return project;
  }

  async getAllProjectOfUser(id: string): Promise<ProjectEntity[]> {
    return await this.projectRepository.getAllProjectOfUser(id);
  }

  async getProjectResource(
    resourceProjectFilterDto: ResourceProjectFilterDto,
    user: UserEntity,
  ): Promise<PageDto<ProjectResourceAllocateDto>> {
    // TODO: role admin
    if (user.role === UserNS.Roles.ADMIN || user.role === UserNS.Roles.LOS) {
      return await this.projectRepository.getProjectResource(resourceProjectFilterDto);
    }
    if (resourceProjectFilterDto.projectIds) {
      const resourceProjectFilter = resourceProjectFilterDto.projectIds?.split(',').map(Number);
      resourceProjectFilterDto.projectIds = resourceProjectFilter.join(',');
      return await this.projectRepository.getProjectResource(resourceProjectFilterDto);
    }
    const projects = await this.getProjectOfUser(user.id);
    resourceProjectFilterDto.projectIds = projects.map((p) => p.id).join(',');
    return await this.projectRepository.getProjectResource(resourceProjectFilterDto);
  }

  async getProjectAndMemberForTimesheets(
    user: UserEntity,
  ): Promise<TimeSheetProjectDto> {
    let projects;
    let members;

    if (user.role === UserNS.Roles.ADMIN || user.role === UserNS.Roles.LOS) {
      projects = await this.projectRepository.getAllProjectsForTimesheet();
      members = await this.userService.getAllMembersForTimesheet();
    }
    else {
      projects = await this.projectRepository.getProjectByUserId(user.id);
      var projectsByPM = projects.filter(project =>
        project.pm?.includes(`"${user.username}"`),
      );

      if (projectsByPM.length === 0) {
        const member = new TimeSheetMemberDto(user, projects[0]?.id.toString());
        members = [member];
      }
      else {
        members = await this.userService.getMemberByProjectId(projectsByPM.map(p => p.id));
      }
    }

    const memberMap = new Map();

    members.forEach(member => {
      if (memberMap.has(member.id)) {
        memberMap.get(member.id).projectIds.push(member.projectIds);
      } else {
        memberMap.set(member.id, {
          id: member.id,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
          email: member.email,
          surName: member.surName,
          username: member.username,
          projectIds: [member.projectIds]
        });
      }
    });

    // console.log('memberMap', memberMap);

    const modifiedMembers = Array.from(memberMap.values()).map(member => ({
      ...member,
      projectIds: member.projectIds.join(',')
    }));

    // console.log('modifiedMembers', modifiedMembers);

    const timesheet: TimeSheetProjectDto = {
      projects: projects || [],
      members: modifiedMembers || [],
    };

    return timesheet;

  }

  async createProject(createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    let customer;
    const projects = await this.projectRepository.getAllProjects();
    projects.map((p) => {
      if (p.name === createProjectDto.name) {
        throw ProjectNS.errMsg.ProjectExisted;
      }
    });
    if (createProjectDto.customerId) {
      const { customerId } = createProjectDto;
      const isCustomer = await this.customerService.getCustomerById(customerId);
      customer = await this.customerService.getCustomerDetail(createProjectDto.customerId);
      if (!isCustomer) {
        throw CustomerNS.errMsg.CustomerNotFound;
      }
    }
    const name = !isNil(customer) ? customer.name : undefined;
    const contracType = await this.masterDataService.getMasterDateContractType(createProjectDto.contractTypeId);
    const project = await this.projectRepository.createProject(createProjectDto, contracType.name, name);
    const monthArr = Util.getAllMonthAndYearFromStartDateAndEndDate(
      createProjectDto.startDate,
      createProjectDto.endDate,
    );
    await Promise.all(
      monthArr.map(async (monthObj) => {
        const { startMonthDate } = monthObj;
        const year = +moment(startMonthDate).format('YYYY');
        const month = +moment(startMonthDate).format('MM');
        await this.resourceSummaryService.createResourcesSummary({
          projectId: project.id,
          month,
          year,
        });
      }),
    );
    const { channelId, groupId } = createProjectDto;
    if (channelId && groupId) {
      await this.teamsService.setOneBotChannel({
        groupId,
        channelId,
        projectName: project.name,
        projectId: project.id,
      });
    }
    return project;
  }

  async updateProject(projectId: number, updateProjectDto: UpdateProjectDto, user: UserEntity): Promise<ProjectDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    let customer;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    let contracType;
    if (updateProjectDto.name) {
      const projects = await this.projectRepository.getAllProjects();
      projects.map((p) => {
        if (p.name === updateProjectDto.name && p.id !== projectId) {
          throw ProjectNS.errMsg.ProjectExisted;
        }
      });
    }
    if (updateProjectDto.customerId) {
      const { customerId } = updateProjectDto;
      const isCustomer = await this.customerService.getCustomerById(customerId);
      customer = await this.customerService.getCustomerDetail(updateProjectDto.customerId);
      if (!isCustomer) {
        throw CustomerNS.errMsg.CustomerNotFound;
      }
    }
    if (updateProjectDto.contractTypeId) {
      contracType = await this.masterDataService.getMasterDateContractType(updateProjectDto.contractTypeId);
    }


    const name = !isNil(customer) ? customer.name : undefined;
    const projectDetails = await this.detailProject2(projectId);

    const pms = projectDetails.pm ? JSON.parse(projectDetails.pm) : [];
    if (user.role === UserNS.Roles.ADMIN || pms.includes(user.username)) {
      const project = await this.projectRepository.updateProject(projectId, updateProjectDto, name, contracType.name);
      if (updateProjectDto.startDate && updateProjectDto.endDate) {
        const start = new Date(updateProjectDto.startDate);
        const end = new Date(updateProjectDto.endDate);
        if (start > projectDetails.startDate && end < projectDetails.endDate) {
          await this.resourceService.deleteResourceByDate(projectId, start, end);
        }
        if (end < projectDetails.endDate && start <= projectDetails.startDate) {
          await this.resourceService.deleteResourceByDate(projectId, undefined, end);
        }
        if (start > projectDetails.startDate && end >= projectDetails.endDate) {
          await this.resourceService.deleteResourceByDate(projectId, start);
        }
      }
      const { groupId, channelId } = updateProjectDto;
      if (groupId !== projectDetails.groupId || channelId !== projectDetails.channelId) {
        await this.teamsService.setOneBotChannel({
          channelId,
          groupId,
          projectId: projectDetails.id,
          projectName: projectDetails.name,
        });
      }
      return project;
    }
    throw new ForbiddenException();
  }

  async updateProjectPm(projectId: number, pm: string): Promise<void> {
    await this.projectRepository.updateProjectPm(projectId, pm);
  }
  async deleteProject(projectId: number, user: UserEntity): Promise<SuccessResponseDto> {
    if (user.role !== UserNS.Roles.ADMIN) {
      const isPm = await this.isProjectManager(projectId, user.id);
      if (!isPm) {
        throw new ForbiddenException();
      }
    }

    // bot_setting, log work, payment tracking, project situation, project, resource summary, resources, user project, teamlog...
    const getAllUserProjectIdsByProjectId = await this.userProjectService.getUserProjectByProjectId(projectId);
    const userProjectIds = getAllUserProjectIdsByProjectId.map((e) => e.id);

    const t: Transaction = await this.sequelize.transaction();

    // Delete BotSetting by ProjectId
    const deleteBotSetting = this.teamsService.deleteBotSetting(projectId);
    // Delete TeamLog By ProjectId
    const deleteTeamLog = this.teamsService.deleteTeamLog(projectId, t);
    // // Delete LogWork By ProjectId
    const deleteLogWork = this.logWorkService.deleteLogWorkByUserProjectIds(userProjectIds);
    // // Delete Payment Tracking By ProjectId
    const deletePaymentTracking = this.paymentTracking.deletePaymentByProjectId(projectId, t);
    // // Delete ProjectSituation
    const deleteProjectSituation = this.projectSituationService.deleteProjectSituationByProjectId(projectId, t);
    // // Delete Resource Summary
    const deleteResourceSummary = this.resourceSummaryService.deleteResourceSummaryByProjectId(projectId, t);
    // // Delete All Resource
    // // -> Step 1: Get All UserProject have ProjectID
    // // -> Step 2: Delete All resource by userProjectIds
    const deleteResourceByUserProjectIds = this.resourceService.deletetAllResourceByUserProjectIds(userProjectIds, t);
    // // Delete all userProject by ProjectId
    const deleteUserProjectByProjectId = this.userProjectService.deleteUserProjectByProjectId(projectId, t);

    const deleteProjectRecord = this.projectRepository.deleteProject(projectId, t);
    await Promise.all([
      deleteLogWork,
      deletePaymentTracking,
      deleteTeamLog,
      deleteBotSetting,
      deleteProjectRecord,
      deleteProjectSituation,
      deleteResourceSummary,
      deleteResourceByUserProjectIds,
      deleteUserProjectByProjectId,
    ]).catch(() => t.rollback());

    await t.commit();
    return new SuccessResponseDto(true);
  }

  async createLogWork(
    param: CreateUserProjectDto,
    createLogWorkDto: CreateLogWorkDto,
    user: UserEntity,
  ): Promise<SuccessResponseDto> {


    if (param.projectId != 0) {
      const resrources = await this.resourceService.getResourceUserInProject(param);
      const dates = resrources.map((res) => res.date.getTime());
      const maxDate = new Date(Math.max(...dates));
      if (
        (isEmpty(resrources) && user.role !== UserNS.Roles.ADMIN) ||
        (maxDate <= new Date() && (user.role === UserNS.Roles.MEMBER || user.role === UserNS.Roles.LOS))
      ) {
        throw new ForbiddenException();
      }
      const userProject = await this.userProjectService.findUserProject(param);
      let userProjectId = +0;
      if (isNil(userProject)) {
        const createUserProject = await this.userProjectService.createUserProject(param);
        userProjectId = createUserProject.id;
      } else {
        userProjectId = userProject.id;
      }
      await this.logWorkService.createLogWork(userProjectId, createLogWorkDto);
    }
    else {
      // Xử lý từng logWork với projectId riêng biệt
      const userProjectMap = new Map<number, number>(); // Map projectId -> userProjectId

      for (const logWork of createLogWorkDto.logWorks) {
        if (!logWork.projectId) {
          return new SuccessResponseDto(false);
        }

        let userProjectId: number;

        // Kiểm tra xem đã xử lý projectId này chưa
        if (userProjectMap.has(logWork.projectId)) {
          userProjectId = userProjectMap.get(logWork.projectId)!;
        } else {
          // Tạo param mới với projectId từ logWork
          var logWorkParam: CreateUserProjectDto = {
            ...param,
            projectId: logWork.projectId,
            userId: logWork.memberId ? logWork.memberId : param.userId,
          };

          // Kiểm tra quyền truy cập cho project này
          const resources = await this.resourceService.getResourceUserInProject(logWorkParam);
          const dates = resources.map((res) => res.date.getTime());
          const maxDate = new Date(Math.max(...dates));

          if (
            (isEmpty(resources) && user.role !== UserNS.Roles.ADMIN) ||
            (maxDate <= new Date() && (user.role === UserNS.Roles.MEMBER || user.role === UserNS.Roles.LOS))
          ) {
            throw new ForbiddenException(`Access denied for project ${logWork.projectId}`);
          }


          // Tìm hoặc tạo userProject cho projectId này
          const userProject = await this.userProjectService.findUserProject(logWorkParam);
          if (isNil(userProject)) {
            const createUserProject = await this.userProjectService.createUserProject(logWorkParam);
            userProjectId = createUserProject.id;
          } else {
            userProjectId = userProject.id;
          }

          // Lưu vào map để tránh xử lý lại
          userProjectMap.set(logWork.projectId, userProjectId);
        }

        // Tạo logWork riêng lẻ cho từng item
        const singleLogWorkDto: CreateLogWorkDto = {
          logWorks: [logWork]
        };

        await this.logWorkService.createLogWork(userProjectId, singleLogWorkDto);
      }
    }

    return new SuccessResponseDto(true);
  }


  async getLogWork(projectId: number, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>> {
    return await this.logWorkService.getLogWork(projectId, logWorkFilterOptionsDto);
  }

  async getLogWorkByUserId(userId: string, logWorkFilterOptionsDto: LogWorkFilterOptionsDto): Promise<PageDto<LogWorkDto>> {
    let dataShow;
    var user = await this.userService.getUserById(userId);

    const checkProject = this.validDataForTimesheet(logWorkFilterOptionsDto.projects);
    const checkMember = this.validDataForTimesheet(logWorkFilterOptionsDto.members);

    if (!checkProject && !checkMember) {

      dataShow = await this.logWorkService.getLogWorkByUserId(user.id, logWorkFilterOptionsDto);
    }
    else {
      dataShow = await this.logWorkService.getLogWorksMember(checkMember, checkProject, logWorkFilterOptionsDto);
    }
    return dataShow;
  }


  validDataForTimesheet(input) {
    if (!input) {
      return null;
    }
    const cleanedIds = input
      .split(',') // Tách chuỗi thành mảng: [" 101", "205", "300 "]
      .map(id => id.trim()) // Loại bỏ khoảng trắng ở đầu/cuối mỗi ID: ["101", "205", "300"]
      .filter(id => id !== ''); // Loại bỏ các ID rỗng nếu có (ví dụ: "101,,205")

    return cleanedIds.length > 0 ? cleanedIds : null;
  }

  async getDetailLogWork(logWorkId: number): Promise<LogWorkDto> {
    return await this.logWorkService.getDetailLogWork(logWorkId);
  }

  async updateLogWork(
    logWorkId: number,
    updateLogWorkDto: RequestLogWorkDto,
    user: UserEntity,
  ): Promise<SuccessResponseDto> {
    const logWork = await this.getDetailLogWork(logWorkId);
    const resrources = await this.resourceService.getResourceByUserPRojectId(logWork.userProjectId);
    const dates = resrources.map((res) => res.date.getTime());
    const maxDate = new Date(Math.max(...dates));
    if (
      (isEmpty(resrources) && user.role !== UserNS.Roles.ADMIN) ||
      (maxDate <= new Date() && (user.role === UserNS.Roles.MEMBER || user.role === UserNS.Roles.LOS))
    ) {
      throw new ForbiddenException();
    }
    await this.logWorkService.updateLogWork(logWorkId, updateLogWorkDto);
    return new SuccessResponseDto(true);
  }

  async destroyLogWork(logWorkId: number, user: UserEntity): Promise<SuccessResponseDto> {
    const logWork = await this.getDetailLogWork(logWorkId);
    const resrources = await this.resourceService.getResourceByUserPRojectId(logWork.userProjectId);
    const dates = resrources.map((res) => res.date.getTime());
    const maxDate = new Date(Math.max(...dates));
    if (
      (isEmpty(resrources) && user.role !== UserNS.Roles.ADMIN) ||
      (maxDate <= new Date() && (user.role === UserNS.Roles.MEMBER || user.role === UserNS.Roles.LOS))
    ) {
      throw new ForbiddenException();
    }
    await this.logWorkService.destroyLogWork(logWorkId);
    return new SuccessResponseDto(true);
  }

  async getInformationProject(
    id: number,
    userId?: string,
    role?: UserNS.Roles,
  ): Promise<InformationProjectResponseDto> {
    const project = await this.projectRepository.getProject({ projectId: id });
    if (isNil(project)) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
    const totalResourceProject = await this.resourceSummaryService.getToTalResourceProject(id);
    const total = await this.resourceService.getResourceInProject(id);
    const allocate = parseFloat(total[0].acPercentTotal);
    const totalResourceProjects: TotalResourceProjectDto = {
      committedTotal: totalResourceProject.committedTotal,
      allocatedTotal: parseFloat((allocate / MAN_MONTH_PERCENT).toFixed(2)),
      temporaryAddedTotal: totalResourceProject.temporaryAddedTotal,
      actualTotal: totalResourceProject.actualTotal,
    };
    // TODO: role admin
    if (role === UserNS.Roles.ADMIN || role === UserNS.Roles.LOS) {
      return new InformationProjectResponseDto(project, totalResourceProjects);
    }
    // TODO: check user existed in project
    await this.checkMemberInProject(id, userId);
    return new InformationProjectResponseDto(project, totalResourceProjects);
  }

  async getPmProject(id: number): Promise<ProjectDto | undefined> {
    let infoPmProject: ProjectDto | undefined;
    const userEntity: UserEntity[] = [];
    const userByProjectId = await this.userProjectService.getUserProjectByProjectId(id);
    for (const u of userByProjectId) {
      const isResourcePm = await this.resourceService.checkResourcePositionPm(u.id);
      if (isResourcePm) {
        const projectResult = await this.detailProject(u.projectId);
        const userResult = await this.userService.getUserById(u.userId);
        userEntity.push(userResult);
        if (!isEmpty(projectResult)) {
          infoPmProject = new ProjectDto(projectResult, undefined, userEntity);
        }
      }
    }
    return infoPmProject;
  }

  async isProjectManager(id: number, userId: string): Promise<boolean> {
    const projectPMs = await this.getPmProject(id);
    if (!isNil(projectPMs) && !isNil(projectPMs.user) && !isEmpty(projectPMs.user)) {
      const pmIds = await Promise.all(projectPMs.user.map((p) => p.id));
      return pmIds.includes(userId);
    }
    return false;
  }

  async getAllResourceSummaries(projectId: number): Promise<ResourceSummaryMonth[]> {
    const rsObj: Record<string, ResourceSummaryMonth> = {};
    const result: ResourceSummaryMonth[] = [];
    const resourceSummaries = await this.resourceSummaryService.getAllMonth(projectId);
    for (const resourceSummary of resourceSummaries) {
      const { month, year } = resourceSummary;
      const key = `${year}-${month}`;
      rsObj[key] = resourceSummary;
    }


    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
    const { startDate, endDate } = project;
    const [startYear, startMonth] = moment(startDate, 'YYYY/MM/DD').format('YYYY-MM-DD').split('-').map(Number);
    const [endYear, endMonth] = moment(endDate, 'YYYY/MM/DD').format('YYYY-MM-DD').split('-').map(Number);
    const diffMonth = (endYear - startYear) * 12 + (endMonth - startMonth);
    for (let i = 0; i <= diffMonth; i++) {
      const diffYear = Math.ceil((startMonth + i) / 12 - 1);
      const month = startMonth + i - 12 * diffYear;
      const year = startYear + diffYear;
      const key = `${year}-${month}`;
      if (!rsObj[key]) {
        rsObj[key] = {
          month,
          year,
          committedTotal: 0,
          allocatedTotal: 0,
          temporaryAddedTotal: 0,
        } as ResourceSummaryMonth;
      }
      result.push(rsObj[key]);
    }


    return result;
  }

  async getProjectForPm(email: string): Promise<ProjectDto[]> {
    return await this.projectRepository.getProjectForPm(email);
  }
  async getProjectbyId(id: number): Promise<ProjectDto> {
    const project = await this.projectRepository.findById(id);
    if (isNil(project)) {
      return {} as ProjectDto;
    }
    return project.toDto();
  }
  async getProjectOfUser(id: string): Promise<ProjectDto[]> {
    return await this.projectRepository.getProjectOfUser(id);
  }

  async getInfoAllProject(projectFilterOptionsDto: ProjectFilterOptionsDto, user: UserEntity): Promise<ProjectDto[]> {
    if ((user.role === UserNS.Roles.MEMBER || user.role === UserNS.Roles.LOS) && projectFilterOptionsDto.email) {
      return await this.getProjectForPm(projectFilterOptionsDto.email);
    }
    return await this.projectRepository.getInfoAllProject(projectFilterOptionsDto);
  }

  async deleteMemberProject(projectId: number, userId: string, userEntity: UserEntity): Promise<SuccessResponseDto> {
    if (userEntity.role !== UserNS.Roles.ADMIN) {
      const userByProjectId = await this.userProjectService.findUserProject({
        userId: userEntity.id,
        projectId,
      });
      if (!isNil(userByProjectId)) {
        const isResourcePm = await this.resourceService.checkResourcePositionPm(userByProjectId.id);
        if (!isResourcePm) {
          throw new ForbiddenException();
        }
      } else {
        throw new ForbiddenException();
      }
    }
    const t: Transaction = await this.sequelize.transaction();
    const userProjectId = await this.userProjectService.getUserProjectByProjectIdAndUserId(userId, projectId);

    if (isNil(userProjectId[0])) {
      await t.rollback();
      throw UserProjectNS.errMsg.UserProjectNotFound;
    }
    const user = await this.userService.getUserById(userId).catch();
    const project = await this.projectRepository.findById(projectId);
    if (!isNil(project) && user.username && project.pm?.includes(user.username)) {
      let projectPm = !isNil(project.pm) && !isEmpty(project.pm) ? JSON.parse(project.pm) : [];
      projectPm = projectPm.filter((pm: string) => pm !== user.username);
      projectPm = JSON.stringify(projectPm);

      await this.updateProjectPm(projectId, projectPm).catch(() => t.rollback());
    }
    const deleteUserProject = this.userProjectService.deleteUserProjectById(userProjectId[0], t);
    const deleteAllResourceMember = this.resourceService.deleteAllResourceMember(userProjectId[0], t);
    const deleteLogWorks = this.logWorkService.deleteLogWorksUser(userProjectId[0], t);

    await Promise.all([deleteUserProject, deleteAllResourceMember, deleteLogWorks]).catch(() => t.rollback());
    await t.commit();

    return new SuccessResponseDto(true);
  }

  async getMemberInProject(user: UserEntity, projectId?: number): Promise<UserProjectDto[] | ProjectDto[]> {
    if (projectId) {
      return await this.userProjectService.getMemberByProjectId(projectId);
    }
    return await this.getProjectOfUser(user.id);
  }

  async updateCustomerIdInProjectRecords(customerId: number, t?: Transaction): Promise<SuccessResponseDto> {
    return await this.projectRepository.updateCustomerIdInProjectRecords(customerId, t);
  }

  async getProjectsOfCustomer(customerId: number): Promise<ProjectDto[]> {
    return await this.projectRepository.getProjectsOfCustomer(customerId);
  }
  async deleteCustomer(id: number): Promise<SuccessResponseDto> {
    return await this.projectRepository.deleteCustomer(id);
  }
  async getProjectByDepartment(id: number): Promise<ProjectDto[]> {
    return await this.projectRepository.getProjectByDepartment(id);
  }

  async getProjectSalaries(projectId: string, resourceProjectFilterDto: ResourceProjectFilterDto, user: UserEntity): Promise<object> {
    let result: {
      [id: string]: {
        [month: string]: {
          ac: number,
          month: string,
          year: string
        }
      }
    } = {};
    let departmentId: number = 0;
    const userIds: string[] = [];
    resourceProjectFilterDto.projectIds = projectId;
    const projectResources = await this.resourceService.getListProjectResource(resourceProjectFilterDto, user);
    if (!isNil(projectResources)) {
      projectResources.forEach((project: any) => {
        departmentId = project?.departmentId;
        project?.allocates?.forEach((item: any) => {
          item?.positions?.forEach((position: any) => {
            position?.resources?.forEach(async (node: any) => {
              const thisMonth = moment(node.startDate).format('YYYY/MM');
              const tMonth = moment(node.startDate).format('MM');
              const tYear = moment(node.startDate).format('YYYY');
              userIds.push(item.id);
              if (!result.hasOwnProperty(item.id)) {
                result[item.id] = {
                  [thisMonth]: {
                    ac: node.ac,
                    month: tMonth,
                    year: tYear
                  }
                };
              }
              else if (!result?.[item.id].hasOwnProperty(thisMonth)) {
                result[item.id][thisMonth] = {
                  ac: node.ac,
                  month: tMonth,
                  year: tYear
                };
              }
              else {
                result[item.id][thisMonth].ac += node.ac ?? 0;
              }
            });
          });
        });
      });
    }
    const salaries: {
      [userMonth: string]: number;
    } = {};

    const userSalaries = await this.userSalaryRepository.getSalaryByUser({ userIds: userIds, departmentId: String(departmentId), startDate: resourceProjectFilterDto.startDate, endDate: resourceProjectFilterDto.endDate });
    if (!isNil(userSalaries) && isObject(userSalaries)) {
      userSalaries.forEach((userSalary: any) => {
        const thisUserMonth = userSalary.userId + userSalary.year + userSalary.month;
        salaries[thisUserMonth] = userSalary.companyWillPayMoney;
      });
    }
    const projectSalaries: {
      [month: string]: number;
    } = {};
    if (!isNil(result) && typeof result === 'object') {
      for (const userId in result) {
        for (const month in result[userId]) {
          const thisUserMonth = userId + result[userId][month].year + parseInt(result[userId][month].month);
          let thisSalary = 0;
          if (!isNil(salaries[thisUserMonth])) {
            thisSalary = salaries[thisUserMonth];
          }
          if (!projectSalaries.hasOwnProperty(month)) {
            projectSalaries[month] = thisSalary * result[userId][month].ac / 100;
          } else {
            projectSalaries[month] += thisSalary * result[userId][month].ac / 100;
          }
        }
      }
    }
    return projectSalaries;
  }
  async getProjectSalariesNew(projectId: string, projectFilterOptionsDto: ProjectFilterOptionsDto): Promise<object> {
    const salaries: object = {};
    const startDate = projectFilterOptionsDto.startDate;
    const endDate = projectFilterOptionsDto.endDate;
    if (!isNil(startDate) && !isNil(endDate) && !isNil(projectId)) {
      const dataResources = await this.resourceRepository.getDataResourceInProjectByMonth(startDate, endDate, parseInt(projectId));
      const dataDaysOff = await this.daysOffService.getDaysOffBetween(startDate, endDate);
      const listDaysOff: string[] = [];
      if (!isNil(dataDaysOff)) {
        dataDaysOff.forEach((dayOff) => {
          listDaysOff.push(moment(dayOff.date).format('YYYY/MM/DD'));
        });
      }
      const availableDates = this.getListAvailableWeek(startDate, endDate, listDaysOff);
      if (dataResources && isArray(dataResources)) {
        dataResources.forEach((resource) => {
          let ac = resource.acPercent;
          let thisMonth = resource.month;
          if (thisMonth < 10) {
            thisMonth = '0' + thisMonth;
          }
          const thisYear = resource.year;
          const keyMonth = thisYear + '/' + thisMonth;
          const totalAvailable = availableDates['totalAvailable'][keyMonth];
          if (ac > 100) {
            ac = 100;
          }
          let userSalary = resource.userProject.users.userSalaries.salary;
          if (isNil(userSalary)) {
            userSalary = 0;
          }
          if (!isNil(salaries[keyMonth])) {
            salaries[keyMonth] += ac * userSalary / totalAvailable / 100;
          } else {
            salaries[keyMonth] = ac * userSalary / totalAvailable / 100;
          }
        });
      }
    }
    return salaries;
  }
  getListAvailableWeek(
    fromDate: Date,
    finishDate: Date,
    listDaysOff: string[]
  ): {
    weekend: {};
    availableDate: {};
    totalAvailable: {};
  } {
    let filterRange = {
      weekend: {},
      availableDate: {},
      totalAvailable: {}
    };
    const startDate = moment(new Date(fromDate));
    const endDate = moment(new Date(finishDate));
    const trackingDate = startDate;
    const listWeekend: Date[] = [];
    const listAvailableDate: Date[] = [];
    const listTotalAvailable: object = {};
    while (trackingDate.isSameOrBefore(endDate)) {
      // cuối tuần
      let flagDayOff = 0;
      listDaysOff.forEach((dayOff) => {
        if (moment(trackingDate).format('YYYY/MM/DD') === dayOff) {
          flagDayOff = 1;
        }
      });
      // không tính ngày nghỉ
      if (flagDayOff === 0) {
        if (trackingDate.isoWeekday() == 6 || trackingDate.isoWeekday() == 7) {
          listWeekend[moment(trackingDate).format('YYYY/MM/DD')] = moment(trackingDate).format('YYYY/MM/DD');
        } else {
          // danh sách ngày làm việc trong tháng
          listAvailableDate[moment(trackingDate).format('YYYY/MM/DD')] = moment(trackingDate).format('YYYY/MM/DD');
          // tổng ngày làm việc trong tháng
          if (!isNil(listTotalAvailable[moment(trackingDate).format('YYYY/MM')])) {
            listTotalAvailable[moment(trackingDate).format('YYYY/MM')] += 1;
          } else {
            listTotalAvailable[moment(trackingDate).format('YYYY/MM')] = 1;
          }
        }
      }
      trackingDate.add(1, 'day');
    }
    filterRange = {
      weekend: listWeekend,
      availableDate: listAvailableDate,
      totalAvailable: listTotalAvailable,
    };
    return filterRange;
  }
}
