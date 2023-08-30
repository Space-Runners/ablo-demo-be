import { TestUtils } from '../../../test';
import * as request from 'supertest';
import { CreateDesignSideDto } from './create-design-side.dto';
import { faker } from '@faker-js/faker';
import { PatchDesignSideDto } from './patch-design-side.dto';

describe('DesignSideController', () => {
  let testUtils: TestUtils;
  let server;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('GET /designs/:designId/sides', () => {
    it('should fail without auth (401)', async () => {
      await request(server).get(`/designs/1/sides`).expect(401);
    });

    it('should fail to GET other client`s design sides (403)', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign();

      await request(server)
        .get(`/designs/${design.id}/sides`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(403);
    });

    it('should fail to GET non-existing design sides (404)', async () => {
      const client = await testUtils.createClient();

      await request(server)
        .get(`/designs/${faker.string.uuid()}/sides`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should successfully GET own design sides', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign({ client });
      const side = await testUtils.createDesignSide(design);

      const res = await request(server)
        .get(`/designs/${design.id}/sides`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      expect(res.body[0].id).toEqual(side.id);
    });
  });

  describe('GET /designs/:designId/sides/:id', () => {
    it('should fail without auth (401)', async () => {
      await request(server)
        .get(`/designs/1/sides/${faker.string.uuid()}`)
        .expect(401);
    });

    it('should fail to GET other client`s design side (403)', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign();
      const side = await testUtils.createDesignSide(design);

      await request(server)
        .get(`/designs/${design.id}/sides/${side.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(403);
    });

    it('should fail to GET non-existing design side (404)', async () => {
      const client = await testUtils.createClient();

      await request(server)
        .get(`/designs/${faker.string.uuid()}/sides/${faker.string.uuid()}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should successfully GET own design side', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign({ client });
      const side = await testUtils.createDesignSide(design);

      const res = await request(server)
        .get(`/designs/${design.id}/sides/${side.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      expect(res.body.id).toEqual(side.id);
    });
  });

  describe('POST', () => {
    it('should fail without auth (401)', async () => {
      await request(server).post('/designs/1/sides').expect(401);
    });

    it('should fail to POST to other client`s design (403)', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign();

      const dto: CreateDesignSideDto = {
        templateSideId: faker.string.uuid(),
        hasGraphics: true,
        hasText: true,
        canvasState: 'so;mething',
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      };

      await request(server)
        .post(`/designs/${design.id}/sides`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(dto)
        .expect(403);
    });

    it('should fail to POST to non-existing design (404)', async () => {
      const client = await testUtils.createClient();

      const dto: CreateDesignSideDto = {
        templateSideId: faker.string.uuid(),
        hasGraphics: true,
        hasText: true,
        canvasState: 'so;mething',
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      };

      await request(server)
        .post(`/designs/${faker.string.uuid()}/sides`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(dto)
        .expect(404);
    });

    it('should successfully POST to own design', async () => {
      const client = await testUtils.createClient();
      const template = await testUtils.createTemplate(client);
      const templateSide = await testUtils.createTemplateSide(template);
      const design = await testUtils.createDesign({ template });

      const dto: CreateDesignSideDto = {
        templateSideId: templateSide.id,
        hasGraphics: true,
        hasText: true,
        canvasState: 'so;mething',
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      };

      await request(server)
        .post(`/designs/${design.id}/sides`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(dto)
        .expect(201);
    });
  });

  describe('PATCH', () => {
    it('should fail without auth (401)', async () => {
      await request(server)
        .patch(`/designs/${faker.string.uuid()}/sides/${faker.string.uuid()}`)
        .expect(401);
    });

    it('should fail to PATCH other client`s design side (403)', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign();
      const side = await testUtils.createDesignSide(design);

      const dto: PatchDesignSideDto = {
        hasGraphics: faker.datatype.boolean(),
        hasText: faker.datatype.boolean(),
        canvasState: faker.datatype.json(),
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      };

      await request(server)
        .patch(`/designs/${design.id}/sides/${side.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(dto)
        .expect(403);
    });

    it('should fail to PATCH non-existing design side (404)', async () => {
      const client = await testUtils.createClient();

      const dto: PatchDesignSideDto = {
        hasGraphics: faker.datatype.boolean(),
        hasText: faker.datatype.boolean(),
        canvasState: faker.datatype.json(),
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      };

      await request(server)
        .patch(`/designs/${faker.string.uuid()}/sides/${faker.string.uuid()}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(dto)
        .expect(404);
    });

    it('should successfully PATCH own design side', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign({ client });
      const side = await testUtils.createDesignSide(design);

      const dto: PatchDesignSideDto = {
        hasGraphics: faker.datatype.boolean(),
        hasText: faker.datatype.boolean(),
        canvasState: faker.datatype.json(),
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      };

      await request(server)
        .patch(`/designs/${design.id}/sides/${side.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(dto)
        .expect(200);
    });
  });

  describe('DELETE', () => {
    it('should fail without auth (401)', async () => {
      await request(server)
        .delete(`/designs/${faker.string.uuid()}/sides/${faker.string.uuid()}`)
        .expect(401);
    });

    it('should fail to DELETE other client`s design side (403)', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign();
      const side = await testUtils.createDesignSide(design);

      await request(server)
        .delete(`/designs/${design.id}/sides/${side.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(403);
    });

    it('should fail to DELETE non-existing design side (404)', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign({ client });

      await request(server)
        .delete(`/designs/${design.id}/sides/${faker.string.uuid()}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should successfully DELETE own design side', async () => {
      const client = await testUtils.createClient();
      const design = await testUtils.createDesign({ client });
      const side = await testUtils.createDesignSide(design);

      await request(server)
        .delete(`/designs/${design.id}/sides/${side.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
    });
  });
});
