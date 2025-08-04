import { CACHE_MANAGER, ForbiddenException, Inject } from '@nestjs/common';
import { UserProjectNS } from '../user-projects/interfaces/user-project';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateResourceDto } from './dto/requests/create-resource-dto';
import { ResourceNS } from './interfaces/resource';
import _, { compact, isEmpty, isNil, sumBy } from 'lodash';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ConfirmOverResourceDto } from './dto/requests/confirm-resource-dto';
import { TokenOverResourceDto } from './dto/responses/token-over-resource-dto';
import { UserDto } from '../users/dto/response/user-dto';
import { UserProjectDto } from '../../modules/user-projects/dto/responses/user-project-dto';
import { UserNS } from '../users/interface/users';
import { FilterUserAllowcationDto } from './dto/requests/filter-user-allocation-dto';
import { UserResourceAllocateDto } from './dto/responses/user-resource-allocate-dto';
import { ProjectAllocateDto } from './dto/responses/project-allocate-dto';
import { ProjectNS } from '../projects/interfaces/project';
import { default as ResourceEntity } from '../../entities/resource.entity';
import { ResourceAllocateDto } from './dto/responses/resource-allocate-dto';
import { AllocateGroupType } from '../../common/constants/allocate-group-type';
import moment from 'moment';
import { ResourceProjectFilterDto } from './dto/requests/resource-project-filter.dto';
import { RequestResourceDto } from './dto/requests/request-resource-update-dto';
import { CreateUserProjectDto } from '../../modules/user-projects/dto/requests/create-user-project-dto';
import { UserPostionResDto } from './dto/responses/user-position-res-dto';
import { ProjectPositionResourceAllocateDto } from './dto/responses/project-position-res-allocate-dto';
import { PositionResourcesAllocateDto } from './dto/responses/position-resources-allocate-dto';
import { IResourceSummaryService } from '../resource-summaries/interfaces/resource-summary.service.interface';
import { Util } from '../../common/util';
import { PositionNS } from '../../modules/positions/interfaces/position';
import { UpdateResourceSummaryType } from '../../modules/resource-summaries/dtos/enum';
import { AcTcMdPercentTotalDto } from './dto/responses/ac-tc-md-total-dto';
import { FilterUserSummaryDto } from './dto/requests/filter-user-summary-dto';
import { UserResourceSummaryDto } from './dto/responses/user-resource-summary-dto';
import { UserResourceSummaryResponseDto } from '../../common/dto/user-resource-summary-response.dto';
import { TotalUserSummaryDto } from '../../common/dto/total-user-summary.dto';
import { Comparison } from '../../common/constants/comparison-type';
import { FilterResourceTeamDto } from './dto/requests/filter-resource-team.dto';
import { AzureService } from '../../shared/services/azure.service';
import { MAN_MONTH_PERCENT, MAX } from '../../common/constants/unit';
import { ConstantsResouces } from '../../common/constants/resources-constants';
import { default as UserEntity } from '../../entities/users.entity';
import { Detail } from './dto/responses/detail-dto';
import { ProjectResourceAllocateDto } from './dto/responses/project-resource-allocate-dto';
import { PostTeamProjectdto } from './dto/requests/post-team-project-dto';
import { LogWorkNS } from '../../modules/log-works/interfaces/logwork-interface';
import { PopUpDto } from './dto/responses/popup-dto';
import { ParamPopupDto } from './dto/requests/param-popup-dto';
import { TooltipUpDto } from './dto/responses/tooltip-dto';
import { DeleteResourceDto } from './dto/requests/delete-resource-dto';
import { Transaction } from 'sequelize';
import { DetailMemberRs } from './dto/responses/detail-member-rs-dto';
import { ITeamsService } from '../../modules/teams/interfaces/teams.service.interface';
import { TeamLogsDto } from '../../modules/teams/dto/team-logs.dto';
import { ResourceDto } from './dto/responses/resource-dto';
import { default as TeamLogsEntity } from '../../entities/team-logs.entity';
import { MasterDataDto } from '../../modules/master-data/dtos/master-data.dto';
import { ParamUpdateDayOffDto } from './dto/requests/param-daysoff-dto';
import { default as DaysOffEntity } from '../../entities/days-off.entity';
import { ParamPositionIdsDto } from './dto/requests/param-position-ids.dto';
import { ResourcePositionDto } from './dto/responses/resource-position-dto';
import { MasterDataNS } from '../../modules/master-data/master-data';

export class ResourcesService implements ResourceNS.IResourceService {
  constructor(
    @Inject('IResourceRepository')
    private readonly resourceRepository: ResourceNS.IResourceRepository,
    @Inject('IUserProjectService')
    private readonly userProjectService: UserProjectNS.IUserProjectServices,

    @Inject('ILogWorkService')
    private readonly logWorkService: LogWorkNS.ILogWorkService,

    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,

    @Inject('IProjectService')
    private readonly projectService: ProjectNS.IProjectService,

    @Inject('IPositionService')
    private readonly positionService: PositionNS.IPositionService,

    private jwtService: JwtService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private configService: ApiConfigService,

    @Inject('IResourceSummaryService')
    private readonly resourceSummaryService: IResourceSummaryService,

    @Inject('ITeamsService')
    private readonly teamsService: ITeamsService,

    @Inject('IMasterDataService')
    private readonly masterDataService: MasterDataNS.IMasterDataService,

    private azureService: AzureService,
  ) {}

