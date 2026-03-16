import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Abdulloh',
    description: 'Author first name',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    example: 'Karimov',
    description: 'Author last name',
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: 'Turga juda yaxshi dam oldim! Mehmonxona a\'lo darajada edi. Keyingi safar ham boraman.',
    description: 'Comment text / review',
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the tour being reviewed',
  })
  @IsUUID()
  tourId: string;
}
