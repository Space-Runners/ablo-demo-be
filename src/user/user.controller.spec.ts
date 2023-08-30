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

  describe('getAllUsers()', () => {
    it('should return all users for a Client', async () => {
      const client = await testUtils.createClient();
      await testUtils.createDashboardUser({
        email: `user1@${client.domain}`,
      });
      await testUtils.createDashboardUser({
        email: `user2@${client.domain}`,
      });
      await testUtils.createDashboardUser({
        email: `user3@${client.domain}`,
      });

      const res = await request(server)
        .get('/users')
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      expect(res.body.length).toBe(4);
    });
  });
});
