import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { DatabaseModule } from '../../database/database.module';
import { CustomerRepository } from '../../repositories/customer.repository';
import { default as CustomerEntity } from '../../entities/customer.entity';
import { PaymentTrackingModule } from '../../modules/payment-tracking/payment-tracking.module';
import { PermissionModule } from '../../modules/permission/permission.module';

const providers = [
  {
    provide: 'ICustomerService',
    useClass: CustomersService,
  },
  {
    provide: 'ICustomerRepository',
    useClass: CustomerRepository,
  },
  {
    provide: CustomerEntity.name,
    useValue: CustomerEntity,
  },
];
@Module({
  imports: [DatabaseModule, PaymentTrackingModule, PermissionModule],
  providers: [...providers],
  controllers: [CustomersController],
  exports: [...providers],
})
export class CustomersModule {}
