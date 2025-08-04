import { Inject } from '@nestjs/common';
import { Api } from '../modules/roles/dto/request/create-role-dto';
import { SuccessResponseDto } from '../common/dto/success.response.dto';
import { default as PermissionEntity } from '../entities/permission.entity';

export class PermissionRepository {
  constructor(@Inject(PermissionEntity.name) private readonly permissionEntity: typeof PermissionEntity) {}

  async getPermissionByRoleId(id: number): Promise<PermissionEntity[]> {
    const permission = await this.permissionEntity.findAll({
      where: {
        roleId: id,
      },
    });
    return permission.toDtos();
  }

  async createPermission(roleId: number, param: Api[]): Promise<SuccessResponseDto> {
    await Promise.all(
      param.map(async (p) => {
        await this.permissionEntity.create({
          roleId,
          path: p.path,
          method: p.method,
          action: p.action,
          name: p.name,
        });
      }),
    );
    return new SuccessResponseDto(true);
  }

  async updatePermission(id: number, api: Api[]): Promise<SuccessResponseDto> {
    await this.deletePermission(id);
    await this.createPermission(id, api);
    return new SuccessResponseDto(true);
  }

  async deletePermission(id: number): Promise<SuccessResponseDto> {
    await this.permissionEntity.destroy({
      where: {
        roleId: id,
      },
    });
    return new SuccessResponseDto(true);
  }

  async getPermissionByRoleIdPath(id: number, path: string, method: string): Promise<PermissionEntity | null> {
    const permission = await this.permissionEntity.findOne({
      where: {
        roleId: id,
        path,
        method,
      },
    });
    return permission;
  }
}
