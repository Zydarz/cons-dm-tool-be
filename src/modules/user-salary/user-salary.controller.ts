import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { PageDto } from '../../common/dto/page.dto';
import { UserNS } from '../../modules/users/interface/users';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { IUserSalaryService } from './interface/user-salary.service.interface';
import { UserSalaryDto } from './dto/responses/user-salary.dto';
import { UserSalaryPaggingDto } from './dto/responses/user-salary-paging.dto';
import { CreateSalaryDto } from './dto/requests/create-salary.dto';
import { UpdateSalaryDto } from './dto/requests/update-salary.dto';
import { UserSalaryFilterDto } from './dto/requests/user-salary-filter.dto';
import { UserSalaryPaggingFilterDto } from './dto/requests/user-salary-pagging-filter.dto';
import { CostManagementFilterDto } from './dto/requests/cost-management-filter.dto';
import { FullUpdateSalaryDto } from './dto/requests/full-update-salary.dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { ComputeSalaryParamsDto } from './dto/requests/compute-salary-params.dto';
import { ComputeSalaryDto } from './dto/responses/compute-salary.dto';

@ApiTags('User Salary')
@Controller('user-salary')
export class UserSalaryController {
  constructor(@Inject('IUserSalaryService') private readonly userSalaryService: IUserSalaryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async getSalaries(
    @Query() params: UserSalaryPaggingFilterDto,
  ): Promise<PageDto<UserSalaryPaggingDto>> {
    return await this.userSalaryService.getSalaries(params);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserNS.Roles.ADMIN])
  async createSalary(@Body() createSalaryDto: CreateSalaryDto): Promise<UserSalaryDto> {
    return await this.userSalaryService.createSalary(createSalaryDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async updateSalary(
    @Param('id') salaryId: number,
    @Body() updateSalaryDto: UpdateSalaryDto,
  ): Promise<UserSalaryDto> {
    return await this.userSalaryService.updateSalary(salaryId, updateSalaryDto);
  }

  @Get('cost-management')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async costManagement(
    @Query() costManagementFilterDto: CostManagementFilterDto,
  ): Promise<any> {
    return await this.userSalaryService.getCostManagement(costManagementFilterDto);
  }

  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async defaultUser(
    @Param('id') userId: string,
  ): Promise<UserSalaryPaggingDto> {
    return await this.userSalaryService.getUserDefault(userId);
  }

  @Post('full-update')
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserNS.Roles.ADMIN])
  async fullUpdate(@Body() fullUpdateSalaryDto: FullUpdateSalaryDto): Promise<SuccessResponseDto> {
    return await this.userSalaryService.fullUpdateSalaryDto(fullUpdateSalaryDto);
  }

  @Get('/check-existed')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async checkExisted(
    @Query() params: UserSalaryPaggingFilterDto,
  ): Promise<Boolean> {
    return await this.userSalaryService.checkExisted(params);
  }

  @Get('/compute-salary')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async clientCompute(
    @Query('salaryGross') salaryGross: string,
    @Query('insuranceSalary') insuranceSalary: string,
    @Query('type') type: string,
    @Query('dependentPerson') dependentPerson: string,
  ): Promise<ComputeSalaryDto> {
    return await this.userSalaryService.clientCompute(salaryGross, insuranceSalary, type, dependentPerson);
  }
}
