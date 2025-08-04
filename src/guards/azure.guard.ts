/* eslint-disable @typescript-eslint/naming-convention */
import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export function AuthGuard(options?: Partial<{ public: boolean }>): Type<IAuthGuard> {
  const strategies = ['oauth-bearer'];

  if (options?.public) {
    strategies.push('public');
  }

  return NestAuthGuard(strategies);
}
