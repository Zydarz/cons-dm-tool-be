import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { RoleNS } from '../../../../modules/roles/interfaces/role';
import { Api } from './create-role-dto';

export class UpdateRoleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsEnum(RoleNS.SCOPE)
  @IsOptional()
  allDivision: RoleNS.SCOPE;

  @ApiProperty()
  @IsArray()
  @Type(() => Api)
  @IsOptional()
  api: Api[];
}
