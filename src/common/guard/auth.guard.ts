import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { CheckExisting } from '../utils/checkExisting';
import { WinstonLogger } from '../logging/winston.logger';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new WinstonLogger();
  constructor(
    private readonly reflect: Reflector,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
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
      this.logger.error('User not authorized', ' in Auth guard');
      throw new UnauthorizedException();
    }

    return true;
  }
}
