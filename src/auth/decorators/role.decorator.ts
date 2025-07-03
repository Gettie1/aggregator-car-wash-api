import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/profile/entities/profile.entity';

export const KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(KEY, roles);
