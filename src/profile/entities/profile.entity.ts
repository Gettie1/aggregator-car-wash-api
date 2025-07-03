import { Exclude } from 'class-transformer';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum Role {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for the profile

  @Column()
  firstName: string; // First name of the user

  @Column()
  lastName: string; // Last name of the user
  @Column({ unique: true })
  email: string; // Unique email address for the user
  @Column()
  @Exclude()
  password: string;
  @Column({ unique: true })
  phone: string; // Unique phone number for the user
  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role; // Role of the user, e.g., "customer", "vendor
  @Exclude()
  @Column({ type: 'text', nullable: true, default: null })
  hashedRefreshToken?: string; // Hashed refresh token for the user

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date; // Timestamp when the profile was created

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date; // Timestamp when the profile was last updated

  @OneToOne(() => Customer, (customer) => customer.profile)
  customer?: Relation<Customer>; // One-to-one relationship with the Customer entity
  @OneToOne(() => Vendor, (vendor) => vendor.profile)
  vendor?: Relation<Vendor>; // One-to-one relationship with the Vendor entity
}
