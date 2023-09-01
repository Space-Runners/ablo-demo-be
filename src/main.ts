import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import proxyEndpoints from './proxy-endpoints';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.SHOW_SWAGGER) {
    const config = new DocumentBuilder()
      .setTitle('Ablo API')
      .setDescription('RESTful API Docs for Ablo')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://d1k73oboz70rlj.cloudfront.net',
      'https://d1k73oboz70rlj.cloudfront.net',
      'http://d3q8uvwyk3hqym.cloudfront.net',
      'https://d3q8uvwyk3hqym.cloudfront.net',
      'https://test.ablo.ai',
      'https://web.ablo.ai',
      'https://www.ablo.ai',
      'https://ablo.ai',
    ],
  });

  // Proxy API requests to ABLO services
  app.use(
    proxyEndpoints,
    createProxyMiddleware({
      target: process.env.API_URL,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
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
