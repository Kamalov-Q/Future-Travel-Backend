import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @ApiProperty({
    example: "Turkiya",
    description:
      "Mintaqa/mamlakat nomi (O'zbekcha) — masalan: Turkiya, Misr, Osiyo, BAA, Hind okeani",
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  regionUz: string;

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

  @ApiProperty({
    example: 'Турция',
    description:
      'Регион/страна (на русском) — например: Турция, Египет, Азия, ОАЭ, Индийский океан',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  regionRu: string;

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
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Valyuta kodi',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({
    example: 'https://your-zone.b-cdn.net/tours/antalya.jpg',
    description: 'Tour rasmi URL (Bunny.net CDN dan)',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: "Tour faol holati — false bo'lsa foydalanuvchilarga ko'rinmaydi",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
