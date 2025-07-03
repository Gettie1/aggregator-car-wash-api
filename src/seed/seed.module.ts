import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Service } from 'src/services/entities/service.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Vehicle,
      Vendor,
      Service,
      Booking,
      Profile,
      Review,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