  async createResource(
    createResourceDto: CreateResourceDto,
    user: UserEntity,
  ): Promise<SuccessResponseDto | TokenOverResourceDto> {
    if (user.role !== UserNS.Roles.ADMIN) {
      const userByProjectId = await this.userProjectService.findUserProject({
        userId: user.id,
        projectId: createResourceDto.resources[0].projectId,
      });
      if (!isNil(userByProjectId)) {
        const isResourcePm = await this.checkResourcePositionPm(userByProjectId.id);
        if (!isResourcePm) {
          throw new ForbiddenException();
        }
      } else {
        throw new ForbiddenException();
      }
    }

    // check validate duplicate
    this.checkValidateInput({ ...createResourceDto });
    // check duplicate database`
    const checkDuplicate = await this.userProjectService.checkDuplicate(createResourceDto);
    if (!isEmpty(checkDuplicate)) {
      const listUsers = await Promise.all(
        checkDuplicate.map(async (e) => {
          const user = await this.userService.getUserById(e);
          return {
            userId: e,
            userName: user.displayName,
          };
        }),
      );

      throw UserProjectNS.errMsg.UserResourceExists(listUsers);
    }

    // check over resource
    const checkOverResource = await this.resourceRepository.checkOverResource(createResourceDto);

    if (!isEmpty(checkOverResource)) {
      // TODO: generate token save cache
      const { jwtSecret, jwtExpirationTime } = this.configService.authConfig;
      const verifyToken = await this.jwtService.signAsync(
        {
          createResourceDto,
        },
        {
          secret: jwtSecret,
          expiresIn: jwtExpirationTime,
        },
      );
      await this.cacheManager.set('userResourceToken', verifyToken, {
        ttl: this.configService.cacheModuleConfig.ttl,
      });

      await Promise.all(
        checkOverResource.map(async (e) => {
          if (!isNil(e.userId)) {
            const user = await this.userService.getUserById(e.userId);
            Object.assign(e, {
              userName: user.displayName,
            });
          }
        }),
      );

      return {
        verifyToken,
        data: checkOverResource,
      };
    }

    // add resource
    await this.addResource(createResourceDto);
    return new SuccessResponseDto(true);
  }
  async confirmOverResource(confirmOverResource: ConfirmOverResourceDto): Promise<SuccessResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getData = this.jwtService.decode(confirmOverResource.verifyToken) as any;
    if (getData.createResourceDto) {
      // check duplicate
      const checkDuplicate = await this.userProjectService.checkDuplicate(getData.createResourceDto);
      if (!isEmpty(checkDuplicate)) {
        throw UserProjectNS.errMsg.UserResourceExists(checkDuplicate.filter((v, i, a) => a.indexOf(v) === i));
      }

      await this.addResource(getData.createResourceDto);
    } else if (getData.updateResourceDto) {
      if (confirmOverResource.edit === 'week') {
        await this.curdResource(getData.userId, getData.projectId, getData.updateResourceDto, confirmOverResource.edit);
      } else {
        await this.curdResource(getData.userId, getData.projectId, getData.updateResourceDto);
      }
    }
    return new SuccessResponseDto(true);
  }

  // function add generate resource
  async addResource(createResourceDto: CreateResourceDto): Promise<SuccessResponseDto> {
    for (const createResource of createResourceDto.resources) {
      const { projectId, userId, positionId, startDate, endDate } = createResource;
      const userProject = await this.userProjectService.findUserProject({
        projectId,
        userId,
      });
      let userProjectId = +0;
      if (!isNil(userProject)) {
        userProjectId = userProject.id;
      } else {
        const createUserProject = await this.userProjectService.createUserProject({
          projectId: +createResource.projectId,
          userId: createResource.userId,
        });
        userProjectId = createUserProject.id;
      }
      await this.resourceRepository.addResource(userProjectId, createResource);
      const pmPosition = await this.positionService.getPositionByCode(PositionNS.Code.ProjectManager);
      if (positionId === pmPosition.id) {
        const project = await this.projectService.detailProject(createResource.projectId);
        const user = await this.userService.getUserById(createResource.userId);
        if (!isNil(project.pm) && !isEmpty(project.pm)) {
          const pms = JSON.parse(project.pm);
          if (user.username && !pms.includes(user.username)) {
            pms.push(user.username);
            await this.projectService.updateProjectPm(createResource.projectId, JSON.stringify(pms));
          }
        } else {
          await this.projectService.updateProjectPm(createResource.projectId, JSON.stringify([user.username]));
        }
      }

      await this.updateResourceSummaryWhenAddResource(userProjectId, projectId, positionId, startDate, endDate);
    }
    return new SuccessResponseDto(true);
  }

  async updateResourceSummaryWhenAddResource(
    userProjectId: number,
    projectId: number,
    positionId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    try {
      const monthArr = Util.getAllMonthAndYearFromStartDateAndEndDate(startDate, endDate);
      await Promise.all(
        monthArr.map(async (monthObj) => {
          const totalAcAndTcInMonth = await this.resourceRepository.getAcAndTcPercentTotal(
            userProjectId,
            positionId,
            monthObj.startMonthDate,
            monthObj.endMonthDate,
          );
          const year = monthObj.startMonthDate.getFullYear();
          const month = monthObj.startMonthDate.getMonth() + 1;
          await this.resourceSummaryService.updateResourceSummaryWhenAddResource(
            projectId,
            month,
            year,
            totalAcAndTcInMonth,
            UpdateResourceSummaryType.ADD,
          );
        }),
      );
    } catch (error) {
      throw ResourceNS.errMsg.UpdateResourceSummary;
    }
  }

  async updateResource(
    userId: string,
    projectId: number,
    updateResourceDto: RequestResourceDto[],
    user: UserEntity,
    edit?: string,
  ): Promise<SuccessResponseDto | TokenOverResourceDto> {
    if (user.role !== UserNS.Roles.ADMIN) {
      const userByProjectId = await this.userProjectService.findUserProject({
        userId: user.id,
        projectId,
      });
      if (!isNil(userByProjectId)) {
        const isResourcePm = await this.checkResourcePositionPm(userByProjectId.id);
        if (!isResourcePm) {
          throw new ForbiddenException();
        }
      } else {
        throw new ForbiddenException();
      }
    }

    try {
      // check over resource
      const checkOverResource = await this.resourceRepository.checkResourceOnlyUser(
        userId,
        projectId,
        updateResourceDto,
      );

      if (!isEmpty(checkOverResource)) {
        // TODO: generate token save cache
        const verifyToken = await this.jwtService.signAsync(
          {
            userId,
            projectId,
            updateResourceDto,
          },
          {
            secret: this.configService.authConfig.jwtSecret,
            expiresIn: this.configService.authConfig.jwtExpirationTime,
          },
        );
        await this.cacheManager.set('userResourceToken', verifyToken, {
          ttl: this.configService.cacheModuleConfig.ttl,
        });
        const user = await this.userService.getUserById(userId);

        checkOverResource.forEach((e) => {
          Object.assign(e, {
            userName: user.displayName,
          });
        });

        return {
          verifyToken,
          data: checkOverResource,
        };
      }


      if (edit === 'week') {
        await this.curdResource(userId, projectId, updateResourceDto, edit);
      } else {
        await this.curdResource(userId, projectId, updateResourceDto);
      }
      return new SuccessResponseDto(true);
    } catch (error) {
      throw ProjectNS.errMsg.ProjectNotFound;
    }
  }

  async deleteResource(dto: DeleteResourceDto, user: UserEntity, projectId: number): Promise<SuccessResponseDto> {
    if (user.role !== UserNS.Roles.ADMIN) {
      const userByProjectId = await this.userProjectService.findUserProject({
        userId: user.id,
        projectId,
      });
      if (!isNil(userByProjectId)) {
        const isResourcePm = await this.checkResourcePositionPm(userByProjectId.id);
        if (!isResourcePm) {
          throw new ForbiddenException();
        }
      } else {
        throw new ForbiddenException();
      }
    }

    // delete pm in project new delete resources have position pm
    for (const dt of dto.resources) {
      const userProject = await this.userProjectService.findById(dt.userProjectId);
      const project = await this.projectService.getProjectbyId(projectId);
      const pmPosition = await this.positionService.getPositionByCode(PositionNS.Code.ProjectManager);
      if (
        !isEmpty(project) &&
        !isNil(userProject) &&
        userProject?.users?.username &&
        project.pm?.includes(userProject?.users?.username) &&
        dt.positionId === pmPosition.id
      ) {
        let projectPm = !isNil(project.pm) && !isEmpty(project.pm) ? JSON.parse(project.pm) : [];
        projectPm = projectPm.filter((pm: string) => pm !== userProject?.users?.username);
        projectPm = JSON.stringify(projectPm);

        await this.projectService.updateProjectPm(projectId, projectPm);
      }
    }

    await this.resourceRepository.deleteResource(dto);
    return new SuccessResponseDto(true);
  }

  async subtractResourceSummaryBeforeUpdate(
    userProjectId: number,
    currentPositionId: number,
    projectId: number,
  ): Promise<void> {
    try {
      const startDateAndEndDate = await this.resourceRepository.getStartDateAndEndDateOfPositionUserInProject(
        currentPositionId,
        userProjectId,
      );
      const { startDate, endDate } = startDateAndEndDate;
      if (!startDate || !endDate) {
        return;
      }
      const monthArr = Util.getAllMonthAndYearFromStartDateAndEndDate(startDate, endDate);
      await Promise.all(
        monthArr.map(async (monthObj) => {
          const { startMonthDate, endMonthDate } = monthObj;
          const year = +moment(startMonthDate).format('YYYY');
          const month = +moment(startMonthDate).format('MM');
          const acAndTcTotal = await this.resourceRepository.getAcAndTcPercentTotal(
            userProjectId,
            currentPositionId,
            startMonthDate,
            endMonthDate,
          );
          await this.resourceSummaryService.updateResourceSummaryWhenAddResource(
            projectId,
            month,
            year,
            acAndTcTotal,
            UpdateResourceSummaryType.SUBTRACT,
          );
        }),
      );
    } catch (error) {
      throw ResourceNS.errMsg.UpdateResourceSummary;
    }
  }

  async curdResource(
    userId: string,
    projectId: number,
    updateResourceDto: RequestResourceDto[],
    edit?: string,
  ): Promise<void> {
    try {
      const userProject =
        (await this.userProjectService.findUserProject({
          projectId,
          userId,
        })) ??
        (await this.userProjectService.createUserProject({
          projectId,
          userId,
        }));
      const userProjectId = userProject.id;
      for (const updateResource of updateResourceDto) {
        await this.subtractResourceSummaryBeforeUpdate(userProjectId, updateResource.currentPositionId, projectId);
      }
      for (const updateResource of updateResourceDto) {
        const { newPositionId } = updateResource;
        const pmPosition = await this.positionService.getPositionByCode(PositionNS.Code.ProjectManager);
        const rs = await this.resourceRepository.getResourceByUserProjectId(userProjectId);
        if (!isEmpty(rs) && rs[0].positionId === pmPosition.id && pmPosition.id !== newPositionId && edit !== 'week') {
          const project = await this.projectService.detailProject(projectId);
          const user = await this.userService.getUserById(userId);
          if (!isNil(project.pm) && !isEmpty(project.pm)) {
            const pms = JSON.parse(project.pm);
            const ps = pms.filter((pm) => pm !== user.username);
            await this.projectService.updateProjectPm(projectId, JSON.stringify(ps));
          }
        }
      }
      if (edit === 'week') {
        await this.resourceRepository.updateResourceUser(userId, projectId, updateResourceDto, userProjectId, edit);
      } else {
        await this.resourceRepository.updateResourceUser(userId, projectId, updateResourceDto, userProjectId);
      }
      for (const updateResource of updateResourceDto) {
        const { newPositionId, startDate, endDate } = updateResource;
        const pmPosition = await this.positionService.getPositionByCode(PositionNS.Code.ProjectManager);
        if (newPositionId === pmPosition.id) {
          const project = await this.projectService.detailProject(projectId);
          const user = await this.userService.getUserById(userId);
          if (!isNil(project.pm) && !isEmpty(project.pm)) {
            const pms = JSON.parse(project.pm);
            if (user.username && !pms.includes(user.username)) {
              pms.push(user.username);
              await this.projectService.updateProjectPm(projectId, JSON.stringify(pms));
            }
          } else {
            await this.projectService.updateProjectPm(projectId, JSON.stringify([user.username]));
          }
        }
        await this.updateResourceSummaryWhenAddResource(userProjectId, projectId, newPositionId, startDate, endDate);
      }
    } catch (error) {
      throw ResourceNS.errMsg.UpdateResourceSummary;
    }
  }
  async deleteResourceByDate(projectId: number, endDate?: Date, startDate?: Date): Promise<void> {
    await this.resourceRepository.deleteResourceByDate(projectId, endDate, startDate);
  }

  async detailResourceUserProject(params: CreateUserProjectDto, userEntity: UserEntity): Promise<UserProjectDto> {
    if (userEntity.role === UserNS.Roles.MEMBER || userEntity.role === UserNS.Roles.LOS) {
      const project = await this.projectService.getProjectbyId(params.projectId);
      const pms = !isNil(project.pm) && !isEmpty(project.pm) ? JSON.parse(project.pm) : [];
      if (!pms.includes(userEntity.username)) {
        throw new ForbiddenException();
      }
    }
    const { userId } = params;
    const userProject = await this.userProjectService.detailResourceUserProject(params);
    const user = await this.userService.getUser(userId, UserNS.UserStore.MASTERDATA);
    const userDetail: UserDto = {
      id: user.id,
      employeeId: user.employeeId,
      mail: user.mail,
      displayName: user.displayName,
      username: user.username,
      givenName: user.givenName,
      surName: user.surName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const userProjectDto = userProject.toDto();
    userProjectDto.users = userDetail;
    return userProjectDto;
  }

  async getUserResource(filterOptions: FilterUserAllowcationDto, user: UserEntity): Promise<any> {
    if (!user.role) {
      user.role = UserNS.Roles.MEMBER;
    }
    let isPm = false;
    let isHaveValue = false;
    const userIdParams = filterOptions.userIds;
    let pm: UserEntity[] = [];
    const filterOptionPms = new FilterUserAllowcationDto();
    filterOptions.role = user.role;
    //filterOptionPms.allocateGroupType = AllocateGroupType.Day;
    const userIds: string[] = [];
    if (user.role === UserNS.Roles.MEMBER) {
      const pmProjects = await this.projectService.getProjectForPm(user.mail);
      const projectOfUser = await this.projectService.getProjectOfUser(user.id);
      if (pmProjects && pmProjects.length > 0) {
        isPm = true;
        filterOptionPms.startDate = filterOptions.startDate;
        filterOptionPms.endDate = filterOptions.endDate;
        filterOptions.projectIds = pmProjects.map((project) => project.id);
        filterOptionPms.userId = user.id;
        filterOptionPms.projectIds = projectOfUser.map((project) => project.id);
        pm = await this.userService.getAllProjectOfUser(filterOptionPms, undefined, 'view');
      } else {
        filterOptions.userId = user.id;
      }
    }
    const { startDate, endDate, allocateGroupType } = filterOptions;
    let rangeDates: any[] = [];
    if (allocateGroupType === AllocateGroupType.Week) {
      rangeDates = Util.getRangeDateByWeek(startDate, endDate);
    }
    if (allocateGroupType === AllocateGroupType.Month) {
      rangeDates = Util.getRangeDateByMonth(startDate, endDate);
    }
    const result: any = {};
    result.countUser = await this.userService.countUser(user.role, filterOptions);
    // get UserID by  position ID Here
    if ((filterOptions.positionIds && !isEmpty(filterOptions.positionIds))
      || (filterOptions.projectIds && !isEmpty(filterOptions.projectIds))
      || (filterOptions.divisionIds && !isEmpty(filterOptions.divisionIds))
    ) {
      const listUserIdFilter = await this.resourceRepository.getListUserIdFilterOptions(
        filterOptions.startDate,
        filterOptions.endDate,
        filterOptions.positionIds ? filterOptions.positionIds : [],
        filterOptions.projectIds,
        filterOptions.divisionIds,
      );
      // merge 2 array userId
      if (!filterOptions.userIds || isEmpty(filterOptions.userIds)) {
        filterOptions.userIds = listUserIdFilter;
      } else {
        filterOptions.userIds = filterOptions.userIds.filter((element) =>
        listUserIdFilter.includes(element),
        );
      }

      if(filterOptions.positionIds && !isEmpty(filterOptions.positionIds))  {
        if (!isEmpty(pm) && pm && isPm) {
          let listPmPositionIds = pm.map((e) => e.userProject?.resource?.positionId ?? 0);

          listPmPositionIds = listPmPositionIds.filter((e) => e !== 0);
          isHaveValue = filterOptions.positionIds.some((r) => listPmPositionIds.includes(r));

          if ((isHaveValue && userIdParams?.includes(pm[0].id)) || (isHaveValue && isNil(userIdParams))) {
            filterOptions.userIds.push(pm[0].id);
          }
        }
        if (!isPm && user.role === UserNS.Roles.MEMBER) {
          const resourceUser = await this.userService.getAllProjectOfUser(filterOptions, undefined, 'view');
          let listPositionIds = resourceUser.map((e) => e.userProject?.resource?.positionId ?? 0);
          listPositionIds = listPositionIds.filter((e) => e !== 0);
          isHaveValue = filterOptions.positionIds.some((r) => listPositionIds.includes(r));
          if (!isHaveValue) {
            return {};
          }
        }
      }
    }

    let users = await this.userService.getAllProjectOfUser(filterOptions);
    if (isPm) {
      users = users.filter((u) => u.id !== user.id);
    }
    if (isNil(filterOptions.userIds) || filterOptions.userIds?.includes(pm[0]?.id ?? 0)) {
      users = users.concat(pm);
    }
    for (const user of users) {
      if (user.status !== UserNS.Status.ACTIVE && isNil(user.userProject?.resource?.id)) {
        continue;
      }
      userIds.push(user.id);
      const projectId = user.userProject?.projectId;
      const date = user.userProject?.resource?.date;
      const positionId = user.userProject?.resource?.positionId;
      const acPercent = user.userProject?.resource?.acPercent ?? 0;
      const tcPercent = user.userProject?.resource?.tcPercent ?? 0;
      if (!result[user.id]) {
        result[user.id] = {};
        result[user.id].name = user.surName;
        result[user.id].userName = user.username;
        result[user.id].mail = user.mail;
        result[user.id].role = user.role;
        result[user.id].line = user.line?.name;
        result[user.id].projectInfo = {};
      }
      if (!projectId || !date || !positionId) {
        continue;
      }
      if (!result[user.id].projectInfo[projectId]) {
        result[user.id].projectInfo[projectId] = {};
        result[user.id].projectInfo[projectId].id = projectId;
        result[user.id].projectInfo[projectId].name = user.userProject?.projects?.name;
        result[user.id].projectInfo[projectId].startDate = user.userProject?.projects?.startDate;
        result[user.id].projectInfo[projectId].endDate = user.userProject?.projects?.endDate;
        result[user.id].projectInfo[projectId].status = user.userProject?.projects?.status;
        result[user.id].projectInfo[projectId].pm = user.userProject?.projects?.pm;
      }
      if (!result[user.id].projectInfo[projectId].positions) {
        result[user.id].projectInfo[projectId].positions = {};
      }
      if (!result[user.id].projectInfo[projectId].positions[positionId]) {
        result[user.id].projectInfo[projectId].positions[positionId] = {};
        result[user.id].projectInfo[projectId].positions[positionId].id = positionId;
        result[user.id].projectInfo[projectId].positions[positionId].name = user.userProject?.resource?.position?.name;
        result[user.id].projectInfo[projectId].positions[positionId].code = user.userProject?.resource?.position?.code;
      }
      for (const rangeDate of rangeDates) {
        const key = `${rangeDate[0]}_${[rangeDate[1]]}`;
        if (!result[user.id][key]) {
          result[user.id][key] = {};
        }
        if (new Date(date) < new Date(rangeDate[0]) || new Date(date) > new Date(rangeDate[1])) {
          continue;
        }
        if (!result[user.id][key].totalAcPercent) {
          result[user.id][key].totalAcPercent = 0;
        }
        if (!result[user.id][key].totalTcPercent) {
          result[user.id][key].totalTcPercent = 0;
        }
        result[user.id][key].totalAcPercent += user.userProject?.resource?.acPercent;
        result[user.id][key].totalTcPercent += user.userProject?.resource?.tcPercent;
        if (!result[user.id][key].projects) {
          result[user.id][key].projects = {};
        }
        if (!result[user.id][key].projects[projectId]) {
          result[user.id][key].projects[projectId] = {};
        }
        if (!result[user.id][key].projects[projectId][positionId]) {
          result[user.id][key].projects[projectId][positionId] = {};
        }
        if (!result[user.id][key].projects[projectId][positionId].acPercent) {
          result[user.id][key].projects[projectId][positionId].acPercent = 0;
        }
        if (!result[user.id][key].projects[projectId][positionId].details) {
          result[user.id][key].projects[projectId][positionId].details = [];
        }
        result[user.id][key].projects[projectId][positionId].details.push({
          date,
          acPercent,
          tcPercent,
        });
        if (!result[user.id][key].projects[projectId][positionId].tcPercent) {
          result[user.id][key].projects[projectId][positionId].tcPercent = 0;
        }
        result[user.id][key].projects[projectId][positionId].acPercent += acPercent;
        result[user.id][key].projects[projectId][positionId].tcPercent += tcPercent;
        break;
      }
    }
    filterOptions.take = MAX;
    const userd = await this.userService.getAllProjectOfUser(filterOptions);
    const userFilted = userd.filter((u) => !userIds.includes(u.id));
    for (const userF of userFilted) {
      if (userF.status !== UserNS.Status.ACTIVE && isNil(userF.userProject?.resource?.id)) {
        continue;
      }
      result[userF.id] = {};
      result[userF.id].name = userF.surName;
      result[userF.id].userName = userF.username;
      result[userF.id].mail = userF.mail;
      result[userF.id].role = userF.role;
      result[userF.id].line = userF.line?.name;
      result[userF.id].projectInfo = {};
    }
    return result;
  }

  async getDetailUserResource(id: string, filterOptions: FilterUserAllowcationDto): Promise<UserResourceAllocateDto> {
    const userDto = await this.userService.getUser(id, UserNS.UserStore.MASTERDATA);
    const projects = await this.projectService.getAllProjectOfUser(id);
    const projectAllocateDtos = await Promise.all(
      projects.map(async (project) => {
        const params: CreateUserProjectDto = {
          userId: id,
          projectId: project.id,
        };
        const resources = await this.resourceRepository.getResourceOfUserProject(params, filterOptions);
        const positionDtos = this.getPositionDtosOfResource(resources);
        const positionIds = positionDtos.map((p) => p.id);
        const resourcesDto = await this.getResourceDto(resources, positionIds, filterOptions);
        return new ProjectAllocateDto(project, { resources: resourcesDto, positions: positionDtos });
      }),
    );
    return new UserResourceAllocateDto(userDto, { projectAllocate: projectAllocateDtos });
  }

  getPositionDtosOfResource(resources: ResourceEntity[]): MasterDataDto[] {
    const result: MasterDataDto[] = [];
    const positionEntities = compact(resources.map((res) => res.position));
    for (const position of positionEntities) {
      if (!result.find((value) => value.id === position.id)) {
        const dto = position.toDto();
        result.push(dto);
      }
    }
    return result;
  }

  async getResourceDto(
    resources: ResourceEntity[],
    positionIds: number[],
    filterOptions: {
      allocateGroupType: AllocateGroupType;
      startDate: Date;
      endDate: Date;
    },
    projectId?: number,
  ): Promise<ResourceAllocateDto[]> {
    let availableDates: {
      start: Date;
      end: Date;
    }[];
    switch (filterOptions.allocateGroupType) {
      case AllocateGroupType.Day:
        return resources.map((value) => {
          const date = moment(value.date);
          return {
            startDate: date.toDate(),
            endDate: date.toDate(),
            ac: value.acPercent ?? 0,
            tc: value.tcPercent ?? 0,
          };
        });

      case AllocateGroupType.Week: {
        availableDates = this.getListAvailableWeek(filterOptions.startDate, filterOptions.endDate);
        break;
      }
      case AllocateGroupType.Month: {
        availableDates = this.getListAvailableMonth(filterOptions.startDate, filterOptions.endDate);
        break;
      }
    }
    const data: { start: Date; end: Date; resources: ResourceEntity[] }[] = availableDates.map((date) => ({
      start: date.start,
      end: date.end,
      resources: resources.filter((value) => moment(value.date).isBetween(date.start, date.end, undefined, '[]')),
    }));
    const resourceAllocateDto = await Promise.all(
      data.map(async (value) => {
        let committedTotal;
        if (filterOptions.allocateGroupType === AllocateGroupType.Month && projectId) {
          const month = moment(value.start, 'YYYYMM').toDate();
          committedTotal = (await this.resourceSummaryService.getCommittedAlocated(projectId, month)).committedTotal;
        }
        const resourceAllocateDto: ResourceAllocateDto = {
          allocated: sumBy(value.resources, (res) => res.acPercent + (res.tcPercent ?? 0) ?? 0) / MAN_MONTH_PERCENT,
          committed: committedTotal,
          startDate: value.start,
          endDate: value.end,
          ac: Math.round(
            sumBy(value.resources, (res) => res.acPercent ?? 0) / this.countWorkingDaysBetween(value.start, value.end),
          ),
          tc: Math.round(
            sumBy(value.resources, (res) => res.tcPercent ?? 0) / this.countWorkingDaysBetween(value.start, value.end),
          ),
          detail: positionIds.reduce((detail, id: number) => {
            let isFirst = true;
            const result = value.resources.reduce(
              (obj: Detail, prev: ResourceEntity) => {
                if (prev.positionId === id) {
                  if (isFirst) {
                    obj.start = prev.date.getTime();
                  }
                  obj.end = prev.date.getTime();
                  obj.acPercent += prev.acPercent ?? +0;
                  obj.tcPercent += prev.tcPercent ?? +0;
                  isFirst = false;
                }
                return obj;
              },
              {
                acPercent: +0,
                tcPercent: +0,
                start: 0,
                end: 0,
              },
            );
            return {
              ...detail,
              ...{
                [id]: {
                  ac: result.acPercent / this.countWorkingDaysBetween(value.start, value.end),
                  tc: result.tcPercent / this.countWorkingDaysBetween(value.start, value.end),
                  startDate: new Date(result.start),
                  endDate: new Date(result.end),
                },
              },
            };
          }, {}),
        };
        return resourceAllocateDto;
      }),
    );
    return resourceAllocateDto;
  }

  getListAvailableWeek(
    fromDate: Date,
    finishDate: Date,
  ): {
    start: Date;
    end: Date;
  }[] {
    const filterRange: {
      start: Date;
      end: Date;
    }[] = [];
    const startDate = moment(new Date(fromDate));
    const endDate = moment(new Date(finishDate));
    const trackingDate = startDate;
    while (trackingDate.isSameOrBefore(endDate)) {
      if (trackingDate.isoWeekday() < 6) {
        const targetEndDayOfTrackingWeek = moment(trackingDate)
          .add(5 - trackingDate.isoWeekday(), 'day')
          .utc()
          .endOf('date')
          .local();
        const endDayOfTrackingWeek = targetEndDayOfTrackingWeek.isSameOrBefore(endDate)
          ? targetEndDayOfTrackingWeek
          : moment(endDate).utc().endOf('date').local();
        filterRange.push({
          start: trackingDate.toDate(),
          end: endDayOfTrackingWeek.toDate(),
        });
      }
      trackingDate.add(1 - trackingDate.isoWeekday(), 'day').add(7, 'day');
    }
    return filterRange;
  }

  getListAvailableMonth(
    fromDate: Date,
    finishDate: Date,
  ): {
    start: Date;
    end: Date;
  }[] {
    const filterRange: {
      start: Date;
      end: Date;
    }[] = [];
    const startDate = moment(new Date(fromDate));
    const endDate = moment(new Date(finishDate));
    const trackingDate = startDate;
    while (trackingDate.isSameOrBefore(endDate)) {
      const targetEndDayOfTrackingMonth = moment(trackingDate).utc().endOf('month').endOf('date').local();
      const endDayOfTrackingMonth = targetEndDayOfTrackingMonth.isSameOrBefore(endDate)
        ? targetEndDayOfTrackingMonth
        : moment(endDate).utc().endOf('date').local();
      filterRange.push({
        start: trackingDate.toDate(),
        end: endDayOfTrackingMonth.toDate(),
      });
      trackingDate.set('date', 1).add(1, 'months');
    }
    return filterRange;
  }

  private async getPositionDtosById(
    resources: ResourceEntity[],
    filterOptions: {
      allocateGroupType: AllocateGroupType;
      startDate: Date;
      endDate: Date;
    },
    projectId?: number,
    userId?: string,
  ): Promise<PositionResourcesAllocateDto[]> {
    let actualEffort = +0;
    const result: PositionResourcesAllocateDto[] = [];
    const positionEntities = compact(resources.map((res) => res.position));
    const positionIds: number[] = [];
    for (const position of positionEntities) {
      if (
        resources.find((value) => value.positionId === position.id) &&
        !positionIds.find((id) => id === position.id)
      ) {
        const res = resources.filter((res) => res.positionId === position.id);
        const resourcesDto = await this.getResourceDto(res, positionIds, filterOptions, projectId);
        if (userId && projectId) {
          actualEffort = await this.actualEffort(userId, projectId, position.id);
        }
        const dtoResPos: PositionResourcesAllocateDto = {
          id: position.id,
          name: position.name,
          code: position.code,
          actualEffort,
          resources: resourcesDto,
        };
        result.push(dtoResPos);
        positionIds.push(position.id);
      }
    }
    return result;
  }

  async getListProjectResource(
    resourceProjectFilterDto: ResourceProjectFilterDto,
    user: UserEntity,
  ): Promise<ProjectPositionResourceAllocateDto[]> {
    const projectIds: number[] = [];
    const projects = await this.projectService.getProjectResource(resourceProjectFilterDto, user);
    const projectOfUser = await this.projectService.getProjectOfUser(user.id);
    const projectResourceAllocates: Array<ProjectPositionResourceAllocateDto> = [];
    if (isEmpty(projects.data)) {
      return projectResourceAllocates;
    }

    await Promise.all(
      projects.data.map(async (project) => {
        projectIds.push(project.id);
        let userIds = await this.userProjectService.getUserByProjectId(project.id);
        if (!resourceProjectFilterDto.option && user.role === UserNS.Roles.MEMBER) {
          if (user.role === UserNS.Roles.MEMBER) {
            const pms = !isNil(project.pm) && !isEmpty(project.pm) ? JSON.parse(project.pm) : [];
            if (!pms.includes(user.username)) {
              userIds = userIds.filter((ids) => ids.includes(user.id));
            }
          } else {
            userIds = userIds.filter((ids) => ids.includes(user.id));
          }
        }
        let userAllocateDtos: Array<UserPostionResDto> = [];
        if (userIds.length !== +0) {
          if (projectOfUser.some((pro) => pro.id === project.id && user.role === UserNS.Roles.MEMBER)) {
            userAllocateDtos = await this.userAllocateDtos(resourceProjectFilterDto, userIds, project);
          }
          if (user.role === UserNS.Roles.ADMIN || user.role === UserNS.Roles.LOS) {
            userAllocateDtos = await this.userAllocateDtos(resourceProjectFilterDto, userIds, project);
          }
        }
        const projectEntity = await this.projectService.detailProject(project.id);
        if (!isNil(projectEntity)) {
          const obj = new ProjectPositionResourceAllocateDto(projectEntity, { userAllocate: userAllocateDtos });
          projectResourceAllocates.push(obj);
        }
      }),
    );
    resourceProjectFilterDto.take = MAX;
    const projectAll = await this.projectService.getProjectResource(resourceProjectFilterDto, user);
    const projectFilter = projectAll.data.filter((p) => !projectIds.includes(p.id));
    projectResourceAllocates.push(...projectFilter);
    return projectResourceAllocates;
  }
  private async userAllocateDtos(
    resourceProjectFilterDto: ResourceProjectFilterDto,
    userIds: string[],
    project: ProjectResourceAllocateDto,
  ): Promise<UserPostionResDto[]> {
    return await Promise.all(
      userIds.map(async (id) => {
        const userDto = await this.userService.getUser(id, UserNS.UserStore.MASTERDATA);
        const filterUserAllowcationDto = {
          userId: id,
          startDate: resourceProjectFilterDto.startDate,
          endDate: resourceProjectFilterDto.endDate,
          allocateGroupType: resourceProjectFilterDto.allocateGroupType,
        };
        const params: CreateUserProjectDto = {
          userId: id,
          projectId: project.id,
        };
        const resources = await this.resourceRepository.getResourceOfUserProject(params, filterUserAllowcationDto);
        const positionDtos = await this.getPositionDtosById(resources, filterUserAllowcationDto, project.id, id);
        return new UserPostionResDto(userDto, { positions: positionDtos });
      }),
    );
  }

  private countWorkingDaysBetween(startDate: Date, endDate: Date): number {
    let days = 0;
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).startOf('day');
    while (start.isSameOrBefore(end)) {
      if (![6, 7].includes(start.isoWeekday())) {
        days++;
      }
      start.add(1, 'days');
    }
    return days;
  }

  checkValidateInput(createResourceDto: CreateResourceDto): boolean {
    const { resources } = createResourceDto;
    const resourcesObj = {};
    resources.forEach((resource) => {
      const { userId, projectId, positionId, startDate, endDate } = resource;
      const key = `${userId}-${projectId}-${positionId}`;
      if (!resourcesObj[key]) {
        resourcesObj[key] = [];
      }
      if (resourcesObj[key].length > 0) {
        resourcesObj[key].forEach((dateArr) => {
          if (
            (moment(startDate) >= moment(dateArr[0]) && moment(startDate) <= moment(dateArr[1])) ||
            (moment(endDate) >= moment(dateArr[0]) && moment(endDate) <= moment(dateArr[1]))
          ) {
            throw ResourceNS.errMsg.ValidateDuplicateInput;
          }
        });
      }
      resourcesObj[key].push([startDate, endDate]);
    });
    return true;
  }

  async checkResourcePositionPm(id: number): Promise<boolean> {
    const dateFormat = new Date();
    const resource = await this.resourceRepository.getMaxMinDateResources(id);
    const pmPosition = await this.positionService.getPositionByCode(PositionNS.Code.ProjectManager);
    const isCheck = resource.some(
      (res) =>
        res.getDataValue('positionId') === pmPosition.id &&
        res.getDataValue('startDate') <= dateFormat &&
        dateFormat <= res.getDataValue('endDate'),
    );
    return isCheck;
  }

  async getListUserResoucesSummary(filterOptions: FilterUserSummaryDto): Promise<UserResourceSummaryResponseDto> {
    let userResources: UserResourceSummaryDto[] = [];
    let totalSummary: { totalMember: number; totalMM: number; totalAC: number; totalTC: number } = {
      totalMember: +0,
      totalMM: +0,
      totalAC: +0,
      totalTC: +0,
    };
    let userIds: any[] = [];
    const users = await this.userService.getUserAll(['id'], filterOptions);
    userIds = users.map((u) => u.id);

    if (filterOptions.positionIds && !isEmpty(filterOptions.positionIds)) {
      const listUserIdFilter = await this.resourceRepository.getListUserIdFilterOptions(
        moment(new Date(filterOptions.month)).startOf('month').toDate(),
        moment(new Date(filterOptions.month)).endOf('month').toDate(),
        filterOptions.positionIds ? filterOptions.positionIds : [],
        [],
        filterOptions.divisionIds
      );

      let tmpUserIds: String[] = [];
      listUserIdFilter.forEach((userId) => {
        if(userIds.includes(userId)) {
          tmpUserIds.push(userId);
        }
      })
      userIds = tmpUserIds
    }

    if (!isEmpty(userIds)) {
      userResources = await Promise.all(userIds.map((id) => this.getDetailUserResourceSummary(id, filterOptions)));
      userResources = userResources.filter((u) => !isEmpty(u));
      userResources = this.filterUserResouce(userResources, filterOptions);
      totalSummary = userResources.reduce(
        (obj: TotalUserSummaryDto, u: UserResourceSummaryDto) => {
          obj.totalMember += 1;
          obj.totalMM += u.totalMD / ConstantsResouces.constantsMM;
          obj.totalAC += u.acPer;
          obj.totalTC += u.tcPer;
          return obj;
        },
        { totalMember: +0, totalMM: +0, totalAC: +0, totalTC: +0 },
      );
    }
    const MM =
      parseFloat((totalSummary.totalAC / MAN_MONTH_PERCENT).toFixed(2)) +
      parseFloat((totalSummary.totalTC / MAN_MONTH_PERCENT).toFixed(2));

    const totalm = parseFloat(totalSummary.totalMM.toFixed(2));
    const totalMM = MM === totalm ? parseFloat(totalSummary.totalMM.toFixed(2)) : MM;
    const total: TotalUserSummaryDto = {
      totalMember: totalSummary.totalMember,
      totalMM,
      totalAC: parseFloat((totalSummary.totalAC / MAN_MONTH_PERCENT).toFixed(2)),
      totalTC: parseFloat((totalSummary.totalTC / MAN_MONTH_PERCENT).toFixed(2)),
    };
    return new UserResourceSummaryResponseDto(userResources, total);
  }

  private async getDetailUserResourceSummary(
    id: string,
    filterOptions: FilterUserSummaryDto,
  ): Promise<UserResourceSummaryDto> {
    const { month } = filterOptions;
    const fillter = {
      startDate: moment(new Date(month)).toDate(),
      endDate: moment(new Date(month)).endOf('month').toDate(),
    };
    const fillters = {
      startDate: moment(new Date(month)).toDate(),
      endDate: moment(new Date(month)).endOf('month').toDate(),
      allocateGroupType: AllocateGroupType.Month,
    };
    const userEntity = await this.userService.getUserByLineIds(id, filterOptions);
    const projects = await this.projectService.getAllProjectOfUser(id);
    if (!isEmpty(userEntity)) {
      const projectAllocateDtos = await Promise.all(
        projects.map(async (project) => {
          const params: CreateUserProjectDto = {
            userId: id,
            projectId: project.id,
          };
          const resources = await this.resourceRepository.getResourceOfUserProject(params, fillter);
          const positionDtos = this.getPositionDtosOfResource(resources);
          const positionIds = positionDtos.map((p) => p.id);
          const resourcesDto = await this.getResourceDto(resources, positionIds, fillters);
          return new ProjectAllocateDto(project, { resources: resourcesDto, positions: positionDtos });
        }),
      );
      const compute = await this.computeAcTcMdOfUser(id, filterOptions);
      return new UserResourceSummaryDto(userEntity, compute, { projectAllocate: projectAllocateDtos });
    }
    return {} as UserResourceSummaryDto;
  }

  private async computeAcTcMdOfUser(userId: string, filterOptions: FilterUserSummaryDto) {
    const { month } = filterOptions;
    const startDate = moment(new Date(month)).toDate();
    const endDate = moment(new Date(month)).endOf('month').toDate();
    const resourceUser = await this.resourceRepository.detailResourceUser(userId, filterOptions);
    const compute = resourceUser.reduce(
      (obj: AcTcMdPercentTotalDto, p: ResourceEntity) => {
        if (!p.tcPercent) {
          const tc = +0;
          obj.acPercentTotal += p.acPercent;
          obj.tcPercentTotal += tc;
          obj.totalMD += p.acPercent;
        } else {
          obj.acPercentTotal += p.acPercent;
          obj.tcPercentTotal += p.tcPercent;
          obj.totalMD += p.acPercent + p.tcPercent;
        }
        return obj;
      },
      { acPercent: +0, tcPercent: +0, acPercentTotal: +0, tcPercentTotal: +0, totalMD: +0 },
    );
    return {
      acPercent: compute.acPercentTotal,
      tcPercent: compute.tcPercentTotal,
      acPercentTotal: Math.round(compute.acPercentTotal / this.countWorkingDaysBetween(startDate, endDate)),
      tcPercentTotal: Math.round(compute.tcPercentTotal / this.countWorkingDaysBetween(startDate, endDate)),
      totalMD: parseFloat((compute.totalMD / ConstantsResouces.constantsPer).toFixed(2)),
    };
  }

  async getUserResoucesSummary(userId: string, filterOptions: FilterUserSummaryDto): Promise<UserResourceAllocateDto> {
    const { month } = filterOptions;
    const startDate = moment(new Date(month)).toDate();
    const endDate = moment(new Date(month)).endOf('month').toDate();
    const fillter = {
      startDate,
      endDate,
      allocateGroupType: AllocateGroupType.Month,
    } as FilterUserAllowcationDto;
    const userResources = await this.getDetailUserResource(userId, fillter);
    return userResources;
  }

  async getDataResourceForProject(startDate: Date, endDate: Date, projectId: number): Promise<ResourceEntity[]> {
    const dataResource = await this.resourceRepository.getDataResourceInProject(startDate, endDate, projectId);
    return dataResource;
  }

  async sendResourceDataToTeam(dto: FilterResourceTeamDto): Promise<boolean> {
    try {
      const groupId = this.configService.groupIdTeam;
      const channelId = this.configService.channelIdTeam;
      const startDateStr = moment(dto.startDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
      const endDateStr = moment(dto.endDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      for (const projectId of dto.projectIds) {
        const dataResource = await this.resourceRepository.getDataResourceInProject(startDate, endDate, projectId);
        const project = dataResource[0].userProject?.projects;
        if (!project) {
          throw ProjectNS.errMsg.ProjectNotFound;
        }
        const resourceTotal = await this.resourceRepository.getResourceTotal(startDate, endDate, projectId);
        const subject = `${project.name} ${startDateStr} ~ ${endDateStr}`;
        const emails: string[] = [];
        dataResource.forEach((resource) => {
          const mail = resource.userProject?.users?.mail;
          if (mail && !emails.includes(mail)) {
            emails.push(mail);
          }
        });
        const acPercentAll = resourceTotal[0].acPercentTotal ?? 0;
        const { mentionObjects, mentionTextObj } = await this.azureService.getTeamMentions(emails);
        let content = '';
        content += `Allocated: ${acPercentAll / MAN_MONTH_PERCENT} MM <br/> <br/>`;
        dataResource.forEach((resource) => {
          const mail = resource.userProject?.users?.mail;
          if (!mail) {
            throw ResourceNS.errMsg.UserResourceExists;
          }
          const index = mentionTextObj[mail].id;
          const displayName = mentionTextObj[mail].displayName;
          const startDateUser = moment(resource.startDate).format('YYYY/MM/DD');
          const endDateUser = moment(resource.endDate).format('YYYY/MM/DD');
          const positionCode = resource.position?.code;
          const acTotal = resource.acPercentTotal ?? 0;
          const tcTotal = resource.tcPercentTotal ?? 0;
          const count = resource.count;
          if (acTotal && count) {
            content += `<at id="${index}">${displayName}</at> ${startDateUser} ~ ${endDateUser} | ${positionCode} | AC ${
              acTotal / count
            }% | TC ${tcTotal / count}% <br/>`;
          }
        });
        await this.azureService.sendMessageToTeams(groupId, channelId, mentionObjects, subject, content);
      }
      return true;
    } catch (error) {
      throw ResourceNS.errMsg.UserResourceExists;
    }
  }
  private filterUserResouce(
    userResources: UserResourceSummaryDto[],
    filterOptions: FilterUserSummaryDto,
  ): UserResourceSummaryDto[] {
    let userResourcesFilter: UserResourceSummaryDto[] = userResources;
    if (filterOptions.type !== ResourceNS.TypeComparisons.ALL) {
      switch (filterOptions.type) {
        case ResourceNS.TypeComparisons.ACTC: {
          userResourcesFilter = userResourcesFilter.filter((u) => {
            const total = u.ac + u.tc;
            return this.getResourceType(filterOptions, total);
          });
          break;
        }
        case ResourceNS.TypeComparisons.AC: {
          userResourcesFilter = userResourcesFilter.filter((u) => {
            const total = u.ac;
            return this.getResourceType(filterOptions, total);
          });
          break;
        }
      }
    }
    return userResourcesFilter;
  }

  private getResourceType(options: FilterUserSummaryDto, total: number) {
    const { comma, percent } = options;
    const percentInt = parseInt(percent);
    if (comma === Comparison.GREATER) {
      return _.gt(total, percentInt);
    }
    if (comma === Comparison.LESS) {
      return _.lt(total, percentInt);
    }
    if (comma === Comparison.LE) {
      return _.lte(total, percentInt);
    }
    if (comma === Comparison.GE) {
      return _.gte(total, percentInt);
    }
    if (comma === Comparison.EQUAL) {
      return total === percentInt;
    }
  }

  async getResourceFilterTeam(dto: FilterResourceTeamDto): Promise<ResourceEntity[]> {
    const startDateStr = moment(dto.startDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
    const endDateStr = moment(dto.endDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    let dataResourceProjcet: ResourceEntity[] = [];
    for (const projectId of dto.projectIds) {
      const dataResource = await this.resourceRepository.getDataResourceInProject(startDate, endDate, projectId);
      dataResourceProjcet = [...dataResourceProjcet, ...dataResource];
    }
    return dataResourceProjcet;
  }
  async sendResourceSummaryDataToTeam(fillterOption: FilterUserSummaryDto): Promise<boolean> {
    const groupId = this.configService.groupIdTeam;
    const channelId = this.configService.channelIdTeam;
    const { month } = fillterOption;
    const startDate = moment(new Date(month)).toDate();
    const endDate = moment(new Date(month)).endOf('month').toDate();
    const fillter = {
      startDate,
      endDate,
      allocateGroupType: AllocateGroupType.Month,
    } as FilterUserAllowcationDto;
    const resourceUser = await this.getListUserResoucesSummary(fillterOption);
    const projectIds: number[] = [];
    let emails: string[] = [];
    for (const res of resourceUser.data) {
      const ids = res.allocates?.map((a) => {
        if (!isEmpty(a.positions)) {
          return a.id;
        }
      });
      ids?.map((id) => {
        if (id && !projectIds.includes(id)) {
          projectIds.push(id);
        }
      });
    }
    for (const projectId of projectIds) {
      const project = await this.projectService.getProjectbyId(projectId);
      const subject = `[New Update] [${project.name}][${fillterOption.month}] Resource Allocation`;
      let content = '';
      content += 'Members: <br/>';
      for (const res of resourceUser.data) {
        if (res.allocates?.some((allo) => allo.id === projectId)) {
          const userResources = await this.getDetailUserResource(res.id, fillter);
          userResources.allocates?.forEach((a) => {
            if (a.id === projectId && !isEmpty(a.positions)) {
              const mail = res.mail;
              if (mail && !emails.includes(mail)) {
                emails.push(mail);
              }
            }
          });
        }
      }
      const { mentionTextObj } = await this.azureService.getTeamMentions(emails);
      let mentionObjects = (await this.azureService.getTeamMentions(emails)).mentionObjects;
      for (const res of resourceUser.data) {
        if (res.allocates?.some((allo) => allo.id === projectId)) {
          const userResources = await this.getDetailUserResource(res.id, fillter);
          userResources.allocates?.forEach((a) => {
            if (a.id === projectId) {
              a?.positions?.forEach((pos: MasterDataDto) =>
                a?.resources?.forEach((resource: ResourceAllocateDto) => {
                  const index = mentionTextObj[res.mail].id;
                  const displayName = mentionTextObj[res.mail].displayName;
                  const acPercent = Math.round(resource?.detail[pos?.id].ac);
                  const tcPercent = Math.round(resource?.detail[pos?.id].tc);
                  const end = moment(resource?.detail[pos?.id].endDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
                  const start = moment(resource?.detail[pos?.id].startDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
                  if (acPercent && tcPercent) {
                    content += `<at id="${index}">${displayName}</at> ${pos.code} | ${start} ~ ${end} | Effort ${
                      acPercent + tcPercent
                    }% <br/>`;
                  }
                  if (acPercent && !tcPercent) {
                    content += `<at id="${index}">${displayName}</at> ${pos.code} | ${start} ~ ${end} | Effort ${acPercent}% <br/>`;
                  }
                  if (!acPercent && tcPercent) {
                    content += `<at id="${index}">${displayName}</at> ${pos.code} | ${start} ~ ${end} | Effort ${tcPercent}% <br/>`;
                  }
                }),
              );
            }
          });
        }
      }
      emails = [];
      await this.azureService.sendMessageToTeams(groupId, channelId, mentionObjects, subject, content);
      mentionObjects = [];
    }
    return true;
  }

  async sendProjectToTeam(postTeamDto: PostTeamProjectdto[]): Promise<ResourceNS.TeamApiResponse> {
    const errors: Partial<TeamLogsDto>[] = [];
    const response: ResourceNS.TeamApiResponse = {
      success: true,
      errors,
    };
    for (const post of postTeamDto) {
      const dataTeam = await this.teamsService.getDataTeamOfProject(post.projectId);
      try {
        if (!dataTeam || !dataTeam.groupId || !dataTeam.channelId) {
          errors.push({
            projectId: post.projectId,
            projectName: post.projectName,
            errorMessage: 'Not setting data team in project',
          });
          continue;
        }
        const emails: string[] = [];
        post.members.map((mem) => {
          if (mem.mail && !emails.includes(mem.mail)) {
            emails.push(mem.mail);
          }
        });
        const subject = `[New Update] [${post.projectName}][${post.month}] Resource Allocation`;
        let content = '';
        content += 'Members: <br/>';
        const { mentionObjects, mentionTextObj } = await this.azureService.getTeamMentions(emails);
        let index = 0;

        const result = post.members.reduce(function (r, a) {
          r[a.mail] = r[a.mail] || [];
          r[a.mail].push(a);
          return r;
        }, Object.create(null));

        const listMember = Object.keys(result);

        listMember.map((mem) => {
          if (isNil(mentionTextObj[mem]?.displayName)) {
            throw ResourceNS.errMsg.EmailNotExist;
          }
          const displayName = mentionTextObj[mem].displayName;
          content += `<at id="${index}">${displayName}</at> <ul>`;
          result[mem].map((e) => {
            const acPercent = e.acPercent ? Math.round(e.acPercent) : 0;
            const tcPercent = e.tcPercent ? Math.round(e.tcPercent) : 0;
            const end = moment(e.endDate, 'YYYY-MM-DD').format('YYYY/MM/DD');
            const start = moment(e.startDate, 'YYYY-MM-DD').format('YYYY/MM/DD');
            content += `<li>${e.position} | ${start} ~ ${end} | Effort ${acPercent + tcPercent}% </li>`;
          });
          content += '</ul>';
          index += 1;
        });

        await this.azureService.sendMessageToTeams(
          dataTeam.groupId,
          dataTeam.channelId,
          mentionObjects,
          subject,
          content,
        );
      } catch (error) {
        const errorMessage = Util.isJsonString(error.message)
          ? JSON.parse(JSON.parse(error.message).message).details
          : error.message;
        errors.push({
          projectId: post.projectId,
          projectName: post.projectName,
          errorMessage,
        });
        const teamLogs = new TeamLogsEntity();
        teamLogs.projectId = post.projectId;
        teamLogs.errorMessage = errorMessage;
        await teamLogs.save();
      }
    }
    return response;
  }
  async actualEffort(userId: string, projectId: number, positionId: number): Promise<number> {
    const logWork = await this.logWorkService.findAllActualEffort(userId, projectId);
    const userProjectIds = logWork.map((log) => log.userProjectId);
    let actualEffort = +0;
    let resource: ResourceEntity[];
    await Promise.all(
      userProjectIds.map(async (id) => {
        const resources = await this.resourceRepository.getResourceByUserProjectId(id);
        resource = resources.filter((res) => res.positionId === positionId);
      }),
    );
    logWork.map((log) => {
      if (resource.some((res) => res.userProjectId === log.userProjectId)) {
        actualEffort += log.actualEffort ?? 0;
      }
    });
    return actualEffort;
  }

  async popup(param: ParamPopupDto): Promise<PopUpDto> {
    const { userId, projectId, positionId } = param;
    const userProject = await this.userProjectService.getUserProjectByProjectIdAndUserId(userId, projectId);
    const actualEffort = await this.actualEffort(userId, +projectId, +positionId);
    const resourceEntity: ResourceEntity[] = [];
    await Promise.all(
      userProject.map(async (id) => {
        const resources = await this.resourceRepository.getResourceByUserProjectId(id);
        const res = resources.filter((res) => res.positionId === +positionId);
        resourceEntity.push(...res);
      }),
    );
    let isFirst = true;
    const popup = resourceEntity.reduce(
      (obj: { ce: number; startDate: number; endDate: number }, res: ResourceEntity) => {
        if (isFirst) {
          obj.startDate = res.date.getTime();
        }
        obj.endDate = res.date.getTime();
        isFirst = false;
        if (res.tcPercent) {
          obj.ce += res.acPercent + res.tcPercent;
        } else {
          obj.ce += res.acPercent;
        }
        return obj;
      },
      {
        ce: +0,
        startDate: +0,
        endDate: +0,
      },
    );
    const projectAfter = await this.resourceRepository.getProjectRankMember(positionId, userId, projectId, 'after');
    const projectBefore = await this.resourceRepository.getProjectRankMember(positionId, userId, projectId, 'before');
    const projectNow = await this.resourceRepository.getProjectRankMember(positionId, userId, projectId, 'now');
    let rankName;
    if (!isEmpty(projectNow)) {
      rankName = projectNow[0].projectRank?.name;
    } else if (!isEmpty(projectBefore) && isEmpty(projectAfter)) {
      rankName = projectBefore[0].projectRank?.name;
    } else if (!isEmpty(projectAfter) && isEmpty(projectBefore)) {
      rankName = projectAfter[0].projectRank?.name;
    } else if (!isEmpty(projectAfter) && !isEmpty(projectBefore)) {
      rankName = projectBefore[0].projectRank?.name;
    }

    const response: PopUpDto = {
      projectRank: !isNil(rankName) ? rankName : undefined,
      ce: popup.ce / MAN_MONTH_PERCENT,
      actualEffort,
      startDate: new Date(popup.startDate),
      endDate: new Date(popup.endDate),
    };
    return response;
  }
  async getResourceInProject(projectId: number): Promise<number> {
    const total = await this.resourceRepository.getResourceInProject(projectId);
    return total;
  }

  async getResourceTotal(startDate: Date, endDate: Date, projectId: number) {
    return await this.resourceRepository.getResourceTotal(startDate, endDate, projectId);
  }
  async tooltipProject(projectId: number): Promise<TooltipUpDto> {
    const totalCommited = await this.resourceSummaryService.getToTalResourceProject(projectId);
    const total = await this.getResourceInProject(projectId);
    const acTotal = parseFloat(total[0].acPercentTotal) / MAN_MONTH_PERCENT;
    const tcTotal = parseFloat(total[0].tcPercentTotal) / MAN_MONTH_PERCENT;
    const project = await this.projectService.detailProject(projectId);
    const response: TooltipUpDto = {
      committed: totalCommited.committedTotal,
      acTotal: parseFloat(acTotal.toFixed(2)),
      tcTotal: parseFloat(tcTotal.toFixed(2)),
      startDate: project.startDate,
      endDate: project.endDate,
    };
    return response;
  }

  async deleteAllResourceMember(userProjectId: number, t: Transaction): Promise<SuccessResponseDto> {
    return await this.resourceRepository.deleteAllResourceMember(userProjectId, t);
  }
  async actcDetail(userId: string, month: Date): Promise<DetailMemberRs[]> {
    const array: DetailMemberRs[] = [];
    const details = await this.resourceRepository.actcDetail(userId, month);
    details.map((d) => {
      const detail: DetailMemberRs = {
        startDate: d.startDate,
        endDate: d.endDate,
        acPercent: d.acPercent,
        tcPercent: d.tcPercent,
        positionId: d.positionId,
        userId: d['userProject.userId'],
        projectId: d['userProject.projectId'],
      };
      array.push(detail);
    });
    return array;
  }

  async getResourcePms(userProjectIds: number[]): Promise<ResourceEntity[]> {
    return await this.resourceRepository.getResourcePms(userProjectIds);
  }
  async getResourceUserInProject(params: CreateUserProjectDto): Promise<ResourceDto[]> {
    return await this.resourceRepository.detailResourceUserProject(params);
  }

  async getResourceByUserPRojectId(userProjectId: number): Promise<ResourceEntity[]> {
    return await this.resourceRepository.getResourceByUserProjectId(userProjectId);
  }

  async deletetAllResourceByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto> {
    return await this.resourceRepository.deletetAllResourceByUserProjectIds(userProjectIds, t);
  }
  async updateResourcesWhenSettingDaysOff(dto: ParamUpdateDayOffDto): Promise<SuccessResponseDto> {
    return await this.resourceRepository.updateResourcesWhenSettingDaysOff(dto);
  }
  async restoreResourcesWhenDeleteDayOff(dayOff: DaysOffEntity[]): Promise<SuccessResponseDto> {
    return await this.resourceRepository.restoreResourcesWhenDeleteDayOff(dayOff);
  }

  async getAllPositionUsing(paramPositionIdsDto: ParamPositionIdsDto): Promise<ResourcePositionDto[]> {
    const result =  await this.resourceRepository.getAllPositionUsing(paramPositionIdsDto);
    return result;
  }
}
