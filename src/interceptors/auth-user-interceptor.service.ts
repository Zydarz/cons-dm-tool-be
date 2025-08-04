import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common';

// import type { UserEntity } from '../modules/user/user.entity';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle();
  }
}
