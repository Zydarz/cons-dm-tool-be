/* eslint-disable @typescript-eslint/naming-convention */

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
