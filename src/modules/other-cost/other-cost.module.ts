import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../../modules/roles/role.module';
import { OtherCostService } from './other-cost.service';
import { OtherCostRepository } from '../../repositories/other-cost.repository';
import { OtherCostController } from './other-cost.controller';
import {default as OtherCostEntity} from '../../entities/other-cost.entity';
import { UserSalaryRepository } from '../../repositories/user-salary.repository';
import { UserSalaryModule } from '../../modules/user-salary/user-salary.module';
import { MasterDataRepository } from '../../repositories/masterdata.repository';
import { MasterDataModule } from '../../modules/master-data/master-data.module';
const providers = [
  {
    provide: 'IOtherCostService',
    useClass: OtherCostController,
  },
  {
    provide: 'IOtherCostService',
    useClass: OtherCostService,
  },
  {
    provide: 'IOtherCostRepository',
    useClass: OtherCostRepository,
  },
  {
    provide: OtherCostEntity.name,
    useValue: OtherCostEntity,
  },
  {
    provide: 'UserSalaryRepository',
    useClass: UserSalaryRepository,
  },
  {
    provide: 'MasterDataRepository',
    useClass: MasterDataRepository,
  }

];
@Module({
  imports: [DatabaseModule, RoleModule, forwardRef(() => UserSalaryModule), forwardRef(() => MasterDataModule)],
  controllers: [OtherCostController],
  providers: [...providers],
  exports: [...providers]
})
export class OtherCostModule {}
