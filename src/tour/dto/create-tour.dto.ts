import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TourInfoItemDto } from './tour-info-item.dto';

export class CreateTourDto {
  // ─── O'zbek tili ─────────────────────────────────────────────────────────────
  @ApiProperty({
    example: "Antaliya",
    description: "Yo'nalish nomi (O'zbekcha)",
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  destinationUz: string;

  @ApiPropertyOptional({
    example:
      "O'rta dengiz sohilidagi go'zal kurort shahri. Hashamatli mehmonxonalar va toza plyajlari bilan mashhur.",
    description: "Tour haqida batafsil tavsif (O'zbekcha)",
  })
  @IsOptional()
  @IsString()
  descriptionUz?: string;

  // ─── Rus tili ─────────────────────────────────────────────────────────────────
  @ApiProperty({
    example: 'Анталия',
    description: 'Название направления (на русском)',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  destinationRu: string;

  @ApiPropertyOptional({
    example:
      'Живописный курортный город на побережье Средиземного моря с роскошными отелями и чистыми пляжами.',
    description: 'Подробное описание тура (на русском)',
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  // ─── Umumiy maydonlar ─────────────────────────────────────────────────────────
  @ApiProperty({
    example: 599,
    description: 'Narx (bir kishi uchun)',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({maxDecimalPlaces: 2})
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 4.9,
    description: 'Baholash',
    default: 5, minimum: 0,
    maximum: 5
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({maxDecimalPlaces: 1})
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: "Tour tarkibidagi qisqa ma'lumotlar (UZ/RU)",
    type: [TourInfoItemDto],
    example: [
      { uz: 'Aviachipta', ru: 'Авиабилет' },
      { uz: 'Mehmonxona', ru: 'Отель' },
      { uz: 'Transfer', ru: 'Трансфер' },
      { uz: 'Nonushta', ru: 'Завтрак' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({each: true})
  @Type(() => TourInfoItemDto)
  info?: TourInfoItemDto[];

  @ApiPropertyOptional({
    example: [
      'https://your-zone.b-cdn.net/tours/antalya.jpg',
      'https://your-zone.b-cdn.net/tours/antalya2.jpg'
    ],
    description: 'Tour rasmlari URL ro`yxati',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({each: true})
  @MaxLength(1000, {each: true})
  imageUrls?: string[];
 
  @ApiPropertyOptional({
    example: true,
    description: 'Tour faol yoki nofaol',
    default: true
  })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
  
}
