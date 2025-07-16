import { Booking } from 'src/bookings/entities/booking.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Service } from 'src/services/entities/service.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: 'varchar', length: 255 })
  business_name: string; // Business name of the vendor

  @Column({ type: 'varchar', length: 50, nullable: true })
  tax_id?: string; // Tax identification number

  @Column({ type: 'text' })
  business_address: string; // Business address of the vendor

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // Status of the vendor (active, inactive, suspended)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Relation<Profile>; // Reference to the User who is this vendor

  @OneToMany(() => Booking, (booking) => booking.vendor)
  bookings: Relation<Booking[]>;

  @OneToMany(() => Service, (service) => service.vendor, {
    onDelete: 'CASCADE',
  })
  services: Relation<Service[]>;

  @OneToMany(() => Review, (review) => review.vendor)
  reviews: Relation<Review[]>;
}
