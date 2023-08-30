import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { TestUtils } from '../../test';

describe('GeneratorController', () => {
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

  describe('removeBackground()', () => {
    it('should create remove background', async () => {
      const user = await userService.createDemoUser({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
      });
      const client = await testUtils.createClient(user);

      // Now try authenticated
      await request(server)
        .post('/generate/remove-background')
        .set('X-Api-Key', `${client.apiKey.key}`)
        .send({
          imageUrl: 'https://photoscissors.com/images/samples/2-after.jpg',
        })
        .expect(201);
    });

    it('should get 401 with no client api key', async () => {
      await request(server)
        .post('/generate/remove-background')
        .send({
          imageUrl: 'https://photoscissors.com/images/samples/2-after.jpg',
        })
        .expect(401);
    });
  });
});
