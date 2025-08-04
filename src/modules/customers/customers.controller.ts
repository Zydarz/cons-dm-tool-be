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
import { ApiTags } from '@nestjs/swagger';
import { PageDto } from '../../common/dto/page.dto';
import { CustomerDto } from './dto/responses/customer-dto';
import { Auth } from '../../decorators/http.decorators';
import { CustomerNS } from './interfaces/customer';
import { UserNS } from '../../modules/users/interface/users';
import { CreateCustomerDto } from './dto/requests/create-customer-dto';
import { CustomerFilterDto } from './dto/requests/customer-filter-dto';
import { UpdateCustomerDto } from './dto/requests/update-customer-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';

@ApiTags('Customer')
@Controller('customers')
export class CustomersController {
  constructor(@Inject('ICustomerService') private readonly customerService: CustomerNS.ICustomerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.LOS, UserNS.Roles.ADMIN, UserNS.Roles.MEMBER])
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    customerFilterDto: CustomerFilterDto,
  ): Promise<PageDto<CustomerDto>> {
    return await this.customerService.getAll(customerFilterDto);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async createCustomer(@Body() customerDto: CreateCustomerDto): Promise<CustomerDto> {
    return await this.customerService.createCustomer(customerDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS, UserNS.Roles.MEMBER])
  async getCustomerDetail(@Param('id') customerId: number): Promise<CustomerDto> {
    return await this.customerService.getCustomerDetail(customerId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async updateCustomer(@Param('id') customerId: number, @Body() payload: UpdateCustomerDto): Promise<CustomerDto> {
    return await this.customerService.updateCustomer(customerId, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN])
  async deleteCustomer(@Param('id') customerId: number): Promise<SuccessResponseDto> {
    return await this.customerService.deleteCustomer(customerId);
  }

  @Get(':customerId/projects')
  @HttpCode(HttpStatus.OK)
  @Auth([UserNS.Roles.ADMIN, UserNS.Roles.LOS])
  async getProjectsOfCustomer(@Param('customerId') customerId: number): Promise<unknown> {
    return await this.customerService.getProjectsOfCustomer(customerId);
  }
}
