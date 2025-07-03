import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    type: String,
    description: 'Vendor ID',
    example: 'vendor123',
  })
  @IsString()
  vendorId: string; // ID of the vendor providing the service
  @ApiProperty({
    type: String,
    description: 'Name of the service',
    example: 'Car Wash',
  })
  @IsString()
  name: string; // Name of the service
  @ApiProperty({
    type: String,
    description: 'Description of the service',
    example: 'Full exterior and interior car wash',
  })
  @IsString()
  description: string; // Description of the service
  @ApiProperty({
    type: Number,
    description: 'Price of the service',
    example: 29.99,
  })
  @IsString()
  price: number; // Price of the service
  @ApiProperty({
    type: Number,
    description: 'Duration of the service in minutes',
    example: 30,
  })
  @IsString()
  duration: number; // Duration of the service in minutes
}
