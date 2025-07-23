import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({
    type: String,
    description: 'ID of the profile vendor',
    example: 'vendor123',
  })
  @IsOptional()
  @IsNumber()
  profileId?: number; // ID of the profile associated with the vendor
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
  @IsString()
  @IsOptional()
  lastName?: string; // Last name of the vendor
  @IsString()
  @IsOptional()
  password?: string; // Password for the vendor account (optional)
  @ApiProperty({
    type: String,
    description: 'Email address of the vendor',
    example: 'john@gmail.com',
  })
  @IsString()
  @IsOptional()
  email?: string; // Email address of the vendor
  @IsString()
  @IsOptional()
  phone?: string; // Phone number of the vendor
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
  @IsOptional()
  tax_id?: string; // Tax identification number
  @ApiProperty({
    type: String,
    description: 'Business address of the vendor',
    example: '123 Main St, Springfield, USA',
  })
  @IsString()
  address: string; // Business address of the vendor
  @ApiProperty({
    type: String,
    description: 'Location of the vendor, if applicable',
    example: 'Springfield, USA',
  })
  @IsString()
  @IsOptional()
  location?: string; // Location of the vendor, if applicable
  @ApiProperty({
    type: String,
    description: 'Status of the vendor',
    example: 'active',
  })
  @IsString()
  @IsOptional()
  status?: string; // Status of the vendor (active, inactive, suspended)
}
