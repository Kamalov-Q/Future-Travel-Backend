import {
  Injectable,
  BadRequestException,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

interface UploadJobResult {
  url: string;
}

@Injectable()
export class UploadService implements OnModuleInit, OnModuleDestroy {
  private queueEvents: QueueEvents;

  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024;
  private static readonly MAX_FILES_COUNT = 10;
  private static readonly ALLOWED_MIMETYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  constructor(
    @InjectQueue('file-upload')
    private readonly uploadQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.queueEvents = new QueueEvents('file-upload', {
      connection: {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
      },
    });
  }

  async onModuleDestroy() {
    if (this.queueEvents) {
      await this.queueEvents.close();
    }
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; jobId: string }> {
    this.validateSingleFile(file);

    const prepared = this.prepareFilePayload(file);

    const job = await this.uploadQueue.add('upload', prepared, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    const result = (await job.waitUntilFinished(
      this.queueEvents,
      30000,
    )) as UploadJobResult;

    return {
      url: result.url,
      jobId: String(job.id),
    };
  }

  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<{ items: { url: string; jobId: string }[] }> {
    this.validateMultipleFiles(files);

    const jobs = await Promise.all(
      files.map(async (file) => {
        this.validateSingleFile(file);

        const prepared = this.prepareFilePayload(file);

        return this.uploadQueue.add('upload', prepared, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
          removeOnFail: 50,
        });
      }),
    );

    const results = await Promise.all(
      jobs.map(async (job) => {
        const result = (await job.waitUntilFinished(
          this.queueEvents,
          30000,
        )) as UploadJobResult;

        return {
          url: result.url,
          jobId: String(job.id),
        };
      }),
    );

    return { items: results };
  }

  private validateSingleFile(file?: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!UploadService.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
      );
    }

    if (file.size > UploadService.MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }
  }

  private validateMultipleFiles(files?: Express.Multer.File[]): void {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > UploadService.MAX_FILES_COUNT) {
      throw new BadRequestException(
        `You can upload a maximum of ${UploadService.MAX_FILES_COUNT} files at once`,
      );
    }
  }

  private prepareFilePayload(file: Express.Multer.File): {
    fileBase64: string;
    filename: string;
    mimetype: string;
  } {
    const ext = path.extname(file.originalname).toLowerCase() || this.getExtensionFromMimetype(file.mimetype);
    const filename = `tours/${uuidv4()}${ext}`;
    const fileBase64 = file.buffer.toString('base64');

    return {
      fileBase64,
      filename,
      mimetype: file.mimetype,
    };
  }

  private getExtensionFromMimetype(mimetype: string): string {
    switch (mimetype) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/gif':
        return '.gif';
      default:
        return '';
    }
  }
}