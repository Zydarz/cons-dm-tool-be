import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserNS } from '../modules/users/interface/users';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GUser } from 'interfaces/IUserGoogle';
import { isNil } from 'lodash';

@Injectable()
export class GoogleGuard implements CanActivate {
  private readonly logger = new Logger(GoogleGuard.name);

  constructor(
    @Inject('IUserService')
    private readonly userService: UserNS.IUserService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization ?? '';

    this.logger.log('Received request for Google authentication.');
    if (!authorization) {
      this.logger.warn('Authorization header missing');
      throw new UnauthorizedException('Authorization header missing');
    }

    let userInfo;
    try {
      this.logger.debug('Sending request to Google OAuth userinfo API');
      userInfo = await firstValueFrom(
        this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: authorization },
        }),
      );
    } catch (err) {
      this.logger.error('Failed to fetch user info from Google', err);
      throw new UnauthorizedException('Invalid Google token');
    }

    if (!userInfo || !userInfo.data) {
      this.logger.warn('Empty user info received from Google');
      return false;
    }

    const data: GUser = userInfo.data;
    const email = data.email ?? '';

    this.logger.debug(`User info fetched: ${email}`);

    // if (!email.includes(UserNS.DOMAIN_USER)) {
    //   this.logger.warn(`Unauthorized domain for email: ${email}`);
    //   throw UserNS.ERRORS.UserNotOmi;
    // }

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
    } else {
      this.logger.debug(`User found: ${user.id}`);
    }

    if (!isNil(user) && isNil(user.idGoogle)) {
      this.logger.debug(`Updating user Google ID for email: ${email}`);
      await this.userService.updateUserIfNeed(data);
    }

    if (
      !user ||
      (user.status !== UserNS.Status.ACTIVE && user.status !== UserNS.Status.INACTIVE)
    ) {
      this.logger.warn(`User is not active or not found: ${email}`);
      throw UserNS.ERRORS.UserNotFound;
    }

    this.logger.log(`User authorized: ${email}`);
    return true;
  }
}
