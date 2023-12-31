import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types/enum/roles';
import { CheckExisting } from '../utils/checkExisting';

@Injectable()
export class Roles implements CanActivate {
  constructor(private reflect: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflect.get<Role[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    CheckExisting(request.user, UnauthorizedException, "User not Exist  in Role Guard");

    const role = request.user.role;

    CheckExisting(roles === role, ForbiddenException, " not match Role");
    return true;
  }
}
