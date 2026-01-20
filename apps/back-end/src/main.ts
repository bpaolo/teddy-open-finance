/**
 * Backend Application Bootstrap
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  // Usar o logger do Pino (JSON format)
  const logger = app.get(PinoLogger);
  app.useLogger(logger);
  const configService = app.get<ConfigService>(ConfigService);
  
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  const allowedMethods = configService.get<string>('ALLOWED_METHODS') || 'GET,HEAD,PUT,PATCH,POST,DELETE';
  
  // Lista de origens permitidas (dev e Docker)
  const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost',      // Docker Nginx (porta 80)
    'http://localhost:80',  // Docker Nginx (explícito)
    frontendUrl,             // Configurável via env
  ].filter((origin, index, self) => self.indexOf(origin) === index); // Remove duplicatas

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requisições sem origem (ex: Postman, curl)
      if (!origin) {
        return callback(null, true);
      }
      
      // Verificar se a origem está na lista permitida
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Em desenvolvimento, aceitar localhost em qualquer porta
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: allowedMethods,
    credentials: true, // Necessário se você for usar cookies ou headers de Auth
  });

  // Global prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: ['/healthz', '/metrics'],
  });

  // Global ValidationPipe with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Teddy Open Finance API')
    .setDescription('API documentation for Teddy Open Finance platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/docs`
  );
}

bootstrap();
