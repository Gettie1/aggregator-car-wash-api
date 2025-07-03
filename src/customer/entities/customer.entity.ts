import { Booking } from 'src/bookings/entities/booking.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: string; // Unique identifier for the customer

  @Column()
  phone_number: string; // Phone number of the customer

  @Column()
  address: string; // Physical address of the customer

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date; // Timestamp when the customer was created

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date; // Timestamp when the customer was last updated

  @OneToOne(() => Profile, { nullable: false })
  @JoinColumn()
  profile: Relation<Profile>; // Reference to the User who is this customer

  @OneToMany(() => Vehicle, (vehicle) => vehicle.customer)
  vehicles: Relation<Vehicle[]>; // One-to-many relationship with the Vehicle entity

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Relation<Booking[]>; // One-to-many relationship with the Booking entity
}
