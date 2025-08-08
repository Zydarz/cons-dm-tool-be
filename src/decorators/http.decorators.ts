import type { PipeTransform } from '@nestjs/common';
import { applyDecorators, Param, ParseUUIDPipe, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserNS } from '../modules/users/interface/users';

import { AuthGuard } from '../guards/azure.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
import { GoogleGuard } from '../guards/google.guard';

export function Auth(roles: UserNS.Roles[] = [], options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublicRoute = options?.public;
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GoogleGuard, RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}

export function UUIDParam(property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
