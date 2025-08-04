import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  Body,
  Post,
  Put,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { UserNS } from './interface/users';
import { UserDto } from './dto/response/user-dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { default as UserEntity } from '../../entities/users.entity';
import { CreateUserDto } from './dto/request/create-user-dto';
import { UpdateUserDto } from './dto/request/update-user-dto';
import { SuccessResponseDto } from './../../common/dto/success.response.dto';
import { UserSearchDto } from './dto/request/user-search.dto';
import { UserDivition } from './dto/request/user-search-division.dto';
import { PageDto } from '../../common/dto/page.dto';
import { MasterDataDto } from '../../modules/master-data/dtos/master-data.dto';
import { MasterDataNS } from '../../modules/master-data/master-data';
import { ListMasterDataDto } from '../../modules/master-data/dtos/requests/list-master-data.dto';
import { HandleMasterDataDto } from '../../modules/master-data/dtos/requests/handle-master-data.dto';
import { MasterDataOptionDto } from '../../modules/master-data/dtos/responses/master-data-option.dto';
import { LineUsingDto } from './dto/response/line-using-dto';
import { SalaryDto } from './dto/response/salary-dto';
import { GetSalaryDto } from './dto/request/get-salary-dto';
import { GetSalaryCostDto } from './dto/request/get-salary-cost-dto';
import { UserForSalaryCostDto } from './dto/response/users-for-salary-cost';
import { CheckExitsEmployeeDto } from './dto/request/check-exits-employe-dto';
import { FilterDepartmentDto } from '../../modules/master-data/dtos/requests/filter-department.dto';
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,
    @Inject('IMasterDataService')
    private readonly masterDataService: MasterDataNS.IMasterDataService,
  ) {}

  @Get('/division')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  searchUsersDivision(
    @Query() search: UserDivition,
    @AuthUser() user: UserEntity,
  ): Promise<UserDto[] | PageDto<UserDto>> {
    return this.userService.getUserDepartment(search, user);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('/salary')
  async getUserSalary(@Query() param: GetSalaryDto): Promise<object> {
    return this.userService.getUserSalary(param);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('/all-for-salary-cost')
  async getUserSalaryCost(@Query() param: GetSalaryCostDto): Promise<UserForSalaryCostDto[]> {
    return this.userService.getUserForSalaryCost(param);
  }

  @Delete('/department-salaries/:id/:year/:month')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  deleteDepartmentSalaries(@Param('id') id: string,@Param('month') month: number,@Param('year') year: number): Promise<SuccessResponseDto> {
    return this.userService.deleteDepartmentSalaries(id, year, month);
  }

  @Auth([UserNS.Roles.ADMIN])
  @Get('/salary/count-user')
  async getCountUserSalary(@Query() param: GetSalaryDto): Promise<Number> {
    return this.userService.getCountUserSalary(param);
  }

  @Get('/me')
  @Auth(UserNS.ALL)
  @HttpCode(HttpStatus.OK)
  getCurrentUserInfor(@AuthUser() user: UserEntity): Promise<UserDto> {
    return this.userService.getUserByEmail(user.mail);
  }


  @Get('check-employee-existed')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async checkEmployeeExisted(
    @Query() param: CheckExitsEmployeeDto,
  ): Promise<Boolean> {
    return await this.userService.checkEmployeeExisted(param);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  getUserByID(@Param('id') id: string, @Query('store') store: UserNS.UserStore): Promise<UserDto> {
    if (!store) {
      return this.userService.getUser(id, UserNS.UserStore.AZURE);
    }
    return this.userService.getUser(id, store, 'project');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  searchUsers(@Query() search: UserSearchDto, @AuthUser() user: UserEntity): Promise<UserDto[]> {
    return this.userService.getAllUser(search, user);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  createUser(@Body() param: CreateUserDto): Promise<UserDto> {
    return this.userService.createUser(param);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  updateUser(@Param('id') id: string, @Body() param: UpdateUserDto): Promise<UserDto> {
    return this.userService.updateUser(id, param);
  }

  @Put('/update/:email')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  updateUserByEmail(@Param('email') email: string, @Body() param: UpdateUserDto): Promise<UserDto> {
    return this.userService.updateUserByEmail(email, param);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  deleteUser(@Param('id') id: string): Promise<SuccessResponseDto> {
    return this.userService.deleteUser(id);
  }

  @Auth(UserNS.ALL)
  @Get('department')
  async getDepartment(@Query() params: FilterDepartmentDto): Promise<MasterDataDto[]> {
    return await this.masterDataService.getDepartment(params);
  }

  @Auth(UserNS.ALL)
  @Get('list-master-data/:type')
  async getContractTypes(
    @Query(new ValidationPipe({ transform: true }))
    dto: ListMasterDataDto,
    @Param('type') type: MasterDataNS.MasterDataCodeList,
  ): Promise<PageDto<MasterDataDto>> {
    return await this.masterDataService.getMasterDataList(type, dto);
  }

  @Auth(UserNS.ALL)
  @Post('handle-master-data')
  async handleContractTypeData(@Body() dto: HandleMasterDataDto): Promise<SuccessResponseDto> {
    return await this.masterDataService.handleMasterData(dto);
  }

  @Auth(UserNS.ALL)
  @Get('master-data-summary')
  async getMasterDataSummary(): Promise<MasterDataOptionDto[]> {
    return await this.masterDataService.getMasterDataSummary();
  }
  @Get('/detail-salaries/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  getUserWithSalariesByID(@Param('id') id: string, @Query() param: GetSalaryDto): Promise<SalaryDto> {
    param.userIds = [id]
    return this.userService.getDetailUserWithSalaries(param);
  }
  @Get('/list/salaries')
  @HttpCode(HttpStatus.OK)
  @Auth(UserNS.ALL)
  getListUserWithSalaries(@Query() param: GetSalaryDto): Promise<PageDto<UserDto>> {
    return this.userService.getListUserWithSalaries(param);
  }

}
