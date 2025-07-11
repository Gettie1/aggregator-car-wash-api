import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/profile.entity'; // Importing the Role enum from user entity
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    type: String,
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string; // First name of the user
  @ApiProperty({
    type: String,
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string; // Last name of the user
  @ApiProperty({
    type: String,
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phone: string;
  @ApiProperty({
    type: String,
    description: 'Password for the user account',
    example: 'securepassword123',
  })
  @IsString()
  password: string;
  @ApiProperty({
    type: String,
    description: 'Email address of the user',
    example: 'john@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string; // Email address of the user
  @ApiProperty({
    type: String,
    description: 'Role of the user',
    example: 'customer',
  })
  @IsEnum(Role, { message: 'Role must be customer,vendor or admin' })
  role: Role = Role.CUSTOMER; // Role of the user, e.g., "customer", "vendor", "admin"
}
