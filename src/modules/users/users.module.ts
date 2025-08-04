import { forwardRef, Module } from '@nestjs/common';
import { UserProjectModule } from '../../modules/user-projects/user-project.module';
import { DatabaseModule } from '../../database/database.module';
import { AzureADStrategy } from './auth/aad.strategy';
import { UserController } from './users.controller';
import { userProviders } from './users.providers';
import { MasterDataModule } from '../../modules/master-data/master-data.module';
import { PermissionModule } from '../../modules/permission/permission.module';
import { RoleModule } from '../../modules/roles/role.module';
import { UserSalaryModule } from '../../modules/user-salary/user-salary.module';
import { OtherCostModule } from '../../modules/other-cost/other-cost.module';

@Module({
  imports: [DatabaseModule, UserProjectModule, forwardRef(() => MasterDataModule), forwardRef(() => UserSalaryModule), PermissionModule, RoleModule, OtherCostModule],
  controllers: [UserController],
  providers: [AzureADStrategy, ...userProviders],
  exports: [...userProviders],
})
export class UserModule {}
