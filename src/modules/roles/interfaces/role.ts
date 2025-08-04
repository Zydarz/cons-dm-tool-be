import { NotFoundException } from '@nestjs/common';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { default as RoleEntity } from '../../../entities/role.entity';
import { CreateRoleDto } from '../dto/request/create-role-dto';
import { UpdateRoleDto } from '../dto/request/update-role-dto';
import { RoleResponseDto } from '../dto/response/role-response-dto';
import { RoleDetailDto } from '../dto/response/role-detail-dto';
import { ResponseDeleteDto } from '../dto/response/response-delete-dto';
import { DeleteRoleDto } from '../dto/request/confirm-delete-role-dto';
export namespace RoleNS {
  export interface IRoleService {
    getAll(): Promise<RoleResponseDto[]>;
    createRole(dto: CreateRoleDto): Promise<SuccessResponseDto>;
    updateRole(id: number, dto: UpdateRoleDto): Promise<SuccessResponseDto>;
    deleteRole(id: number): Promise<SuccessResponseDto | ResponseDeleteDto>;
    comfirmDeleteRole(dto: DeleteRoleDto): Promise<SuccessResponseDto>;
    getAllRouter();
    getRoleById(id: number): Promise<RoleEntity | null>;
    getPermissionById(id: number): Promise<RoleDetailDto>;
  }

  export interface IRoleRepository {
    getAll(): Promise<RoleEntity[]>;
    createRole(dto: CreateRoleDto): Promise<RoleEntity>;
    updateRole(id: number, dto: UpdateRoleDto): Promise<SuccessResponseDto>;
    deleteRole(id: number): Promise<SuccessResponseDto>;
    getRoleById(id: number): Promise<RoleEntity | null>;
  }
  export const ERRORS = {
    RoleNotFound: new NotFoundException('role.not.exist'),
  };
  export enum SCOPE {
    ALL = 'all',
    DIVISION = 'division',
  }
}
