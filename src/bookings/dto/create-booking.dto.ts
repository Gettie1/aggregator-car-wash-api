// import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ type: String, description: 'Customer ID', example: '12345' })
  @IsString()
  customerId: string;
  @ApiProperty({ type: String, description: 'Service ID', example: '67890' })
  @IsString()
  serviceId: string;
  @ApiProperty({ type: String, description: 'Vendor ID', example: '54321' })
  @IsString()
  vendorId: string;
  @ApiProperty({ type: String, description: 'Vehicle ID', example: '98765' })
  @IsString()
  vehicleId: string;
  @ApiProperty({
    type: Number,
    description: 'Booking duration in minutes',
    example: 60,
  })
  @IsString()
  duration: number;
  @ApiProperty({
    type: String,
    description: 'Booking location',
    example: '123 Main St',
  })
  @IsString()
  location: string;
  @ApiProperty({
    type: String,
    description: 'Booking date and time',
    example: '2023-10-01T10:00:00Z',
  })
  @IsString()
  scheduled_at: Date;
  @ApiProperty({
    type: String,
    description: 'Booking status',
    example: 'pending',
  })
  @IsString()
  status: string;
  @ApiProperty({ type: String, description: 'Payment status', example: 'paid' })
  @IsString()
  payment_status?: string;
  @ApiProperty({
    type: String,
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsString()
  payment_method?: string;
}
