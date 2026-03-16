import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'abdujabborsharobiddinov5@gmail.com',
    description: 'Admin email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SamsungA52!',
    description: 'Admin password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
