import { UserService } from './user.service';
import * as request from 'supertest';
import { TestUtils } from '../../test';

describe('UserController', () => {
  let userService: UserService;
  let testUtils: TestUtils;
  let server;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    userService = testUtils.userService;
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('Profile', () => {
    it('should return the correct user', async () => {
      // Create several users for a chance of random user in profile
      await testUtils.createDemoUser();
      await testUtils.createDemoUser();
      const user3 = await testUtils.createDemoUser();

      const userFromDb = await userService.findOneByEmail(user3.email);
      expect(userFromDb.email).toBe(user3.email);

      // Try to get profile unauthenticated
      await request(server).get('/profile').expect(401);

      const jwt = testUtils.getJwt(user3);

      // Now try authenticated
      const profile3 = await request(server)
        .get('/profile')
        .auth(jwt, { type: 'bearer' })
        .expect(200);
      expect(profile3.body.email).toBe(user3.email);
      expect(profile3.body.firstName).toBe(user3.firstName);
    });
  });

  describe('POST /users/verify-email/:token', () => {
    it('should verify email', async () => {
      const user = await testUtils.createDemoUser({
        email: 'karim@spacerunners.com',
      });
      expect(user.verified).toBe(false);

      const spyOnSendWelcomeEmail = jest.spyOn(
        testUtils.mailService,
        'sendWelcomeEmail',
      );

      const token = UserService.getVerifyToken(user.email);

      await request(server).get(`/users/verify-email/${token}`).expect(200);

      const userFromDb = await userService.findOneByEmail(user.email);
      expect(userFromDb.verified).toBe(true);

      expect(spyOnSendWelcomeEmail).toBeCalledTimes(1);
      expect(spyOnSendWelcomeEmail).toBeCalledWith(user.email, user.firstName);
    });
  });
});
