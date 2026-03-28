import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadProcessor } from './upload.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-upload',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadProcessor],
  exports: [UploadService],
})
export class UploadModule {}