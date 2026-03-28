import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'a@gmail.com',
    description: 'Admin email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'kamalov',
    description: 'Admin password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
