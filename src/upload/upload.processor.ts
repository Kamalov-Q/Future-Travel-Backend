import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export interface UploadJobData {
  fileBase64: string;
  filename: string;
  mimetype: string;
}

@Processor('file-upload')
export class UploadProcessor extends WorkerHost {
  private readonly logger = new Logger(UploadProcessor.name);

  constructor(private configService: ConfigService) {
    super();
  }

  async process(job: Job<UploadJobData>): Promise<{ url: string }> {
    const { fileBase64, filename, mimetype } = job.data;

    this.logger.log(`Processing upload job ${job.id}: ${filename}`);

    const storageZone = this.configService.get<string>('BUNNY_STORAGE_ZONE_NAME');
    const apiKey = this.configService.get<string>('BUNNY_STORAGE_API_KEY');
    const cdnHostname = this.configService.get<string>('BUNNY_CDN_HOSTNAME');
    const storageRegion = this.configService.get<string>(
      'BUNNY_STORAGE_REGION',
      'storage.bunnycdn.com',
    );

    const buffer = Buffer.from(fileBase64, 'base64');
    const uploadUrl = `https://${storageRegion}/${storageZone}/${filename}`;

    await axios.put(uploadUrl, buffer, {
      headers: {
        AccessKey: apiKey,
        'Content-Type': mimetype || 'application/octet-stream',
        'Content-Length': buffer.length,
      },
      maxBodyLength: Infinity,
    });

    const cdnUrl = `https://${cdnHostname}/${filename}`;
    this.logger.log(`Upload complete: ${cdnUrl}`);
    return { url: cdnUrl };
  }
}
