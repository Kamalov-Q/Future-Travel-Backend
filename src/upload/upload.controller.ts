import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
    summary: '[ADMIN] Upload single tour image to Bunny.net CDN',
    description:
      'Uploads one image file to Bunny.net CDN via BullMQ queue. Max file size: 10MB. Allowed types: JPEG, PNG, WebP, GIF.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single image file',
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

  @Post('images')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Upload multiple tour images to Bunny.net CDN',
    description:
      'Uploads multiple image files to Bunny.net CDN via BullMQ queue. Max 10 files. Max size: 10MB per file. Allowed types: JPEG, PNG, WebP, GIF.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple image files',
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Image files (JPEG, PNG, WebP, GIF — max 10 files, 10MB each)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    schema: {
      example: {
        items: [
          {
            url: 'https://your-zone.b-cdn.net/tours/11111111-1111-1111-1111-111111111111.jpg',
            jobId: '101',
          },
          {
            url: 'https://your-zone.b-cdn.net/tours/22222222-2222-2222-2222-222222222222.png',
            jobId: '102',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file type, size, or count' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        files: 10,
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadImages(files);
  }
}