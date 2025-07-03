import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    type: String,
    description: 'Customer ID',
    example: '12345',
  })
  @IsString()
  @IsOptional()
  customer_id: string;
  @ApiProperty({
    type: String,
    description: 'Booking ID',
    example: '67890',
  })
  @IsString()
  @IsOptional()
  booking_id: string;
  @ApiProperty({
    type: Number,
    description: 'Rating given by the customer',
    example: 5,
  })
  @IsString()
  rating: number;
  @ApiProperty({
    type: String,
    description: 'Vehicle ID (optional)',
    example: 'vehicle123',
  })
  @IsString()
  @IsOptional()
  vehicle_id?: string; // Optional vehicle ID if the rating is related to a specific vehicle
  @ApiProperty({
    type: String,
    description: 'Service ID (optional)',
    example: 'service123',
  })
  @IsOptional()
  @IsString()
  service_id?: string; // Optional service ID if the rating is related to a specific service
  @ApiProperty({
    type: String,
    description: 'Vendor ID (optional)',
    example: 'vendor123',
  })
  @IsOptional()
  @IsString()
  vendor_id?: string; // Optional vendor ID if the rating is related to a specific vendor
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
