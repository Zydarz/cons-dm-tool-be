import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { default as ResourceEntity } from '../../../entities/resource.entity';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { ConfirmOverResourceDto } from '../dto/requests/confirm-resource-dto';
import { CreateResourceDto } from '../dto/requests/create-resource-dto';
import { FindUserDifferentProjectDto } from '../dto/requests/find-user-different-project-dto';
import { UserResourceDto } from '../dto/requests/user-resource-dto';
import { OverResourceDto } from '../dto/responses/over-resource-dto';
import { TokenOverResourceDto } from '../dto/responses/token-over-resource-dto';
import { UserProjectDto } from '../../user-projects/dto/responses/user-project-dto';
import { FilterUserAllowcationDto } from '../dto/requests/filter-user-allocation-dto';
import { UserResourceAllocateDto } from '../dto/responses/user-resource-allocate-dto';
import { ResourceDto } from '../dto/responses/resource-dto';
import { ResourceProjectFilterDto } from '../dto/requests/resource-project-filter.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { RequestResourceDto } from '../dto/requests/request-resource-update-dto';
import { CreateUserProjectDto } from '../../../modules/user-projects/dto/requests/create-user-project-dto';
import { ProjectPositionResourceAllocateDto } from '../dto/responses/project-position-res-allocate-dto';
import { AcAndTcPercentTotalDto } from '../dto/responses/ac-tc-percent-total-dto';
import { FilterUserSummaryDto } from '../dto/requests/filter-user-summary-dto';
import { UserResourceSummaryResponseDto } from '../../../common/dto/user-resource-summary-response.dto';
import { FilterResourceTeamDto } from '../dto/requests/filter-resource-team.dto';
import { default as UserEntity } from '../../../entities/users.entity';
import { PostTeamProjectdto } from '../dto/requests/post-team-project-dto';
import { ParamPopupDto } from '../dto/requests/param-popup-dto';
import { PopUpDto } from '../dto/responses/popup-dto';
import { TooltipUpDto } from '../dto/responses/tooltip-dto';
import { DeleteResourceDto } from '../dto/requests/delete-resource-dto';
import { Transaction } from 'sequelize';
import { DetailMemberRs } from '../dto/responses/detail-member-rs-dto';
import { TeamLogsDto } from '../../../modules/teams/dto/team-logs.dto';
import { ParamUpdateDayOffDto } from '../dto/requests/param-daysoff-dto';
import { default as DaysOffEntity } from '../../../entities/days-off.entity';
import { ParamPositionIdsDto } from '../dto/requests/param-position-ids.dto';
import { ResourcePositionDto } from '../dto/responses/resource-position-dto';
export namespace ResourceNS {
  export interface IResourceService {
    createResource(
      createResourceDto: CreateResourceDto,
      user: UserEntity,
    ): Promise<SuccessResponseDto | TokenOverResourceDto>;
    addResource(createResourceDto: CreateResourceDto): Promise<SuccessResponseDto>;
    deleteResource(dto: DeleteResourceDto, user: UserEntity, projectId: number): Promise<SuccessResponseDto>;
    confirmOverResource(confirmOverResource: ConfirmOverResourceDto): Promise<SuccessResponseDto>;
    updateResource(
      userId: string,
      projectId: number,
      updateResourceDto: RequestResourceDto[],
      user: UserEntity,
      edit?: string,
    ): Promise<SuccessResponseDto | TokenOverResourceDto>;
    detailResourceUserProject(params: CreateUserProjectDto, user: UserEntity): Promise<UserProjectDto>;
    getUserResource(
      filterOptions: FilterUserAllowcationDto,
      user: UserEntity,
    ): Promise<PageDto<UserResourceAllocateDto>>;
    getListProjectResource(
      resourceProjectFilterDto: ResourceProjectFilterDto,
      user: UserEntity,
    ): Promise<ProjectPositionResourceAllocateDto[]>;
    checkValidateInput(createResourceDto: CreateResourceDto): boolean;
    checkResourcePositionPm(id: number): Promise<boolean>;
    getListUserResoucesSummary(
      filterOptions: FilterUserSummaryDto,
      user?: UserEntity,
    ): Promise<UserResourceSummaryResponseDto>;
    getUserResoucesSummary(userId: string, filterOptions: FilterUserSummaryDto): Promise<UserResourceAllocateDto>;
    getDataResourceForProject(startDate: Date, endDate: Date, projectId: number): Promise<ResourceEntity[]>;
    sendResourceDataToTeam(dto: FilterResourceTeamDto): Promise<boolean>;
    getResourceFilterTeam(dto: FilterResourceTeamDto): Promise<ResourceEntity[]>;
    sendResourceSummaryDataToTeam(fillterOptions: FilterUserSummaryDto): Promise<boolean>;
    sendProjectToTeam(postTeamDto: PostTeamProjectdto[]): Promise<ResourceNS.TeamApiResponse>;
    actualEffort(userId: string, projectId: number, positionId: number);
    deleteResourceByDate(projectId: number, endDate?: Date, startDate?: Date): Promise<void>;
    popup(param: ParamPopupDto): Promise<PopUpDto>;
    getResourceInProject(projectId: number): Promise<number>;
    getResourceTotal(startDate: Date, endDate: Date, projectId: number);
    tooltipProject(projectId: number): Promise<TooltipUpDto>;
    deleteAllResourceMember(userProjectId: number, t: Transaction): Promise<SuccessResponseDto>;
    actcDetail(userId: string, month: Date): Promise<DetailMemberRs[]>;
    getResourcePms(userProjectIds: number[]): Promise<ResourceEntity[]>;
    getResourceUserInProject(params: CreateUserProjectDto): Promise<ResourceDto[]>;
    getResourceByUserPRojectId(userProjectId: number): Promise<ResourceEntity[]>;
    deletetAllResourceByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto>;
    updateResourcesWhenSettingDaysOff(dto: ParamUpdateDayOffDto): Promise<SuccessResponseDto>;
    restoreResourcesWhenDeleteDayOff(dayOff: DaysOffEntity[]): Promise<SuccessResponseDto>;
    getAllPositionUsing(paramPositionIdsDto: ParamPositionIdsDto): Promise<ResourcePositionDto[]>;
  }

