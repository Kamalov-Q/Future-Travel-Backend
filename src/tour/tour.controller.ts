import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TourService } from './tour.service';
import { QueryTourDto } from './dto/query-tour.dto';

@ApiTags('Tours')
@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) { }

  // ─── Public endpoints ───────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Get all active tours (public)',
    description: 'Returns all active tours visible to users. No authentication required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of active tours',
  })
  findAll(@Query() dto: QueryTourDto) {
    return this.tourService.findAll(dto, false);
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
    return this.tourService.findOne(id);
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateTourDto) {
    return this.tourService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Update tour',
    description: 'Updates an existing tour.'
  })
  @ApiParam({
    name: 'id',
    example: '4505050-50j-fvkdnvd-fkvdfwj-85848'
  })
  @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.tourService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Delete tour',
    description: 'Permanently deletes a tour'
  })
  @ApiParam({
    name: 'id',
    example: '550jdjdjdjdj-jfnjnjnjfefuiehre-444545'
  })
  @ApiResponse({ status: 200, description: 'Tour deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }

}
