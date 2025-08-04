import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from '../../../../modules/permission/dto/response/permission-dto';
import { default as RoleEntity } from '../../../../entities/role.entity';
import { RoleDto } from './role-dto';
export class RoleDetailDto {
  @ApiProperty()
  role: RoleDto;
  permission: PermissionDto[];
  constructor(role: RoleEntity, permission: PermissionDto[]) {
    this.role = role.toDto();
    this.permission = permission;
  }
}
