import { Booking } from 'src/bookings/entities/booking.entity';
import { Review } from 'src/reviews/entities/review.entity';
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

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for the service

  @Column()
  name: string; // Name of the service

  @Column()
  description: string; // Description of the service

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Price of the service

  @Column('int')
  duration: number; // Duration of the service in minutes

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date; // Timestamp when the service was created

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date; // Timestamp when the service was last updated

  @ManyToOne(() => Vendor, (vendor) => vendor.services)
  @JoinColumn()
  vendor: Relation<Vendor>; // Many-to-one relationship with the Vendor entity

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Relation<Booking[]>; // One-to-many relationship with the Booking entity
  @OneToMany(() => Review, (review) => review.service)
  reviews: Relation<Review[]>;
}
