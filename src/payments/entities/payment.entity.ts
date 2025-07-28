import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import {
  PaymentMethod,
  PaymentStatus,
} from 'src/bookings/dto/create-booking.dto';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Profile } from 'src/profile/entities/profile.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amount?: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  payment_method: PaymentMethod;

  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  authorization_url: string;

  @Column({ nullable: true })
  paystack_reference: string;

  @Column({ nullable: true })
  paystack_access_code: string;

  @Column({ type: 'timestamp', nullable: true })
  payment_date: Date;

  @ManyToOne(() => Booking, (booking) => booking.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Profile, (profile) => profile.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @CreateDateColumn()
  created_at: Date;
}
