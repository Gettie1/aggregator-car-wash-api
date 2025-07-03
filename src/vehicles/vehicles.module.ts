import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Customer, Vehicle, Review, Booking]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
