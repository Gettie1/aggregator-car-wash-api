import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    type: String,
    description: 'Email of the user',
    example: 'admin@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
    description: 'Password of the user',
    example: 'admin123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
