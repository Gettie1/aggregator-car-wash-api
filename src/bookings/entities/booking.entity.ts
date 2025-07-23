import { Customer } from 'src/customer/entities/customer.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Service } from 'src/services/entities/service.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../dto/create-booking.dto';
import { Payment } from 'src/payments/entities/payment.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column('int')
  // duration: number;

  // @Column()
  // location: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number; // Price of the booking

  @Column({ type: 'timestamp', nullable: true })
  scheduled_at?: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus; // Status of the booking, e.g., "pending", "confirmed", "completed", "cancelled"

  @Column({ nullable: true, default: PaymentStatus.PENDING })
  payment_status?: PaymentStatus; // Payment status, e.g., "paid", "unpaid"

  @Column({ nullable: true })
  payment_method?: PaymentMethod;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @ManyToOne(() => Customer, (customer) => customer.bookings)
  @JoinColumn()
  customer: Relation<Customer>; // Many-to-one relationship with the Customer entity

  @ManyToOne(() => Vendor, (vendor) => vendor.bookings)
  @JoinColumn()
  vendor: Relation<Vendor>; // Many-to-one relationship with the Vendor entity

  @ManyToOne(() => Service, (service) => service.bookings)
  @JoinColumn()
  service: Relation<Service>; // Many-to-one relationship with the Service entity

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings)
  @JoinColumn()
  vehicle: Relation<Vehicle>; // Many-to-one relationship with the Vehicle entity

  @OneToMany(() => Review, (review) => review.booking)
  reviews: Relation<Review[]>;
}
