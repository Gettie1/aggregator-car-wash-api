import { Exclude } from 'class-transformer';
import { Customer } from 'src/customer/entities/customer.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import {
  Column,
  Entity,
  OneToMany,
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
  @Column({ type: 'text', nullable: true })
  image?: string; // Optional image URL for the user profile
  @Column()
  @Exclude()
  password: string;
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true }) // ✅ Added unique constraint
  phone: string; // Unique phone number for the user
  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role; // Role of the user, e.g., "customer", "vendor
  @Exclude()
  @Column({ type: 'text', nullable: true, default: null })
  hashedRefreshToken?: string; // Hashed refresh token for the user
  @Column({ nullable: true, default: false })
  is_deleted?: boolean; // Flag to indicate if the profile is deleted
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

  @OneToMany(() => Payment, (payment) => payment.profile, {
    onDelete: 'CASCADE',
  })
  payments: Payment[];
}
