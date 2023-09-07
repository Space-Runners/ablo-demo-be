import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { TestUtils } from '../../test';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let testUtils: TestUtils;
  let server;
  let authService: AuthService;
  let mailService: MailService;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    authService = testUtils.app.get(AuthService);
    mailService = testUtils.app.get(MailService);
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('POST /auth/login', () => {
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

  describe('POST /auth/register', () => {
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

    it('should send verification email', async () => {
      const spy = jest.spyOn(mailService, 'sendVerificationEmail');

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

      expect(spy).toHaveBeenLastCalledWith(
        user.email,
        user.firstName,
        UserService.createVerifyEmailUrl(user.email, process.env.DEMO_URL),
      );
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

    it('should return 201 even if existing ResetToken', async () => {
      const user = await testUtils.createDemoUser();
      await authService.forgotPassword(user.email);

      await request(server)
        .post('/auth/forgot-password')
        .send({ email: user.email })
        .expect(201);
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

  describe('POST /auth/verify-password', () => {
    it('should return 200', async () => {
      const dto = {
        password: process.env.PASSWORD,
      };

      await request(server).post('/auth/verify-password').send(dto).expect(201);
    });

    it('should return 401 if password is incorrect', async () => {
      const dto = {
        password: faker.internet.password(),
      };

      await request(server).post('/auth/verify-password').send(dto).expect(401);
    });

    it('should return 400 if password is not provided', async () => {
      await request(server).post('/auth/verify-password').send({}).expect(400);
    });
  });
});
