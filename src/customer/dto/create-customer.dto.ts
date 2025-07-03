import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ type: String, description: 'Customer ID', example: '12345' })
  @IsString()
  profileId: string;
  @ApiProperty({ type: String, description: 'Customer Phone Number' })
  @IsString()
  phoneNumber: string; // Phone number of the customer
  @ApiProperty({
    type: String,
    description: 'Address of the customer',
    example: '123 Main St, City, Country',
  })
  @IsString()
  address: string; // Physical address of the customer
  @ApiProperty({
    type: String,
    description: 'Vehicle ID associated with the customer',
    example: '67890',
  })
  @IsString()
  vehicle_id: string; // ID of the vehicle associated with the customer
}
