import { Api } from '../../roles/dto/request/create-role-dto';
import { SuccessResponseDto } from '../../../common/dto/success.response.dto';
import { default as PermissionEntity } from '../../../entities/permission.entity';

export namespace PermissionNS {
  export interface IPermissionService {
    getPermissionByRoleId(id: number): Promise<PermissionEntity[]>;
    createPermission(roleId: number, param: Api[]): Promise<SuccessResponseDto>;
    updatePermission(id: number, path: Api[]): Promise<SuccessResponseDto>;
    deletePermission(id: number): Promise<SuccessResponseDto>;
    getPermissionByRoleIdPath(id: number, path: string, method: string): Promise<PermissionEntity | null>;
  }

  export interface IPermissionRepository {
    getPermissionByRoleId(id: number): Promise<PermissionEntity[]>;
    createPermission(roleId: number, param: Api[]): Promise<SuccessResponseDto>;
    updatePermission(id: number, path: Api[]): Promise<SuccessResponseDto>;
    deletePermission(id: number): Promise<SuccessResponseDto>;
    getPermissionByRoleIdPath(id: number, path: string, method: string): Promise<PermissionEntity | null>;
  }
  export enum ACTION {
    ONLY = 'only',
    EXC = 'exc',
    BLOCK = 'block',
  }
}
