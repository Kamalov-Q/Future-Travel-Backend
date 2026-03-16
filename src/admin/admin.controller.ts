import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all admins',
    description: 'Returns list of all admin accounts (requires JWT auth)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of admins',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'abdujabborsharobiddinov5@gmail.com',
          name: 'Super Admin',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Admin found' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
}
