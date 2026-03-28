import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class QueryTourDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Page number',
        default: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Items per page',
        default: 10
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        example: 'antaliya',
        description: 'Search by destination, region, description',
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    search?: string;

    @ApiPropertyOptional({
        example: 300, 
        description: 'Min price'
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({
        example: 1500,
        description:'Max price'
    })
    @IsOptional()
    @Type(()=> Number)
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    maxPrice?: number;

}