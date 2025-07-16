import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AtStrategy } from './strategies/at.strategy';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Profile, Vendor, Customer]),
    JwtModule.register({ global: true }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, RtStrategy, JwtStrategy, AtStrategy],
  exports: [RolesGuard],
})
export class AuthModule {}
