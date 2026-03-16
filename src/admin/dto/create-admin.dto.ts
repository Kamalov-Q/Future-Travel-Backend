import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Admin email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Admin password (min 8 chars)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Super Admin', description: 'Admin full name' })
  @IsString()
  name: string;
}
