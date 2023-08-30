import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { TestUtils } from '../../test';
import { DeleteClientDto } from './delete-client.dto';

describe('ClientController', () => {
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

  describe('createClient()', () => {
    it('should create Client', async () => {
      const user = await testUtils.createDemoUser();

      const userFromDb = await userService.findOneByEmail(user.email);
      expect(userFromDb).toBeDefined();

      const clientDto = {
        name: faker.company.name(),
        domain: faker.internet.domainName(),
      };

      // First try unauthenticated
      await request(server).post('/clients').send(clientDto).expect(401);

      const jwt = testUtils.getJwt(user);

      // Now try authenticated
      await request(server)
        .post('/clients')
        .auth(jwt, { type: 'bearer' })
        .send(clientDto)
        .expect(201);
    });
  });

  describe('getClients()', () => {
    it('should get all Client', async () => {
      await testUtils.createClient();
      await testUtils.createClient();

      const res = await request(server).get('/clients').expect(200);

      const clients = res.body;
      expect(clients.length).toBeGreaterThanOrEqual(2);
      expect(clients[0].apiKey).toBeUndefined();
    });
  });

  describe('deleteClient()', () => {
    it('should get auth error deleting Client as non super admin', async () => {
      const user = await testUtils.createDemoUser();

      // Create company
      const client = await testUtils.createClient(user);

      const jwt = testUtils.getJwt(user);

      // Now try authenticated
      await request(server)
        .delete('/clients')
        .auth(jwt, { type: 'bearer' })
        .send({
          name: client.name,
        } as DeleteClientDto)
        .expect(403);
    });

    // TODO: This test is flaky for some reason. Some times gets a 403
    it('should successfully delete Client as superadmin', async () => {
      // Create company
      const client = await testUtils.createClient();

      const superadmin = await testUtils.createSuperAdmin();
      const jwt = testUtils.getJwt(superadmin);
      // Now try authenticated
      await request(server)
        .delete('/clients')
        .auth(jwt, { type: 'bearer' })
        .send({
          name: client.name,
        } as DeleteClientDto)
        .expect(200);
    });
  });
});
