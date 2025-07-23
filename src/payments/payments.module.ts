import { Module } from '@nestjs/common';
// import { PaymentsService } from './payments.service';
// import { PaymentsController } from './payments.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Payment, Booking, Profile]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
