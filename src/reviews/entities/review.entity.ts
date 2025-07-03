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

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  booking_id: string; // Foreign key to Booking

  @Column()
  vehicle_id?: string; // Optional foreign key to Vehicle

  @Column()
  service_id?: string; // Optional foreign key to Service

  @Column()
  vendor_id?: string; // Optional foreign key to Vendor

  @Column({ type: 'int', width: 1 })
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
