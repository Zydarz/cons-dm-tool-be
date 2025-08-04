import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsEnum } from 'class-validator';
import { RoleNS } from '../../../../modules/roles/interfaces/role';
import { PermissionNS } from '../../../../modules/permission/interfaces/permission';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(RoleNS.SCOPE)
  allDivision: RoleNS.SCOPE;

  @ApiProperty()
  @IsArray()
  @Type(() => Api)
  api: Api[];
}

export class Api {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  method: string;

  @ApiProperty()
  @IsEnum(PermissionNS.ACTION)
  action: PermissionNS.ACTION;
}
