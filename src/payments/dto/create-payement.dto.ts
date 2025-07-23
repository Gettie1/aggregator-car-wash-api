import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  // IsPhoneNumber,
  IsString,
} from 'class-validator';
import { PaymentMethod } from 'src/bookings/dto/create-booking.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 7 })
  @IsNumber()
  @IsNotEmpty()
  booking_id: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0712345678' })
  @IsString()
  // @IsPhoneNumber('KE')
  phone_number: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MOBILE_MONEY })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
