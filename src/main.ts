import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({limit: '20mb'}));
  app.use(express.urlencoded({extended: true, limit: '20mb'}));

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('🌍 Future Travel API')
    .setDescription(
      `
## Future Travel Backend API

Bu API **Future Travel** sayohat agentligi uchun backend xizmati.

### Autentifikatsiya
Admin endpointlari uchun **JWT Bearer token** talab qilinadi:
1. \`POST /api/auth/login\` orqali login qiling
2. Olingan \`accessToken\`ni "Authorize" tugmasi orqali kiriting

### Comment oqimi
- Foydalanuvchi comment yuboradi (ro'yxatdan o'tish shart emas)
- Comment **pending** statusida saqlanadi
- Admin **admin panelida** commentni ko'rib, tasdiqlab yoki rad etadi
- Tasdiqlangan commentlar tourda ko'rinadi

### Fayl yuklash (Bunny.net CDN)
- BullMQ queue orqali asinxron yuklash
- Faqat admin yuklashi mumkin
- Ruxsat etilgan formatlar: JPEG, PNG, WebP, GIF (max 10MB)
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT access token (get it from POST /api/auth/login)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication — admin login, token management')
    .addTag('Admin', 'Admin account management')
    .addTag('Tours', 'Tour CRUD — public (GET) and admin (POST/PATCH/DELETE)')
    .addTag('Comments', 'Comment management — submit (public) and moderate (admin)')
    .addTag('Upload', 'Image upload to Bunny.net CDN via BullMQ')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Future Travel API Docs',
    customCss: `
      .swagger-ui .topbar { background-color: #1a1a2e; }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs\n`);
}

void bootstrap();