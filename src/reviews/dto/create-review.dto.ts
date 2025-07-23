import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    type: String,
    description: 'Customer ID',
    example: '12345',
  })
  @IsNumber()
  @IsOptional()
  customer_id: number;

  @ApiProperty({
    type: String,
    description: 'Booking ID',
    example: '67890',
  })
  @IsNumber()
  @IsOptional()
  booking_id: number;
  // Optional booking ID if the review is related to a specific booking
  @ApiProperty({
    type: Number,
    description: 'Rating given by the customer',
    example: 5,
  })
  @IsNumber()
  rating: number;

  @ApiProperty({
    type: String,
    description: 'Vehicle ID (optional)',
    example: 'vehicle123',
  })
  @IsNumber()
  @IsOptional()
  vehicle_id?: number; // Optional vehicle ID if the rating is related to a specific vehicle

  @ApiProperty({
    type: String,
    description: 'Service ID (optional)',
    example: 'service123',
  })
  @IsOptional()
  @IsNumber()
  service_id?: number; // Optional service ID if the rating is related to a specific service

  @ApiProperty({
    type: String,
    description: 'Vendor ID (optional)',
    example: 'vendor123',
  })
  @IsOptional()
  @IsNumber()
  vendor_id?: number; // Optional vendor ID if the rating is related to a specific vendor

  @ApiProperty({
    type: String,
    description: 'Comment or feedback from the user',
    example: 'Great service!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
