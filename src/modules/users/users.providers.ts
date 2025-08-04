import { UserProjectService } from '../../modules/user-projects/user-project.service';
import { default as UserEntity } from '../../entities/users.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { UserService } from './users.service';
import { MasterDataService } from '../../modules/master-data/master-data.service';
import { PermissionService } from '../../modules/permission/permission.service';
import { default as UserSalariesEntity } from '../../entities/user-salaries.entity';
import { UserSalaryRepository } from '../../repositories/user-salary.repository';
import { OtherCostService } from '../../modules/other-cost/other-cost.service';
import { UserSalaryService } from '../../modules/user-salary/user-salary.service';

export const userProviders = [
  {
    provide: 'IUserService',
    useClass: UserService,
  },
  {
    provide: 'IUserRepository',
    useClass: UsersRepository,
  },
  {
    provide: 'UserEntity',
    useValue: UserEntity,
  },
  {
    provide: 'IUserProjectService',
    useClass: UserProjectService,
  },
  {
    provide: 'IMasterDataService',
    useClass: MasterDataService,
  },
  {
    provide: 'IPermissionService',
    useClass: PermissionService,
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
    provide: 'IOtherCostService',
    useClass: OtherCostService,
  },
  {
    provide: 'IUserSalaryService',
    useClass: UserSalaryService,
  },
];
