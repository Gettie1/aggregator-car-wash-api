// import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ type: String, description: 'Customer ID', example: '12345' })
  @IsString()
  @IsOptional()
  customerId?: string;
  @ApiProperty({ type: String, description: 'service name', example: '67890' })
  @IsString()
  @IsOptional()
  serviceName?: string;
  @ApiProperty({ type: String, description: 'Vendor ID', example: '54321' })
  @IsString()
  @IsOptional()
  vendorName?: string;
  @ApiProperty({ type: String, description: 'Vehicle ID', example: '98765' })
  @IsString()
  @IsOptional()
  vehiclePlateNo?: string;
  // @ApiProperty({
  //   type: String,
  //   description: 'Booking duration in minutes',
  //   example: '60',
  // })
  // @IsString()
  // duration: string;
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
