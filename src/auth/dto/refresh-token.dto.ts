import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";


export class RefreshTokenDto {
    @ApiProperty({
        example: "your_refresh_token_here",
        description: "Refresh token"
    })
    @IsString()
    @MinLength(10)
    refreshToken: string;
}