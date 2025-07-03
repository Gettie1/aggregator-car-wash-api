import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, Role } from 'src/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { KEY } from '../decorators/role.decorator';
import { JWTPayload } from '../strategies/at.strategy';

interface RequestWithUser extends Request {
  user?: JWTPayload;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true; // If no roles are defined, allow access
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.role) {
      return false; // If user is not authenticated or role is not defined, deny access
    }
    const userProfile = await this.profileRepository.findOne({
      where: { id: parseInt(user.sub.toString()) },
      select: ['id', 'role'],
    });
    if (!userProfile) {
      return false; // If user profile is not found, deny access
    }
    return roles.some((role) => userProfile.role === role);
  }
}
