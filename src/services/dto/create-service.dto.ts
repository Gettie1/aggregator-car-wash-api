import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
// import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    type: String,
    description: 'Vendor ID',
    example: 'vendor123',
  })
  @Type(() => Number)
  @IsInt()
  vendorId: number; // ID of the vendor providing the service
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
    type: String,
    description: 'Price of the service',
    example: 29.99,
  })
  @Type(() => Number)
  @IsNumber()
  price: number; // Price of the service
  @ApiProperty({
    type: String,
    description: 'Duration of the service in minutes',
    example: 30,
  })
  @Type(() => Number)
  @IsNumber()
  duration: number; // Duration of the service in minutes
}
