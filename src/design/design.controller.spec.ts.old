import * as request from 'supertest';
import { TestUtils } from '../../test';
import { Client } from '../clients/client.entity';
import { User } from '../user/user.entity';
import { faker } from '@faker-js/faker';
import { CreateDesignDto } from './create-design.dto';
import { Design } from './design.entity';
import { PatchDesignDto } from './patch-design.dto';

describe('DesignController', () => {
  let testUtils: TestUtils;
  let server: any;
  let user: User;
  let tokenUser: string;
  let client: Client;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    user = testUtils.defaultUser;
    client = testUtils.defaultClient;
    tokenUser = testUtils.getJwt(user);
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('DesignController', () => {
    describe('GET /clients/designs', () => {
      it('should return empty list for new client with no designs', async () => {
        // Create a new client
        const client = await testUtils.createClient();

        const res = await request(server)
          .get('/clients/designs')
          .set(TestUtils.X_API_KEY, client.apiKey.key)
          .expect(200);

        expect(res.body).toHaveLength(0);
      });

      it('should GET all designs for client', async () => {
        // Create a new client
        const client = await testUtils.createClient();

        // Add some designs
        await testUtils.createDesign({ client });
        await testUtils.createDesign({ client });

        const res = await request(server)
          .get('/clients/designs')
          .set(TestUtils.X_API_KEY, client.apiKey.key)
          .expect(200);

        expect(res.body).toHaveLength(2);
      });
    });

    describe('POST /clients/designs', () => {
      it('should POST design', async () => {
        const template = await testUtils.createTemplate(client);
        const templateColor = await testUtils.createTemplateColor(template);

        const newDesignName = faker.commerce.productName();
        const newDesign: CreateDesignDto = {
          name: newDesignName,
          templateColorId: templateColor.id,
          sizeId: 1,
          templateId: template.id,
        };

        const res = await request(server)
          .post('/clients/designs')
          .send(newDesign)
          .set(TestUtils.X_API_KEY, client.apiKey.key)
          .expect(201);

        expect(res.body.name).toBe(newDesignName);
      });
    });

    describe('GET /designs', () => {
      it('should GET all designs for user', async () => {
        let res = await request(server)
          .get('/designs')
          .auth(tokenUser, { type: 'bearer' })
          .set(TestUtils.X_API_KEY, client.apiKey.key)
          .expect(200);

        expect(res.body).toHaveLength(0);

        // Add some designs
        await testUtils.createDesign({ client, user });
        await testUtils.createDesign({ client, user });

        res = await request(server)
          .get('/designs')
          .auth(tokenUser, { type: 'bearer' })
          .set(TestUtils.X_API_KEY, client.apiKey.key)
          .expect(200);

        expect(res.body).toHaveLength(2);
      });
    });

    describe('PATCH /designs/:id', () => {
      it('should PATCH design', async () => {
        // Add a design
        const design = await testUtils.createDesign({ client, user });
        const url = `/designs/${design.id}`;
        const newDesignName = faker.commerce.productName();
        const designUpdate: PatchDesignDto = {
          name: newDesignName,
        };

        // Patch design and verify
        const res = await request(server)
          .patch(url)
          .send(designUpdate)
          .set(TestUtils.X_API_KEY, client.apiKey.key)
          .expect(200);

        expect(res.body.name).toBe(newDesignName);
      });
    });

    it('should GET one design', async () => {
      // Add a design
      const design = await testUtils.createDesign({ client, user });
      const url = `/designs/${design.id}`;
      await request(server).get(url).expect(401);

      const res = await request(server)
        .get(url)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
      expect(res.body.name).toBe(design.name);
    });

    it('should POST design', async () => {
      let res = await request(server).post('/designs').expect(401);
      const template = await testUtils.createTemplate(client);
      const templateColor = await testUtils.createTemplateColor(template);

      const newDesignName = faker.commerce.productName();
      const newDesign: CreateDesignDto = {
        name: newDesignName,
        templateColorId: templateColor.id,
        sizeId: 1,
        templateId: template.id,
      };

      res = await request(server)
        .post('/designs')
        .send(newDesign)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(201);
      expect(res.body.name).toBe(newDesignName);
    });

    it('should POST design with preview images', async () => {
      let res = await request(server).post('/designs').expect(401);
      const template = await testUtils.createTemplate(client);
      const templateColor = await testUtils.createTemplateColor(template);

      const newDesignName = faker.commerce.productName();
      const newDesign: CreateDesignDto = {
        name: newDesignName,
        templateColorId: templateColor.id,
        sizeId: 1,
        templateId: template.id,
      };
      res = await request(server)
        .post('/designs')
        .send(newDesign)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(201);
      const result = res.body as Design;
      expect(result.name).toBe(newDesignName);
    });

    it('should POST design with 1 preview image', async () => {
      let res = await request(server).post('/designs').expect(401);
      const template = await testUtils.createTemplate(client);
      const templateColor = await testUtils.createTemplateColor(template);

      const newDesignName = faker.commerce.productName();
      const newDesign: CreateDesignDto = {
        name: newDesignName,
        templateColorId: templateColor.id,
        sizeId: 1,
        templateId: template.id,
      };
      res = await request(server)
        .post('/designs')
        .send(newDesign)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(201);
      const result = res.body as Design;
      expect(result.name).toBe(newDesignName);
    });

    it('should PUT design', async () => {
      // Add a design
      const design = await testUtils.createDesign({ client, user });
      const url = `/designs/${design.id}`;
      let res = await request(server).put(url).expect(401);
      const template = await testUtils.createTemplate(client);
      const templateColor = await testUtils.createTemplateColor(template);

      const newDesignName = faker.commerce.productName();
      const designUpdate: CreateDesignDto = {
        name: newDesignName,
        templateColorId: templateColor.id,
        sizeId: 1,
        templateId: template.id,
      };
      // Put design and verify
      await request(server)
        .put(url)
        .send(designUpdate)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      res = await request(server)
        .get(url)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
      expect(res.body.name).toBe(newDesignName);
    });

    it('should DELETE design', async () => {
      // Add a design
      const design = await testUtils.createDesign({ client, user });
      const url = `/designs/${design.id}`;
      await request(server).delete(url).expect(401);

      // Delete design and verify
      await request(server)
        .delete(url)
        .auth(tokenUser, { type: 'bearer' })
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
    });
  });
});
