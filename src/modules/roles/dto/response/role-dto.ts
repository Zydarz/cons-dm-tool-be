import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from '../../../../modules/permission/dto/response/permission-dto';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { default as RoleEntity } from '../../../../entities/role.entity';
import { RoleNS } from '../../../../modules/roles/interfaces/role';
export class RoleDto extends AbstractDto {
  @ApiProperty()
  name: string;
  flag_protected: number;
  allDivision: RoleNS.SCOPE;
  permission?: PermissionDto;
  constructor(role: RoleEntity) {
    super(role);
    this.name = role.name;
    this.allDivision = role.allDivision;
    this.flag_protected = role.flag_protected;
    this.permission = role.permission?.toDto();
  }
}
