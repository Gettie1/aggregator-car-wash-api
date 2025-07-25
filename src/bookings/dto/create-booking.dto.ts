// import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  MOBILE_MONEY = 'mobile_money',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class CreateBookingDto {
  @ApiProperty({ type: String, description: 'Customer ID', example: 123 })
  @IsNumber()
  @IsOptional()
  customerId?: number;
  @ApiProperty({
    type: String,
    description: 'service name',
    example: 'Car Wash',
  })
  @IsString()
  @IsOptional()
  serviceName?: string;
  @ApiProperty({
    type: String,
    description: 'Vendor Name',
    example: "June's Car Wash",
  })
  @IsString()
  @IsOptional()
  vendorName?: string;
  @ApiProperty({
    type: String,
    description: 'Vehicle Plate Number',
    example: '98765',
  })
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
  // @ApiProperty({
  //   type: String,
  //   description: 'Booking location',
  //   example: '123 Main St',
  // })
  // @IsString()
  // location: string;
  @ApiProperty({
    type: String,
    description: 'Booking date and time',
    example: '2023-10-01T10:00:00Z',
  })
  @IsString()
  scheduled_at: Date;
  // @ApiProperty({
  //   type: String,
  //   description: 'Booking status',
  //   example: 'pending',
  // })
  // @IsString()
  // status: string;
  // @ApiProperty({ type: String, description: 'Payment status', example: 'paid' })
  // @IsEnum(PaymentStatus)
  // payment_status?: PaymentStatus;
  @ApiProperty({
    type: String,
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsEnum(PaymentMethod)
  payment_method?: PaymentMethod;
}
