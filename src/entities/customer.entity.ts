import { AbstractEntity } from '../common/abstract.entity';
import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript';
import { UseDto } from '../decorators/use-dto.decorator';
import { CustomerDto } from '../modules/customers/dto/responses/customer-dto';
import { CustomerNS } from '../modules/customers/interfaces/customer';

@Table({ modelName: 'customers' })
@UseDto(CustomerDto)
export default class CustomerEntity extends AbstractEntity<CustomerDto> {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  email?: string;

  @Column({ type: DataType.STRING })
  phone?: string;

  @Column({ type: DataType.DATE })
  firstContactDate: Date;

  @Column({ type: DataType.TEXT })
  note?: string;

  @Column({ type: DataType.STRING })
  contactPoint?: string;

  @Column({ type: DataType.STRING })
  contactInfo?: string;

  @Column({ type: DataType.STRING })
  status: CustomerNS.CustomerStatus;

  @DeletedAt
  deletedAt: Date;
}
