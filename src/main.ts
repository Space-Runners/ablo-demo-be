import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import proxyEndpoints from './proxy-endpoints';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ablo API')
    .setDescription('RESTful API Docs for Ablo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: [
      // Local
      'http://localhost:5173',
      // Ablo
      'https://ablo.ai',
      'https://balmain.ablo.ai',
      'https://balmain-staging.ablo.ai',
      'https://test.ablo.ai',
      'https://web.ablo.ai',
      'https://www.ablo.ai',
      'https://demo.ablo.ai',
      // Render
      'https://ablo-balmain-fe.onrender.com',
      'https://ablo-balmain-fe-production.onrender.com',
    ],
  });

  if (!process.env.API_KEY) {
    throw new Error('API_KEY is not defined');
  }

  // Proxy API requests to ABLO services
  app.use(
    proxyEndpoints,
    createProxyMiddleware({
      target: process.env.API_URL,
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('X-Api-Key', process.env.API_KEY);
      },
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`\nServer running on port ${port}`);
}

bootstrap();
