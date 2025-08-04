import { Inject } from '@nestjs/common';
import { CreateCustomerDto } from '../modules/customers/dto/requests/create-customer-dto';
import { PageDto } from '../common/dto/page.dto';
import { default as CustomerEntity } from '../entities/customer.entity';
import { CustomerDto } from '../modules/customers/dto/responses/customer-dto';
import { CustomerNS } from '../modules/customers/interfaces/customer';
import { isNil } from 'lodash';
import { CustomerFilterDto } from '../modules/customers/dto/requests/customer-filter-dto';
import { UpdateCustomerDto } from '../modules/customers/dto/requests/update-customer-dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { Transaction } from 'sequelize';

export class CustomerRepository implements CustomerNS.ICustomerRepository {
  constructor(@Inject(CustomerEntity.name) private readonly customerEntity: typeof CustomerEntity) {}

  async getAll(customerFilterDto: CustomerFilterDto): Promise<PageDto<CustomerDto>> {
    const condition = {};

    const order = ['firstContactDate'];

    if (!isNil(customerFilterDto.status)) {
      Object.assign(condition, {
        status: customerFilterDto.status,
      });
    }

    const [items, pageMetaDto] = await this.customerEntity.paginate(customerFilterDto, condition, undefined, order);
    return items.toPageDto(pageMetaDto);
  }

  async findByPk(id: number): Promise<CustomerEntity | null> {
    const customer = await this.customerEntity.findByPk(id);
    return customer;
  }

  async createCustomer(customerDto: CreateCustomerDto): Promise<CustomerDto> {
    const isExisted = await this.customerEntity.findOne({
      where: {
        name: customerDto.name,
      },
    });

    if (!isNil(isExisted)) {
      throw CustomerNS.errMsg.CustomerExisted;
    }

    const customerEntity = await this.customerEntity.create({ ...customerDto });

    return customerEntity.toDto();
  }

  async updateCustomer(id: number, payload: UpdateCustomerDto): Promise<CustomerDto> {
    const customerEntity = await this.findByPk(id);

    if (isNil(customerEntity)) {
      throw CustomerNS.errMsg.CustomerNotFound;
    }

    return (
      await customerEntity.update({
        ...payload,
      })
    ).toDto();
  }

  async deleteCustomer(id: number, t?: Transaction): Promise<SuccessResponseDto> {
    await this.customerEntity.destroy({
      where: {
        id,
      },
      transaction: t,
    });

    return new SuccessResponseDto(true);
  }
}