  export interface IResourceRepository {
    getDataResourceInProjectByMonth(startDate: Date, endDate: Date, projectId: number);
    checkOverResource(createResourceDto: CreateResourceDto): Promise<OverResourceDto[]>;
    addResource(userProjectId: number, userResource: UserResourceDto): Promise<SuccessResponseDto>;
    checkResourceOnlyUser(
      userId: string,
      projectId: number,
      updateResourceDto: RequestResourceDto[],
    ): Promise<OverResourceDto[]>;

    // find all resource user different project
    findAllDifferentProject(findUserDifferentProjectDto: FindUserDifferentProjectDto): Promise<ResourceEntity[]>;
    updateResourceUser(
      userId: string,
      projectId: number,
      updateResourceDto: RequestResourceDto[],
      userProjectId: number,
      edit?: string,
    ): Promise<boolean>;
    detailResourceUserProject(params: CreateUserProjectDto): Promise<ResourceDto[]>;
    getResourceOfUserProject(
      params: CreateUserProjectDto,
      filter: {
        startDate: Date;
        endDate: Date;
      },
    ): Promise<ResourceEntity[]>;
    findResourceDifferentPosition(findUserDifferentProjectDto: FindUserDifferentProjectDto): Promise<number[]>;
    findResourceDifferentProject(findUserDifferentProjectDto: FindUserDifferentProjectDto): Promise<number[]>;
    getAcAndTcPercentTotal(
      userProjectId: number,
      positionId: number,
      startDate: Date,
      endDate: Date,
    ): Promise<AcAndTcPercentTotalDto>;
    getResourceByUserProjectId(id: number): Promise<ResourceEntity[]>;
    getResourceOfUserProjectOneMonth(filterUserSummaryDto: FilterUserSummaryDto): Promise<ResourceEntity[]>;
    detailResourceUser(userId: string, filterUserSummaryDto: FilterUserSummaryDto): Promise<ResourceEntity[]>;
    getStartDateAndEndDateOfPositionUserInProject(
      positionId: number,
      userProjectId: number,
    ): Promise<{ startDate: Date | null; endDate: Date | null }>;
    getDataResourceInProject(startMonth: Date, endMonth: Date, projectId: number): Promise<ResourceEntity[]>;
    getResourceTotal(startDate: Date, endDate: Date, projectId: number);
    deleteResourceByDate(projectId: number, endDate?: Date, startDate?: Date): Promise<void>;
    getResourceInProject(projectId: number);
    deleteResource(dto: DeleteResourceDto): Promise<boolean>;
    deleteAllResourceMember(userProjectId: number, t: Transaction): Promise<SuccessResponseDto>;
    actcDetail(userId: string, month: Date): Promise<ResourceEntity[]>;
    getListUserIdFilterByPositionIds(
      positionIds: number[],
      startDate: Date,
      endDate: Date,
      projectIds?: number[],
      departmentIds?: number[],
    ): Promise<string[]>;
    getListUserIdFilterOptions(
      startDate: Date,
      endDate: Date,
      positionIds: number[],
      projectIds?: number[],
      departmentIds?: number[],
    ): Promise<string[]>;
    getResourcePms(userProjectIds: number[]): Promise<ResourceEntity[]>;
    deletetAllResourceByUserProjectIds(userProjectIds: number[], t?: Transaction): Promise<SuccessResponseDto>;
    updateResourcesWhenSettingDaysOff(dto: ParamUpdateDayOffDto): Promise<SuccessResponseDto>;
    getMaxMinDateResources(id: number): Promise<ResourceEntity[]>;
    getProjectRankMember(
      positionId: number,
      userId: string,
      projectId: number,
      option: string,
    ): Promise<ResourceEntity[]>;
    restoreResourcesWhenDeleteDayOff(dayOff: DaysOffEntity[]): Promise<SuccessResponseDto>;
    getAllPositionUsing(paramPositionIdsDto: ParamPositionIdsDto): Promise<ResourcePositionDto[]>;
  }

  export const errMsg = {
    UserResourceExists: new ConflictException(),
    ValidateDuplicateInput: new ConflictException('Validate Duplicate Input'),
    UpdateResourceSummary: new BadRequestException('Update Resource Summary invalid !'),
    EmailNotExist: new NotFoundException('email not exist !'),
  };

  export type ITotalAcAndTcPercent = Record<
    string,
    {
      acPercentTotal: number;
      tcPercentTotal: number;
    }
  >;

  export type IDiffAcAndTcPercent = Record<
    string,
    {
      acPercentDiff: number;
      tcPercentDiff: number;
    }
  >;
  export enum TypeComparisons {
    ALL = 'All',
    ACTC = 'AC,TC',
    AC = 'AC',
  }

  export class TeamApiResponse {
    success: boolean;
    errors: Partial<TeamLogsDto>[];
  }
}
