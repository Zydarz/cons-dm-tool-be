import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from '../../../../modules/permission/dto/response/permission-dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as RoleEntity } from '../../../../entities/role.entity';
import { RoleNS } from '../../../../modules/roles/interfaces/role';
export class RoleResponseDto extends AbstractDto {
  @ApiProperty()
  name: string;
  permission?: PermissionDto[];
  allDivivision: RoleNS.SCOPE;
  constructor(role: RoleEntity, permission?: PermissionDto[]) {
    super(role);
    this.name = role.name;
    this.permission = permission;
    this.allDivivision = role.allDivision;
  }
}
