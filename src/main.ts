import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import proxyEndpoints from './proxy-endpoints';
import { JwtAuthGuard } from './auth/jwt.guard';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use global auth guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('Ablo API')
    .setDescription('RESTful API Docs for Ablo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  if (!process.env.API_KEY) {
    throw new Error('API_KEY is not defined');
  }

  const authService = app.get<AuthService>(AuthService);
  // Proxy API requests to ABLO services
  app.use(
    proxyEndpoints,
    createProxyMiddleware({
      target: process.env.API_URL,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        // Authenticate all proxy requests
        const authHeader = req.header('Authorization');
        if (authService.verifyAuthHeader(authHeader)) {
          proxyReq.setHeader('X-Api-Key', process.env.API_KEY);
        } else {
          proxyReq.destroy();
          res.status(401).send();
        }
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
