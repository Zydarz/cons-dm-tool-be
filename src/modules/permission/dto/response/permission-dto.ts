import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { default as PermissionEntity } from '../../../../entities/permission.entity';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { RoleDto } from '../../../roles/dto/response/role-dto';
import { PermissionNS } from '../../interfaces/permission';
export class PermissionDto extends AbstractDto {
  @ApiProperty()
  path: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  action: PermissionNS.ACTION;

  @ApiProperty()
  roleId: number;

  @ApiPropertyOptional()
  readonly role?: RoleDto;

  constructor(permission: PermissionEntity) {
    super(permission);
    this.path = permission.path;
    this.method = permission.method;
    this.roleId = permission.roleId;
    this.name = permission.name;
    this.action = permission.action;
    //this.role = permission.role?.toDto();
  }
}
