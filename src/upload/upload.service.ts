import { Injectable, BadRequestException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService implements OnModuleInit, OnModuleDestroy {
  private queueEvents: QueueEvents;

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
    await this.queueEvents.close();
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string; jobId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimetypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimetypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `tours/${uuidv4()}${ext}`;
    const fileBase64 = file.buffer.toString('base64');

    const job = await this.uploadQueue.add(
      'upload',
      {
        fileBase64,
        filename,
        mimetype: file.mimetype,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    // Wait for job to complete (max 30 seconds)
    const result = await job.waitUntilFinished(this.queueEvents, 30000);

    return { url: result.url, jobId: String(job.id) };
  }
}
