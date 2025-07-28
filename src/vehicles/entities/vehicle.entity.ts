import { Booking } from 'src/bookings/entities/booking.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Review } from 'src/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  make: string; // Manufacturer of the vehicle

  @Column({ type: 'varchar', length: 100 })
  model: string; // Model of the vehicle

  @Column({ type: 'int' })
  year: number; // Year of manufacture

  @Column({ nullable: true })
  image?: string; // Optional image URL of the vehicle

  @Column({ nullable: true })
  color?: string; // Color of the vehicle

  @Column({ type: 'varchar', length: 20, unique: true })
  license_plate: string; // License plate number
  @Column({ type: 'boolean', default: false })
  is_deleted: boolean; // Soft delete flag
  @Column()
  customer_id: string; // Foreign key to Customer

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Customer, (customer) => customer.vehicles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Relation<Booking[]>;
  @OneToMany(() => Review, (review) => review.vehicle)
  reviews: Relation<Review[]>;
}
