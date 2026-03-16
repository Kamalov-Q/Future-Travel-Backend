import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tours')
@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // ─── Public endpoints ───────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Get all active tours (public)',
    description: 'Returns all active tours visible to users. No authentication required.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active tours',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          destinationUz: 'Antaliya',
          destinationRu: 'Анталия',
          regionUz: 'Turkiya',
          regionRu: 'Турция',
          price: '599.00',
          currency: 'USD',
          descriptionUz: "O'rta dengiz sohilidagi go'zal kurort shahri.",
          descriptionRu: 'Живописный курортный город на побережье Средиземного моря.',
          imageUrl: 'https://your-zone.b-cdn.net/tours/antalya.jpg',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.tourService.findAll(false);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tour by ID (public)',
    description: 'Returns a single active tour with its approved comments.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Tour found' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  findOne(@Param('id') id: string) {
    return this.tourService.findOneForPublic(id);
  }

  // ─── Admin endpoints ────────────────────────────────────────────────────────

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Create new tour',
    description: 'Creates a new tour. Requires JWT authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tour created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        destinationUz: 'Dubay',
        destinationRu: 'Дубай',
        regionUz: 'BAA',
        regionRu: 'ОАЭ',
        price: '999.00',
        currency: 'USD',
        descriptionUz: "Zamonaviy osmono'par binolar va hashamatli savdo markazlari shahri.",
        descriptionRu: 'Ультрасовременный город с небоскрёбами и роскошными торговыми центрами.',
        imageUrl: 'https://your-zone.b-cdn.net/tours/dubai.jpg',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createTourDto: CreateTourDto) {
    return this.tourService.create(createTourDto);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Get all tours (including inactive)',
    description: 'Returns all tours including inactive ones. Requires JWT authentication.',
  })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, example: true })
  findAllAdmin(@Query('includeInactive') includeInactive?: string) {
    return this.tourService.findAll(includeInactive === 'true');
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Update tour',
    description: 'Updates an existing tour. Requires JWT authentication.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Delete tour',
    description: 'Permanently deletes a tour. Requires JWT authentication.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Tour deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
