import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Booking,
      Service,
      Customer,
      Vendor,
      Review,
      Vehicle,
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
