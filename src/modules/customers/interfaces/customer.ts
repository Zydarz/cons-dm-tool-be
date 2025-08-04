import { ConflictException, NotFoundException } from '@nestjs/common';
import { default as CustomerEntity } from '../../../entities/customer.entity';
import { PageDto } from '../../../common/dto/page.dto';
// eslint-disable-next-line import/namespace
import { CustomerDto } from '../dto/responses/customer-dto';
import { CreateCustomerDto } from '../dto/requests/create-customer-dto';
import { CustomerFilterDto } from '../dto/requests/customer-filter-dto';
import { UpdateCustomerDto } from '../dto/requests/update-customer-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { Transaction } from 'sequelize';

export namespace CustomerNS {
  export interface ICustomerService {
    getAll(customerFilterDto: CustomerFilterDto): Promise<PageDto<CustomerDto>>;
    getCustomerById(id: number): Promise<boolean>;
    createCustomer(customerDto: CreateCustomerDto): Promise<CustomerDto>;
    getCustomerDetail(id: number): Promise<CustomerDto>;
    updateCustomer(id: number, payload: UpdateCustomerDto): Promise<CustomerDto>;
    deleteCustomer(id: number): Promise<SuccessResponseDto>;
    getProjectsOfCustomer(customerId: number): Promise<unknown>;
  }

  export interface ICustomerRepository {
    getAll(customerFilterDto: CustomerFilterDto): Promise<PageDto<CustomerDto>>;
    findByPk(id: number): Promise<CustomerEntity | null>;
    createCustomer(customerDto: CreateCustomerDto): Promise<CustomerDto>;
    updateCustomer(id: number, payload: UpdateCustomerDto): Promise<CustomerDto>;
    deleteCustomer(id: number, t?: Transaction): Promise<SuccessResponseDto>;
  }

  export const errMsg = {
    CustomerNotFound: new NotFoundException('Customer Not Found'),
    CustomerExisted: new ConflictException('Customer Existed'),
  };

  export enum CustomerStatus {
    Active = 'Active',
    Inactive = 'Inactive',
  }
}
