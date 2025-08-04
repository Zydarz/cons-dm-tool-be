import { Module } from '@nestjs/common';
import { PermissionService } from '../../modules/permission/permission.service';
import { default as RoleEntity } from '../../entities/role.entity';
import { RoleService } from './role.service';
import { PermissionModule } from '../../modules/permission/permission.module';
import { RoleController } from './role.controller';
import { DatabaseModule } from '../../database/database.module';
import { RoleRepository } from '../../repositories/role.repository';
import UserEntity from '../../entities/users.entity';

const providers = [
  {
    provide: 'IPermissionService',
    useClass: PermissionService,
  },
  {
    provide: 'IRoleService',
    useClass: RoleService,
  },
  {
    provide: 'IRoleRepository',
    useClass: RoleRepository,
  },
  {
    provide: RoleEntity.name,
    useValue: RoleEntity,
  },
  {
    provide: UserEntity.name,
    useValue: UserEntity,
  },
];

@Module({
  imports: [DatabaseModule, PermissionModule],
  controllers: [RoleController],
  providers: [...providers],
  exports: [...providers],
})
export class RoleModule {}
