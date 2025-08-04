import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateResourceDto } from './dto/requests/create-resource-dto';
import { ResourceNS } from './interfaces/resource';
import { ConfirmOverResourceDto } from './dto/requests/confirm-resource-dto';
import { TokenOverResourceDto } from './dto/responses/token-over-resource-dto';
import { UserProjectDto } from '../../modules/user-projects/dto/responses/user-project-dto';
import { FilterUserAllowcationDto } from './dto/requests/filter-user-allocation-dto';
import { UserResourceAllocateDto } from './dto/responses/user-resource-allocate-dto';
import { ResourceProjectFilterDto } from './dto/requests/resource-project-filter.dto';
import { PageDto } from '../../common/dto/page.dto';
import { UpdateResourceDto } from './dto/requests/update-resource-dto';
import { CreateUserProjectDto } from '../../modules/user-projects/dto/requests/create-user-project-dto';
import { ProjectPositionResourceAllocateDto } from './dto/responses/project-position-res-allocate-dto';
import { UserNS } from '../../modules/users/interface/users';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { FilterUserSummaryDto } from './dto/requests/filter-user-summary-dto';
import { UserResourceSummaryResponseDto } from '../../common/dto/user-resource-summary-response.dto';
import { FilterResourceTeamDto } from './dto/requests/filter-resource-team.dto';
import { PostTeamProjectdto } from './dto/requests/post-team-project-dto';
import { PopUpDto } from './dto/responses/popup-dto';
import { ParamPopupDto } from './dto/requests/param-popup-dto';
import { TooltipUpDto } from './dto/responses/tooltip-dto';
import { DeleteResourceDto } from './dto/requests/delete-resource-dto';
import { AcTcParamDto } from './dto/requests/actc-dto';
import { DetailMemberRs } from './dto/responses/detail-member-rs-dto';
import { ParamUpdateDayOffDto } from './dto/requests/param-daysoff-dto';
import { ProjectFilterOptionsDto } from '../../modules/projects/dto/requests/project-filter-options.dto';
import { ProjectDto } from '../../modules/projects/dto/responses/project-dto';
import { ProjectNS } from '../../modules/projects/interfaces/project';
import { UserDto } from '../../modules/users/dto/response/user-dto';
import { UserSearchDto } from '../../modules/users/dto/request/user-search.dto';
import { MasterDataNS } from '../../modules/master-data/master-data';
import { isNil } from 'lodash';
import { ParamPositionIdsDto } from './dto/requests/param-position-ids.dto';
import { ResourceDto } from './dto/responses/resource-dto';
import { ResourcePositionDto } from './dto/responses/resource-position-dto';

@ApiTags('Resource')
@Controller('resources')
export class ResourcesController {
  constructor(
    @Inject('IResourceService') private readonly resourceService: ResourceNS.IResourceService,
    @Inject('IProjectService') private readonly projectService: ProjectNS.IProjectService,
    @Inject('IUserService') private readonly userService: UserNS.IUserService,
    @Inject('IMasterDataService') private readonly masterDataService: MasterDataNS.IMasterDataService,
  ) {}

