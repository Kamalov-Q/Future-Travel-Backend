import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TourModule } from './tour/tour.module';
import { CommentModule } from './comment/comment.module';
import { UploadModule } from './upload/upload.module';
import { Admin } from './admin/entities/admin.entity';
import { Tour } from './tour/entities/tour.entity';
import { Comment } from './comment/entities/comment.entity';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'future_travel'),
        entities: [Admin, Tour, Comment],
        synchronize: true, // set to false in production, use migrations
        logging: false,
      }),
    }),

    // BullMQ (Redis)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    // Feature modules
    AuthModule,
    AdminModule,
    TourModule,
    CommentModule,
    UploadModule,
  ],
})
export class AppModule {}
