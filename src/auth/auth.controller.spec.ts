import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { TestUtils } from '../../test';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let testUtils: TestUtils;
  let server;
  let authService: AuthService;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    authService = testUtils.app.get(AuthService);
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('login()', () => {
    it('should return access token', async () => {
      const password = faker.internet.password();
      const user = await testUtils.createDemoUser({ password });
      const loginDto = {
        email: user.email,
        password,
      };

      const res = await request(server)
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(res.body.access_token).toBeDefined();
      expect(res.body.user).toBeDefined();
    });

    it('should return 401 if password is incorrect', async () => {
      const user = await testUtils.createDemoUser();
      const loginDto = {
        email: user.email,
        password: faker.internet.password(),
      };

      await request(server).post('/auth/login').send(loginDto).expect(401);
    });

    it('should return 401 if user does not exist', async () => {
      const loginDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(server).post('/auth/login').send(loginDto).expect(401);
    });
  });

  describe('register()', () => {
    it('should return user', async () => {
      const user = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
      };

      const res = await request(server)
        .post('/auth/register')
        .send(user)
        .expect(201);

      expect(res.body.user.id).toBeDefined();
      expect(res.body.user.email).toEqual(user.email);
      expect(res.body.user.firstName).toEqual(user.firstName);
      expect(res.body.user.lastName).toEqual(user.lastName);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should return 201', async () => {
      const user = await testUtils.createDemoUser();
      await request(server)
        .post('/auth/forgot-password')
        .send({ email: user.email })
        .expect(201);
    });

    it('should return 201 even if user does not exist', async () => {
      await request(server)
        .post('/auth/forgot-password')
        .send({ email: faker.internet.email() })
        .expect(201);
    });

    it('should return 400 if email is not provided', async () => {
      await request(server).post('/auth/forgot-password').send({}).expect(400);
    });

    it('should return 400 if email is invalid', async () => {
      await request(server)
        .post('/auth/forgot-password')
        .send({ email: 'invalid' })
        .expect(400);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should return 400 for password not strong enough', async () => {
      const user = await testUtils.createDemoUser();
      const resetToken = await authService.forgotPassword(user.email);
      const dto = {
        token: resetToken.token,
        password: faker.internet.password({ length: 5 }),
      };

      await request(server).post('/auth/reset-password').send(dto).expect(400);
    });

    it('should return 200', async () => {
      const user = await testUtils.createDemoUser();
      const resetToken = await authService.forgotPassword(user.email);
      const dto = {
        token: resetToken.token,
        password: `${faker.internet.password({ length: 8 })}${faker.number.int(
          10,
        )}!`,
      };

      const res = await request(server)
        .post('/auth/reset-password')
        .send(dto)
        .expect(201);

      expect(res.body.access_token).toBeDefined();
      expect(res.body.user).toBeDefined();
    });
  });
});
