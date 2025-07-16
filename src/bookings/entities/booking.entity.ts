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

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: string;

  // @Column('int')
  // duration: number;

  @Column()
  location: string;

  @Column({ type: 'timestamp' })
  scheduled_at: Date;

  @Column()
  status: string; // Status of the booking, e.g., "pending", "confirmed", "completed", "cancelled"

  @Column({ nullable: true })
  payment_status?: string; // Payment status, e.g., "paid", "unpaid"

  @Column({ nullable: true })
  payment_method?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;

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
