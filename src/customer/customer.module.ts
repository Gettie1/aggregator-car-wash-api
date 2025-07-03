import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Customer, Vehicle, Profile, Booking, Service]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