  @Post()
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.CREATED)
  async addResource(
    @Body() dto: CreateResourceDto,
    @AuthUser() user: UserEntity,
  ): Promise<SuccessResponseDto | TokenOverResourceDto> {
    return await this.resourceService.createResource(dto, user);
  }

  @Post('member')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.CREATED)
  async addResourceMember(
    @Body() dto: CreateResourceDto,
    @AuthUser() user: UserEntity,
  ): Promise<SuccessResponseDto | TokenOverResourceDto> {
    return await this.resourceService.createResource(dto, user);
  }

  @Post('confirm-overs')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.CREATED)
  async confirmOverResource(
    @Body()
    confirmResource: ConfirmOverResourceDto,
  ): Promise<SuccessResponseDto> {
    return await this.resourceService.confirmOverResource(confirmResource);
  }

  @Put(':userId/project/:projectId')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async updateResource(
    @Param('userId') userId: string,
    @Param('projectId') projectId: number,
    @Query('edit') edit: string,
    @Body()
    updateResourceDto: UpdateResourceDto,
    @AuthUser() user: UserEntity,
  ): Promise<SuccessResponseDto | TokenOverResourceDto> {
    const updateResource = updateResourceDto.resources;
    for (const resource of updateResource) {
      const projectRannk = await this.masterDataService.checkProjectRank(resource.projectRankId);
      if (isNil(projectRannk)) {
        throw MasterDataNS.ERRORS.ProjectRankNotFound;
      }
    }
    if (edit !== 'week') {
      return await this.resourceService.updateResource(userId, projectId, updateResource, user);
    }
    return await this.resourceService.updateResource(userId, projectId, updateResource, user, edit);
  }

  @Put(':userId/member/:projectId')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async updateResourceMember(
    @Param('userId') userId: string,
    @Param('projectId') projectId: number,
    @Query('edit') edit: string,
    @Body()
    updateResourceDto: UpdateResourceDto,
    @AuthUser() user: UserEntity,
  ): Promise<SuccessResponseDto | TokenOverResourceDto> {
    const updateResource = updateResourceDto.resources;
    if (edit !== 'week') {
      return await this.resourceService.updateResource(userId, projectId, updateResource, user);
    }
    return await this.resourceService.updateResource(userId, projectId, updateResource, user, edit);
  }

  @Delete(':userId/project/:projectId')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async deleteResource(
    @Body()
    dto: DeleteResourceDto,
    @AuthUser() user: UserEntity,
    @Param('projectId') projectId: number,
  ): Promise<SuccessResponseDto> {
    return await this.resourceService.deleteResource(dto, user, projectId);
  }

  @Delete(':projectId/user/:userId')
  @ApiOkResponse({ type: SuccessResponseDto })
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async deleteMemberProject(
    @Param('projectId') projectId: number,
    @Param('userId') userId: string,
    @AuthUser() user: UserEntity,
  ): Promise<SuccessResponseDto> {
    return await this.projectService.deleteMemberProject(projectId, userId, user);
  }

  @Delete(':userId/member/:projectId')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async deleteResourceMember(
    @Body()
    dto: DeleteResourceDto,
    @AuthUser() user: UserEntity,
    @Param('projectId') projectId: number,
  ): Promise<SuccessResponseDto> {
    return await this.resourceService.deleteResource(dto, user, projectId);
  }

  @Get(':userId/project/:projectId')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async detailResourceUserProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: number,
    @AuthUser() user: UserEntity,
  ): Promise<UserProjectDto> {
    const params: CreateUserProjectDto = { userId, projectId };
    return await this.resourceService.detailResourceUserProject(params, user);
  }

  @Get('users')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getListUserResource(
    @Query() filter: FilterUserAllowcationDto,
    @AuthUser() user: UserEntity,
  ): Promise<PageDto<UserResourceAllocateDto>> {
    return await this.resourceService.getUserResource(filter, user);
  }

  @Get('projects')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getListProjectResource(
    @Query() resourceProjectFilterDto: ResourceProjectFilterDto,
    @AuthUser() user: UserEntity,
  ): Promise<ProjectPositionResourceAllocateDto[]> {
    return await this.resourceService.getListProjectResource(resourceProjectFilterDto, user);
  }

  @Get('list-project')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    projectFilterOptionsDto: ProjectFilterOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<PageDto<ProjectDto>> {
    if (user.role === UserNS.Roles.MEMBER) {
      projectFilterOptionsDto.userId = user.id;
    }
    return await this.projectService.getAll(projectFilterOptionsDto);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  getUserByID(@Param('id') id: string, @Query('store') store: UserNS.UserStore): Promise<UserDto> {
    if (!store) {
      return this.userService.getUser(id, UserNS.UserStore.AZURE);
    }
    return this.userService.getUser(id, store, 'project');
  }

  @Get('list-user')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  searchUsers(@Query() search: UserSearchDto, @AuthUser() user: UserEntity): Promise<UserDto[]> {
    return this.userService.getAllUser(search, user);
  }

  @Get('users/summary')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getListUserResourceSummary(
    @Query() filter: FilterUserAllowcationDto,
    @AuthUser() user: UserEntity,
  ): Promise<PageDto<UserResourceAllocateDto>> {
    return await this.resourceService.getUserResource(filter, user);
  }

  @Post('send-resource-to-chanel-team')
  @HttpCode(HttpStatus.OK)
  async sendResourceToChanelTeam(@Body() dto: FilterResourceTeamDto) {
    return await this.resourceService.sendResourceDataToTeam(dto);
  }

  @Get('user-summary')
  @Auth([UserNS.Roles.LOS, UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getListUserResoucesSummary(@Query() fillter: FilterUserSummaryDto): Promise<UserResourceSummaryResponseDto> {
    return await this.resourceService.getListUserResoucesSummary(fillter);
  }

  @Get('user-summary/:id')
  @HttpCode(HttpStatus.OK)
  async getUserResoucesSummary(
    @Param('id') id: string,
    @Query() fillter: FilterUserSummaryDto,
  ): Promise<UserResourceAllocateDto> {
    return await this.resourceService.getUserResoucesSummary(id, fillter);
  }

  @Post('filter-team')
  @HttpCode(HttpStatus.OK)
  async getResourceFilterTeam(@Body() dto: FilterResourceTeamDto) {
    return await this.resourceService.getResourceFilterTeam(dto);
  }

  @Get('send-resource-summary-to-chanel-team')
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async sendResourceSummaryToChanelTeam(@Query() fillter: FilterUserSummaryDto) {
    return await this.resourceService.sendResourceSummaryDataToTeam(fillter);
  }

  @Post('send-project-to-team')
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async sendProjectToChanelTeam(@Body() res: PostTeamProjectdto[]) {
    return await this.resourceService.sendProjectToTeam(res);
  }

  @Get('popup-project')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async popUpProject(@Query() param: ParamPopupDto): Promise<PopUpDto> {
    return await this.resourceService.popup(param);
  }

  @Get('tooltip-project/:id')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async tooltipProject(@Param('id') id: number): Promise<TooltipUpDto> {
    return await this.resourceService.tooltipProject(id);
  }

  @Get('actc-detail')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async actcDetail(@Query() dto: AcTcParamDto): Promise<DetailMemberRs[]> {
    return await this.resourceService.actcDetail(dto.id, dto.month);
  }

  @Get('update-rs-daysoff')
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async updateResourcesWhenSettingDaysOff(@Query() dto: ParamUpdateDayOffDto): Promise<SuccessResponseDto> {
    return await this.resourceService.updateResourcesWhenSettingDaysOff(dto);
  }


  @Get('position-using')
  @Auth([UserNS.Roles.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getAllPositionUsing(
    @Query(new ValidationPipe({ transform: true }))
    paramPositionIdsDto: ParamPositionIdsDto,
  ): Promise<ResourcePositionDto[]> {
    return await this.resourceService.getAllPositionUsing(paramPositionIdsDto);
  }
}
