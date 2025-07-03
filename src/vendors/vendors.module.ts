import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/reviews/entities/review.entity';
import { Service } from 'src/services/entities/service.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Vendor } from './entities/vendor.entity';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Profile, Booking, Service, Review, Vendor]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
