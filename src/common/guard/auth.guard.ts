import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { CheckExisting } from '../utils/checkExisting';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflect: Reflector,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
  async canActivate(context: ExecutionContext) {
    const checkPublic = this.reflect.get('isPublic', context.getHandler());

    if (checkPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];

    CheckExisting(token, UnauthorizedException, 'You must Login');
    try {
      const decoded = this.jwt.verify(token);
      const user = await this.userService.getUserById(decoded.sub);
      if (user) request.user = user;
    } catch (error) {
      // this.logger.error('User not authorized');
      throw new UnauthorizedException();
    }

    return true;
  }
}
