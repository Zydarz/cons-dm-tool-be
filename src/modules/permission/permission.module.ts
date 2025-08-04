import { forwardRef, Module } from '@nestjs/common';
import { RoleModule } from '../roles/role.module';
import { DatabaseModule } from '../../database/database.module';
import { default as PermissionEntity } from '../../entities/permission.entity';
import { PermissionRepository } from '../../repositories/permission.repository';
import { PermissionService } from './permission.service';

const providers = [
  {
    provide: 'IPermissionService',
    useClass: PermissionService,
  },
  {
    provide: 'IPermissionRepository',
    useClass: PermissionRepository,
  },
  {
    provide: PermissionEntity.name,
    useValue: PermissionEntity,
  },
];

@Module({
  imports: [DatabaseModule, forwardRef(() => RoleModule)],
  providers: [...providers],
  exports: [...providers],
})
export class PermissionModule {}
