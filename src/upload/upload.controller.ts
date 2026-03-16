import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({
    summary: '[ADMIN] Upload tour image to Bunny.net CDN',
    description:
      'Uploads an image file to Bunny.net CDN via BullMQ queue. Returns the CDN URL to use as imageUrl in tour creation. Max file size: 10MB. Allowed types: JPEG, PNG, WebP, GIF.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Tour image file',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, WebP, GIF — max 10MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        url: 'https://your-zone.b-cdn.net/tours/550e8400-e29b-41d4-a716-446655440000.jpg',
        jobId: '42',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
