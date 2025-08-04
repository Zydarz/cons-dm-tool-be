import { Inject, Injectable } from '@nestjs/common';
import { PermissionNS } from '../../modules/permission/interfaces/permission';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateRoleDto } from './dto/request/create-role-dto';
import { UpdateRoleDto } from './dto/request/update-role-dto';
import { RoleNS } from './interfaces/role';
import { RoleResponseDto } from './dto/response/role-response-dto';
import { Routes } from '../../common/constants/menu-routes';
import { default as RoleEntity } from '../../entities/role.entity';
import { RoleDetailDto } from './dto/response/role-detail-dto';
import { isEmpty, isNil } from 'lodash';
import { UserNS } from '../../modules/users/interface/users';
import { ResponseDeleteDto } from './dto/response/response-delete-dto';
import { DeleteRoleDto } from './dto/request/confirm-delete-role-dto';

@Injectable()
export class RoleService implements RoleNS.IRoleService {
  constructor(
    @Inject('IRoleRepository') private readonly roleRepository: RoleNS.IRoleRepository,
    @Inject('IPermissionService') private readonly permissionService: PermissionNS.IPermissionService,
    @Inject('IUserService') private readonly userService: UserNS.IUserService,
  ) {}

  async getAll(): Promise<RoleResponseDto[]> {
    const role = await this.roleRepository.getAll();
    const roleResponse = await Promise.all(
      role.map(async (r) => {
        const permission = await this.permissionService.getPermissionByRoleId(r.id);
        return new RoleResponseDto(r, permission);
      }),
    );
    return roleResponse;
  }

  async getRoleById(id: number): Promise<RoleEntity | null> {
    return await this.roleRepository.getRoleById(id);
  }

  async getPermissionById(id: number): Promise<RoleDetailDto> {
    const role = await this.roleRepository.getRoleById(id);
    if (isNil(role)) {
      throw RoleNS.ERRORS.RoleNotFound;
    }
    const permission = await this.permissionService.getPermissionByRoleId(id);
    return new RoleDetailDto(role, permission);
  }

  async createRole(dto: CreateRoleDto): Promise<SuccessResponseDto> {
    const role = await this.roleRepository.createRole(dto);
    return await this.permissionService.createPermission(role.id, dto.api);
  }

  async updateRole(id: number, dto: UpdateRoleDto): Promise<SuccessResponseDto> {
    await this.roleRepository.updateRole(id, dto);
    return await this.permissionService.updatePermission(id, dto.api);
  }

  async deleteRole(id: number): Promise<SuccessResponseDto | ResponseDeleteDto> {
    const role = await this.getRoleById(id);
    if (isNil(role)) {
      throw RoleNS.ERRORS.RoleNotFound;
    }
    const users = await this.userService.getUserByRoleId(id);
    if (!isEmpty(users)) {
      return {
        role: role.toDto(),
        count: users.length,
      } as ResponseDeleteDto;
    }
    await this.roleRepository.deleteRole(id);
    return await this.permissionService.deletePermission(id);
  }
  async comfirmDeleteRole(dto: DeleteRoleDto): Promise<SuccessResponseDto> {
    await this.userService.updateRoleId(dto);
    await this.roleRepository.deleteRole(dto.oldRoleId);
    return await this.permissionService.deletePermission(dto.oldRoleId);
  }
  getAllRouter() {
    return Routes;
  }
}
