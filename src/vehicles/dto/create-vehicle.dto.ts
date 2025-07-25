import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({
    type: String,
    description: 'Make of the vehicle',
    example: 'Toyota',
  })
  @IsString()
  make: string;
  @ApiProperty({
    type: String,
    description: 'Model of the vehicle',
    example: 'Camry',
  })
  @IsString()
  model: string;
  @ApiProperty({
    type: Number,
    description: 'Year of manufacture',
    example: 2020,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;
  @ApiProperty({
    type: String,
    description: 'Color of the vehicle',
    example: 'Red',
  })
  @IsString()
  color: string;
  @ApiProperty({
    type: String,
    description: 'License plate number',
    example: 'ABC1234',
  })
  @IsString()
  license_plate: string;
  @ApiProperty({
    type: String,
    description: 'Customer ID',
    example: 'customer123',
  })
  @IsNumber()
  customer_id: number;
  @ApiProperty({
    type: String,
    description: 'Image URL of the vehicle',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
