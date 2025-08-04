import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentTrackingService } from './payment-tracking.service';
import { PaymentTrackingRepository } from '../../repositories/payment-tracking.repository';
import { PaymentTrackingController } from './payment-tracking.controller';
import { default as PaymentEntity } from '../../entities/payment-tracking.entity';
import { RoleService } from '../../modules/roles/role.service';
import { RoleModule } from '../../modules/roles/role.module';

export const providers = [
  {
    provide: 'IPaymentTrackingService',
    useClass: PaymentTrackingService,
  },
  {
    provide: 'IPaymentTrackingRepository',
    useClass: PaymentTrackingRepository,
  },
  {
    provide: PaymentEntity.name,
    useValue: PaymentEntity,
  },
  {
    provide: 'IRoleService',
    useClass: RoleService,
  },
];

@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [PaymentTrackingController],
  providers: [PaymentTrackingService, ...providers],
  exports: [...providers],
})
export class PaymentTrackingModule {}
