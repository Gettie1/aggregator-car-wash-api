import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Service } from 'src/services/entities/service.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customer_id?: number;

  @Column()
  booking_id?: number; // Foreign key to Booking

  @Column({ nullable: true })
  vehicle_id?: number; // Optional foreign key to Vehicle

  @Column()
  service_id?: number; // Optional foreign key to Service

  @Column()
  vendor_id?: number; // Optional foreign key to Vendor

  @Column({ type: 'int' })
  rating: number; // Rating value, e.g., 1 to 5 stars

  @Column({ type: 'text', nullable: true })
  comment?: string; // Optional comment or feedback from the user

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Relation<Booking>; // Booking being rated

  @ManyToOne(() => Customer, (customer) => customer.reviews, {
    eager: false,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Relation<Customer>; // Optional customer who made the review

  @ManyToOne(() => Vehicle, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Relation<Vehicle>; // Optional vehicle being rated

  @ManyToOne(() => Service, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_id' })
  service?: Relation<Service>; // Optional service being rated

  @ManyToOne(() => Vendor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vendor_id' })
  vendor?: Relation<Vendor>; // Optional vendor being rated
}
