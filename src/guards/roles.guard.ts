import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _, { isNil } from 'lodash';
import { PermissionNS } from '../modules/permission/interfaces/permission';
import { RoleService } from '../modules/roles/role.service';
import { UserNS } from '../modules/users/interface/users';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('IRoleService') private readonly roleService: RoleService,
    @Inject('IPermissionService') private readonly permissionService: PermissionNS.IPermissionService,
    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /* const route = context.getArgs()[0].route;
    const method = context.getArgs()[0].method; */
    const request = context.switchToHttp().getRequest();
    const userInfo = await firstValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: request.headers.authorization },
      }),
    );
    const email = userInfo?.data.email ?? '';
    const user = await this.userService.getUserByEmail(email);
    if (isNil(user.roleId)) {
      throw new ForbiddenException();
    }
    const role = await this.roleService.getRoleById(user.roleId);
    if (isNil(role)) {
      throw new ForbiddenException();
    }
    /*  const permission = await this.permissionService.getPermissionByRoleIdPath(
      role.id,
      route.path,
      method.toLowerCase(),
    ); */
    const userEntity = await this.userService.getUserById(user.id);
    if (userEntity) {
      request.user = userEntity;
    }
    /* if (permission?.action === PermissionNS.ACTION.EXC) {
      userEntity = await this.userService.updateRoleMember(user.id, UserNS.Roles.ADMIN);
    } else if (permission?.action === PermissionNS.ACTION.BLOCK) {
      userEntity = await this.userService.updateRoleMember(user.id, UserNS.Roles.MEMBER);
    } else {
      userEntity = await this.userService.updateRoleMember(user.id, UserNS.Roles.MEMBER);
    }
    if (userEntity) {
      request.user = userEntity;
    } */
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    return roles.includes(request.user.role as string);
  }
}
