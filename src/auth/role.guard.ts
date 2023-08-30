import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from './role-name.enum';
import { ROLES_KEY } from './role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoleNames = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If there are no required roles, then we allow access
    if (!requiredRoleNames) {
      return true;
    }

    // call AuthGuard in order to ensure user is injected in request
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user || !user.roles) {
      throw new UnauthorizedException(
        'You are not allowed to access this resource',
      );
    }

    const userRoleNames = user.roles.map((role) => role.name);

    return requiredRoleNames.some((role) => userRoleNames.includes(role));
  }
}
