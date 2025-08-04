import { Inject, Injectable } from '@nestjs/common';
import { Api } from '../roles/dto/request/create-role-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { PermissionNS } from './interfaces/permission';
import { default as PermissionEntity } from '../../entities/permission.entity';

@Injectable()
export class PermissionService implements PermissionNS.IPermissionService {
  constructor(
    @Inject('IPermissionRepository') private readonly permissionRepository: PermissionNS.IPermissionRepository,
  ) {}

  async getPermissionByRoleId(id: number): Promise<PermissionEntity[]> {
    return await this.permissionRepository.getPermissionByRoleId(id);
  }

  async createPermission(roleId: number, param: Api[]): Promise<SuccessResponseDto> {
    return await this.permissionRepository.createPermission(roleId, param);
  }

  async updatePermission(id: number, path: Api[]): Promise<SuccessResponseDto> {
    return await this.permissionRepository.updatePermission(id, path);
  }

  async deletePermission(id: number): Promise<SuccessResponseDto> {
    return await this.permissionRepository.deletePermission(id);
  }

  async getPermissionByRoleIdPath(id: number, path: string, method: string): Promise<PermissionEntity | null> {
    return await this.permissionRepository.getPermissionByRoleIdPath(id, path, method);
  }
}
