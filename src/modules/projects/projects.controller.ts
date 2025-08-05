import {
  Body,
  Controller,
  Delete,
  forwardRef,
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
import { PageDto } from '../../common/dto/page.dto';
import { ProjectDto } from './dto/responses/project-dto';
import { ProjectNS } from './interfaces/project';
import { ProjectFilterOptionsDto } from './dto/requests/project-filter-options.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { CreateLogWorkDto } from './dto/requests/create-log-work-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateUserProjectDto } from '../../modules/user-projects/dto/requests/create-user-project-dto';
import { LogWorkFilterOptionsDto } from '../../modules/log-works/dto/requests/log-work-filter-options.dto';
import { LogWorkDto } from '../../modules/log-works/dto/responses/log-work-dto';
import { RequestLogWorkDto } from './dto/requests/request-log-work-dto';
import { InformationProjectRequestDto } from './dto/requests/information-project-request.dto';
import { InformationProjectResponseDto } from './dto/responses/information-project-response.dto';
import { CreateProjectDto } from './dto/requests/create-project.dto';
import { UpdateProjectDto } from './dto/requests/update-project.dto';
import { UserNS } from '../../modules/users/interface/users';
import { GetAllResourceSummaryDto } from '../resource-summaries/dtos/requests/get-all-resource-summary.dto';
import { ResourceSummaryMonth } from '../../modules/resource-summaries/dtos/responses/resource-summary-month.dto';
import { UserProjectDto } from '../../modules/user-projects/dto/responses/user-project-dto';
import { CreateProjectSituationDtos } from '../../modules/project-situations/dtos/requests/create-project-situation.dto';
import { ProjectSituationResponseDto } from '../../modules/project-situations/dtos/responses/project-situation.response.dto';
import { DeleteProjectSituationDto } from '../../modules/project-situations/dtos/requests/delete-project-situation.dto';
import { EditProjectSituationDtos } from '../../modules/project-situations/dtos/requests/edit-project-situation.dto';
import { IProjectSituationService } from '../../modules/project-situations/interfaces/project-situation.service.interface';
import { CreatePaymentDto } from '../../modules/payment-tracking/dto/requests/create-payment-tracking.dto';
import { PaymentDto } from '../../modules/payment-tracking/dto/responses/payment-dto';
import { UpdatePaymentDto } from '../../modules/payment-tracking/dto/requests/update-payment-tracking.dto';
import { PaymentNS } from '../../modules/payment-tracking/interfaces/payment-tracking';
import { CustomerFilterDto } from '../../modules/customers/dto/requests/customer-filter-dto';
import { CustomerDto } from '../../modules/customers/dto/responses/customer-dto';
import { CustomerNS } from '../../modules/customers/interfaces/customer';
import { ResourceProjectFilterDto } from '../../modules/resources/dto/requests/resource-project-filter.dto';
import { ProjectPositionResourceAllocateDto } from '../../modules/resources/dto/responses/project-position-res-allocate-dto';
import { ResourceNS } from '../../modules/resources/interfaces/resource';
@ApiTags('Project')
@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject('IProjectService') private readonly projectService: ProjectNS.IProjectService,
    @Inject('IProjectSituationService') private readonly projectSituationService: IProjectSituationService,
    @Inject('IPaymentTrackingService') private readonly paymentTrackingService: PaymentNS.IPaymentTrackingService,
    @Inject('ICustomerService') private readonly customerService: CustomerNS.ICustomerService,
    @Inject(forwardRef(() => 'IResourceService')) private readonly resourceService: ResourceNS.IResourceService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
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

  @Get('/customer')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.LOS, UserNS.Roles.ADMIN, UserNS.Roles.MEMBER])
  async getCustomer(
    @Query(new ValidationPipe({ transform: true }))
    customerFilterDto: CustomerFilterDto,
  ): Promise<PageDto<CustomerDto>> {
    return await this.customerService.getAll(customerFilterDto);
  }

  @Get('list-project')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getProject(
    @AuthUser() user: UserEntity,
    @Query(new ValidationPipe({ transform: true }))
    projectFilterOptionsDto: ProjectFilterOptionsDto,
  ): Promise<ProjectDto[]> {
    if (user.role === UserNS.Roles.MEMBER) {
      projectFilterOptionsDto.userId = user.id;
    }
    return await this.projectService.getInfoAllProject(projectFilterOptionsDto, user);
  }

  @Get('member-project/')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getMember(
    @AuthUser() user: UserEntity,
    @Query('projectId') projectId: number,
  ): Promise<UserProjectDto[] | ProjectDto[]> {
    return await this.projectService.getMemberInProject(user, projectId);
  }

  @Get('information-project')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getInformationProject(
    @Query(new ValidationPipe({ transform: true })) dto: InformationProjectRequestDto,
    @AuthUser() user: UserEntity,
  ): Promise<InformationProjectResponseDto> {
    return await this.projectService.getInformationProject(+dto.projectId, user.id, user.role);
  }

  @Get('resource-summaries')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getAllResourceSummaries(
    @Query(new ValidationPipe({ transform: true }))
    dto: GetAllResourceSummaryDto,
  ): Promise<ResourceSummaryMonth[]> {
    return await this.projectService.getAllResourceSummaries(dto.projectId);
  }

  @Get('resources')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getListProjectResource(
    @Query() resourceProjectFilterDto: ResourceProjectFilterDto,
    @AuthUser() user: UserEntity,
  ): Promise<ProjectPositionResourceAllocateDto[]> {
    return await this.resourceService.getListProjectResource(resourceProjectFilterDto, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async detailProject(@Param('id') id: number, @AuthUser() user: UserEntity): Promise<ProjectDto> {
    return await this.projectService.detailProject2(id, user.id, user.role);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserNS.Roles.ADMIN])
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    return await this.projectService.createProject(createProjectDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async updateProject(
    @Param('id') projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @AuthUser() user: UserEntity,
  ): Promise<ProjectDto> {
    return await this.projectService.updateProject(projectId, updateProjectDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.MEMBER])
  async deleteProject(@Param('id') projectId: number, @AuthUser() user: UserEntity): Promise<SuccessResponseDto> {
    return await this.projectService.deleteProject(projectId, user);
  }

  @Post(':id/log-works')
  @HttpCode(HttpStatus.CREATED)
  @Auth(UserNS.ALL)
  async createLogWork(
    @Param('id') projectId: number,
    @AuthUser() user: UserEntity,
    @Body()
    createLogWorkDto: CreateLogWorkDto,
  ): Promise<SuccessResponseDto> {
    const param: CreateUserProjectDto = {
      userId: user.id,
      projectId,
    };
    return await this.projectService.createLogWork(param, createLogWorkDto, user);
  }

  @Get(':id/log-works')
  @HttpCode(HttpStatus.CREATED)
  @Auth(UserNS.ALL)
  async getLogWork(
    @Param('id') projectId: number,
    @Query(new ValidationPipe({ transform: true }))
    logWorkFilterOptionsDto: LogWorkFilterOptionsDto,
  ): Promise<PageDto<LogWorkDto>> {
    return await this.projectService.getLogWork(projectId, logWorkFilterOptionsDto);
  }

  @Get('log-works/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async getDetailLogWork(@Param('id') logWorkId: number): Promise<LogWorkDto> {
    return await this.projectService.getDetailLogWork(logWorkId);
  }

  @Put('log-works/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async updateLogWork(
    @Param('id') logWorkId: number,
    @Body()
    updateLogWorkDto: RequestLogWorkDto,
    @AuthUser() user: UserEntity,
  ): Promise<SuccessResponseDto> {
    return await this.projectService.updateLogWork(logWorkId, updateLogWorkDto, user);
  }

  @Delete('log-works/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async destroyLogWork(@Param('id') logWorkId: number, @AuthUser() user: UserEntity): Promise<SuccessResponseDto> {
    return await this.projectService.destroyLogWork(logWorkId, user);
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

  @Post('create_project_situation')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async createProjectSituation(
    @AuthUser() user: UserEntity,
    @Body()
    createProjectSitutionDto: CreateProjectSituationDtos,
  ): Promise<ProjectSituationResponseDto[]> {
    const { id, role, username } = user;
    return await this.projectSituationService.createProjectSituation(
      id,
      role as UserNS.Roles,
      createProjectSitutionDto,
      username,
    );
  }

  @Post('delete_project_situation')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async deleteProjectSituion(
    @Query(new ValidationPipe({ transform: true }))
    dto: DeleteProjectSituationDto,
    @AuthUser() user: UserEntity,
  ) {
    const { role, username } = user;
    return await this.projectSituationService.deleteProjectSituation(
      dto.id,
      dto.flag,
      role as UserNS.Roles,
      dto.delete,
      username,
    );
  }

  @Post('edit_project_situation')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  async EditProjectSituion(@Body() dto: EditProjectSituationDtos, @AuthUser() user: UserEntity) {
    const { id, role, username } = user;
    return await this.projectSituationService.editProjectSituation(id, dto, role as UserNS.Roles, username);
  }

  @Post('/payment')
  @HttpCode(HttpStatus.CREATED)
  @Auth(UserNS.ALL)
  async createPayment(@Body() params: CreatePaymentDto, @AuthUser() user: UserEntity): Promise<PaymentDto> {
    console.log(11111);
    return await this.paymentTrackingService.createPayment(params, user);
  }

  @Put('/payment/:id')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async updatePayment(
    @Param('id') id: number,
    @Body() params: UpdatePaymentDto,
    @AuthUser() user: UserEntity,
  ): Promise<PaymentDto> {
    return await this.paymentTrackingService.updatePayment(id, params, user);
  }

  @Delete('/payment/:id')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async destroyPayment(@Param('id') id: number, @AuthUser() user: UserEntity): Promise<SuccessResponseDto> {
    return await this.paymentTrackingService.deletePayment(id, user);
  }

  // @Get(':projectId/salaries')
  // @Auth(UserNS.ALL)
  // @HttpCode(HttpStatus.OK)
  // async getProjectSalaries(
  //   @Param('projectId') projectId: string,
  //   @Query() projectFilterOptionsDto: ProjectFilterOptionsDto,
  // ): Promise<object> {
  //   return await this.projectService.getProjectSalaries(projectId, projectFilterOptionsDto);
  // }

  @Get(':projectId/salaries')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  async getProjectSalaries(
    @Param('projectId') projectId: string,
    @Query() resourceProjectFilterDto: ResourceProjectFilterDto,
    @AuthUser() user: UserEntity,
  ): Promise<object> {
    return await this.projectService.getProjectSalaries(projectId, resourceProjectFilterDto, user);
  }
}
