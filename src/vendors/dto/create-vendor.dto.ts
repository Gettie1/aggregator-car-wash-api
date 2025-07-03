import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
    description: 'phone number of the vendor',
    example: ' +1234567890',
  })
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
