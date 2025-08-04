import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../../modules/roles/role.module';
import { UserSalaryService } from './user-salary.service';
import { UserSalaryRepository } from '../../repositories/user-salary.repository';
import { OtherCostRepository } from '../../repositories/other-cost.repository';
import { UserProjectRepository } from '../../repositories/user-project.repository';
import { default as UserSalariesEntity } from '../../entities/user-salaries.entity';
import { UserModule } from '../../modules/users/users.module';
import { OtherCostModule } from '../../modules/other-cost/other-cost.module';
import { UserProjectModule } from '../../modules/user-projects/user-project.module';
import { UserSalaryController } from './user-salary.controller';
import { UserService } from '../../modules/users/users.service';
const providers = [
  {
    provide: 'IUserSalaryService',
    useClass: UserSalaryService,
  },
  {
    provide: 'IUserSalaryRepository',
    useClass: UserSalaryRepository,
  },
  {
    provide: 'UserSalariesEntity',
    useValue: UserSalariesEntity,
  },
  {
    provide: 'IUserService',
    useClass: UserService,
  },
  {
    provide: 'OtherCostRepository',
    useClass: OtherCostRepository,
  },
  {
    provide: 'UserProjectRepository',
    useClass: UserProjectRepository,
  },
];
@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule), RoleModule, OtherCostModule, UserProjectModule],
  controllers: [UserSalaryController],
  providers: [...providers],
  exports: [...providers],
})
export class UserSalaryModule {}
