import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Review } from 'src/reviews/entities/review.entity';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Profile } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Service, Booking, Vendor, Review, Profile]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
