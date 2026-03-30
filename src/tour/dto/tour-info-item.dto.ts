import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class TourInfoItemDto {

    @ApiProperty({
        example: 'Aviachipta',
        description: "Ma'lumot (O'zbekcha)",
        maxLength: 300,
    })
    @IsString()
    @MaxLength(300)
    uz: string;

    @ApiProperty({
        example: 'Авиабилет включен',
        description: 'Информация (на русском)',
        maxLength: 300,
    })
    @IsString()
    @MaxLength(300)
    ru: string;

}