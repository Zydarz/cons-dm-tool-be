import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserNS } from '../../modules/users/interface/users';
import { Auth } from '../../decorators/http.decorators';
import { MasterDataNS } from './master-data';
import { MasterDataOptionDto } from './dtos/responses/master-data-option.dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { MasterDataDto, SettingOtherCostDto } from './dtos/master-data.dto';
import { HandleMasterDataDto } from './dtos/requests/handle-master-data.dto';
import { ListMasterDataDto } from './dtos/requests/list-master-data.dto';
import { PageDto } from '../../common/dto/page.dto';
import { UpdateDepartmentDto } from './dtos/requests/update-department.dto';
import { CreateMasterDataDto } from './dtos/requests/create-master-data.dto';
import { LineUsingDto } from '../../modules/users/dto/response/line-using-dto';
import { RoleUsingDto } from '../../modules/users/dto/response/role-using-dto';
import { DepartmentUsingDto } from '../../modules/users/dto/response/department-using-dto';
import { CreateSettingOtherCostDto } from './dtos/requests/create-setting-other-cost.dto';
import { FilterDepartmentDto } from './dtos/requests/filter-department.dto';

@ApiTags('Master Data')
@Controller('master-data')
export class MasterDataController {
  constructor(@Inject('IMasterDataService') private readonly masterDataService: MasterDataNS.IMasterDataService,
    @Inject('IUserService') private readonly userService: UserNS.IUserService,) { }

  @Auth(UserNS.ALL)
  @Get('list-master-data/:type')
  async getContractTypes(
    @Query(new ValidationPipe({ transform: true }))
    dto: ListMasterDataDto,
    @Param('type') type: MasterDataNS.MasterDataCodeList,
  ): Promise<PageDto<MasterDataDto>> {
    return await this.masterDataService.getMasterDataList(type, dto);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Post('handle-master-data')
  async handleContractTypeData(@Body() dto: HandleMasterDataDto): Promise<SuccessResponseDto> {
    return await this.masterDataService.handleMasterData(dto);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('master-data-summary')
  async getMasterDataSummary(): Promise<MasterDataOptionDto[]> {
    return await this.masterDataService.getMasterDataSummary();
  }

  @Auth(UserNS.ALL)
  @Get('department')
  async getDepartment(@Query() params: FilterDepartmentDto): Promise<MasterDataDto[]> {
    return await this.masterDataService.getDepartment(params);
  }
  @Auth([UserNS.Roles.ADMIN])
  @Post('department')
  async createDepartment(@Body() param: CreateMasterDataDto): Promise<MasterDataDto> {
    return await this.masterDataService.createtDepartment(param);
  }
  @Auth([UserNS.Roles.ADMIN])
  @Put('department/:id')
  async updateDepartment(@Param('id') id: number, @Body() param: UpdateDepartmentDto): Promise<MasterDataDto> {
    return await this.masterDataService.updateDepartment(id, param);
  }
  @Auth([UserNS.Roles.ADMIN])
  @Delete('department/:id')
  async deleteDepartment(@Param('id') id: number): Promise<SuccessResponseDto> {
    return await this.masterDataService.deleteDepartment(id);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('/line-using')
  async getLineUsing(): Promise<LineUsingDto[]> {
    return await this.userService.getLineUsing();
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('/role-using')
  async getRoleUsing(): Promise<RoleUsingDto[]> {
    return await this.userService.getRoleUsing();
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('/department-using')
  async getDepartmentUsing(): Promise<DepartmentUsingDto[]> {
    return await this.userService.getDepartmentUsing();
  }
  @Auth([UserNS.Roles.ADMIN])
  @Get('/other-cost')
  async getSettingOtherCost(): Promise<SettingOtherCostDto[]> {
    return await this.masterDataService.getSettingOtherCost();
  }

  @Auth([UserNS.Roles.ADMIN])
  @Post('/other-cost')
  async createSettingOtherCost(@Body() params: CreateSettingOtherCostDto): Promise<SuccessResponseDto> {
    return await this.masterDataService.createSettingOtherCost(params);
  }


  @Auth(UserNS.ALL)
  @Get('status-bidding')
  async getProjectStatusBidding(@Query() params: FilterDepartmentDto): Promise<MasterDataDto[]> {
    return await this.masterDataService.getProjectStatusBidding(params);
  }

  @Auth(UserNS.ALL)
  @Get('status-development')
  async getProjectStatusDevelopment(@Query() params: FilterDepartmentDto): Promise<MasterDataDto[]> {
    return await this.masterDataService.getProjectStatusDevelopment(params);
  }

  
  @Auth(UserNS.ALL)
  @Get('task-status')
  async getTaskStatus(@Query() params: FilterDepartmentDto): Promise<MasterDataDto[]> {
    return await this.masterDataService.getTaskStatus(params);
  }
}
