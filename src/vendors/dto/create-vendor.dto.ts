import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({
    type: String,
    description: 'ID of the vendor',
    example: 'vendor123',
  })
  @IsString()
  profileId: string; // ID of the profile associated with the vendor
  @ApiProperty({
    type: String,
    description: 'First name of the vendor (optional)',
    example: ' John',
  })
  @IsString()
  @IsOptional()
  firstName?: string; // First name of the vendor (optional)
  @ApiProperty({
    type: String,
    description: 'Last name of the vendor',
    example: 'Doe',
  })
  lastName: string; // Last name of the vendor
  @IsString()
  @IsOptional()
  password?: string; // Password for the vendor account (optional)
  @ApiProperty({
    type: String,
    description: 'Email address of the vendor',
    example: 'john@gmail.com',
  })
  email: string; // Email address of the vendor
  @IsString()
  phone: string; // Phone number of the vendor
  @ApiProperty({
    type: String,
    description: 'Business name of the vendor',
    example: 'Best Car Wash',
  })
  @IsString()
  business_name: string; // Business name of the vendor
  @ApiProperty({
    type: String,
    description: 'Tax identification number of the vendor',
    example: '123-456-789',
  })
  @IsString()
  tax_id?: string; // Tax identification number
  @ApiProperty({
    type: String,
    description: 'Business address of the vendor',
    example: '123 Main St, Springfield, USA',
  })
  @IsString()
  business_address: string; // Business address of the vendor
  @ApiProperty({
    type: String,
    description: 'Status of the vendor',
    example: 'active',
  })
  @IsString()
  status: string; // Status of the vendor (active, inactive, suspended)
}
