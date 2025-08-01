import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { MailsModule } from 'src/mails/mails.module';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile, // Entity for user profiles
      Vendor, // Entity for vendors, which is related to profile\
    ]),
    MailsModule, // Module for sending emails
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
