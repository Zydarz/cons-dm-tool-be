import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { UserNS } from '../interface/users';
import { UserService } from '../users.service';
import { Request as ExpressRequest, Router } from 'express';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'oauth-bearer') {
  constructor(apiConfig: ApiConfigService, @Inject('IUserService') private readonly userService: UserService) {
    super(apiConfig.azureAADConfig);
  }

  async validate(data) {
    const user = await this.userService.getUserById(data.oid);

    if (!user || (user.status !== UserNS.Status.ACTIVE && user.status !== UserNS.Status.INACTIVE)) {
      throw UserNS.ERRORS.UserNotFound;
    }
    return data;
  }

  getAllRouter(req: ExpressRequest) {
    const router = req.app._router as Router;

    const routes = {};
    for (const layer of router.stack) {
      if (layer.route) {
        const path = layer.route?.path;
        const controller = path.split('/')[3];
        const method = layer.route?.stack[0].method;
        if (!controller) {
          continue;
        }
        if (!routes[controller]) {
          routes[controller] = [{ path, method }];
        } else {
          routes[controller].push({ path, method });
        }
      }
    }
    return routes;
  }
}
