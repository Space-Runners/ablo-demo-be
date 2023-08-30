import * as request from 'supertest';
import { TestUtils } from '../../../test';
import { Client } from '../../clients/client.entity';
import { faker } from '@faker-js/faker';
import { Template } from '../template.entity';
import { TemplateSide } from './template-side.entity';

describe('TemplateSideController', () => {
  let testUtils: TestUtils;
  let server: any;
  let client1: Client;
  let client2: Client;
  let template: Template;
  let template2: Template;
  let templateSidesUrl1: string;
  let templateSidesUrl2: string;
  let templateSide1: TemplateSide;
  let templateSide2: TemplateSide;
  let sideUrl: string;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    client1 = testUtils.defaultClient;
    client2 = await testUtils.createClient();
    template = await testUtils.createTemplate(client1);
    template2 = await testUtils.createTemplate(client2);
    templateSidesUrl1 = `/templates/${template.id}/sides`;
    templateSidesUrl2 = `/templates/${template2.id}/sides`;
    // Sample default sides
    templateSide1 = await testUtils.createTemplateSide(template);
    sideUrl = `${templateSidesUrl1}/${templateSide1.id}`;
    templateSide2 = await testUtils.createTemplateSide(template2);
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('GET all', () => {
    it('should fail without auth (401)', async () => {
      await request(server).get(templateSidesUrl1).expect(401);
    });

    it('should fail to GET other client`s template sides (403)', async () => {
      await request(server)
        .get(templateSidesUrl1)
        .set(TestUtils.X_API_KEY, client2.apiKey.key)
        .expect(403);
    });

    it('should return only client`s template sides for a client', async () => {
      // One more side for client 2
      await testUtils.createTemplateSide(template2);

      const res = await request(server)
        .get(templateSidesUrl2)
        .set(TestUtils.X_API_KEY, client2.apiKey.key)
        .expect(200);
      // client2 should get only 2 template sides
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET', () => {
    it('should fail without auth (401)', async () => {
      await request(server)
        .get(`${templateSidesUrl1}/${templateSide1.id}`)
        .expect(401);
    });

    it('should fail for not own template side', async () => {
      await request(server)
        .get(`${templateSidesUrl2}/${templateSide2.id}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .expect(403);
    });

    it('should fail for non existing template side', async () => {
      await request(server)
        .get(`${templateSidesUrl1}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .expect(404);
    });

    it('should return one template side', async () => {
      const res = await request(server)
        .get(`${templateSidesUrl1}/${templateSide1.id}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .expect(200);

      // sizes relation
      expect(res.body.name).toBe(templateSide1.name);
      expect(res.body.heightCm).toBe(templateSide1.heightCm);
    });
  });

  describe('POST', () => {
    const namePOST = faker.commerce.productName();
    const templateSidePOST = {
      name: namePOST,
      hasArea: true,
      top: faker.number.int(50),
      left: faker.number.int(50),
      heightCm: faker.number.int(50),
      widthCm: faker.number.int(50),
    };

    it('should fail for empty template side JSON (400)', async () => {
      await request(server)
        .post(templateSidesUrl1)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send({})
        .expect(400);
    });

    it('should fail without auth (401)', async () => {
      await request(server)
        .post(templateSidesUrl1)
        .send(templateSidePOST)
        .expect(401);
    });

    it('should create a template side for a client (all fields)', async () => {
      const res = await request(server)
        .post(templateSidesUrl1)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send(templateSidePOST)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(namePOST);
    });

    it('should create a template side for a client (only required fields)', async () => {
      const name2 = faker.commerce.productName();
      const templateSide2 = {
        name: name2,
      };

      const res = await request(server)
        .post(templateSidesUrl1)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send(templateSide2)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(name2);
    });
  });

  describe('PATCH', () => {
    const namePATCH = faker.commerce.productName();
    const templateSidePATCH = {
      name: namePATCH,
      hasArea: true,
      top: faker.number.int(50),
      left: faker.number.int(50),
      heightCm: faker.number.int(50),
      widthCm: faker.number.int(50),
    };

    it('should fail for incorrect params (400)', async () => {
      let res = await request(server)
        .patch(sideUrl)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send({
          heightCm: 'test',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe(
        'heightCm must be a number conforming to the specified constraints',
      );

      res = await request(server)
        .patch(sideUrl)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send({
          hasArea: 'test',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe('hasArea must be a boolean value');
    });

    it('should fail without auth (401)', async () => {
      await request(server).patch(sideUrl).send(templateSidePATCH).expect(401);
    });

    it('should fail when trying to PATCH other clients template side (403)', async () => {
      const res = await request(server)
        .patch(`${templateSidesUrl2}/${templateSide2.id}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send(templateSidePATCH);

      expect(res.statusCode).toBe(403);
    });

    it('should fail when not found (404)', async () => {
      await request(server)
        .patch(`${templateSidesUrl1}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send(templateSidePATCH)
        .expect(404);
    });

    it('should pass for empty patch', async () => {
      const res = await request(server)
        .patch(sideUrl)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send({})
        .expect(200);

      expect(res.body.name).toBe(templateSide1.name);
      expect(res.body.heightCm).toBe(templateSide1.heightCm);
    });

    it('should update a template side for a client (all fields)', async () => {
      const res = await request(server)
        .patch(sideUrl)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send(templateSidePATCH)
        .expect(200);

      expect(res.body.id).toBe(templateSide1.id);
      expect(res.body.name).toBe(namePATCH);
      expect(res.body.heightCm).toBe(templateSidePATCH.heightCm);
      expect(res.body.hasArea).toBe(templateSidePATCH.hasArea);
    });

    it('should update a template side for a client (only one field)', async () => {
      const side = await testUtils.createTemplateSide(template);

      const widthCm2 = faker.number.int(50);

      const res = await request(server)
        .patch(`${templateSidesUrl1}/${side.id}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .send({
          widthCm: widthCm2,
        })
        .expect(200);

      expect(res.body.id).toBe(side.id);
      expect(res.body.name).toBe(side.name);
      expect(res.body.widthCm).toBe(widthCm2);
    });
  });

  describe('DELETE', () => {
    it('should fail without auth (401)', async () => {
      await request(server).delete(sideUrl).expect(401);
    });

    it('should fail for not own template side', async () => {
      const res = await request(server)
        .delete(`${templateSidesUrl2}/${templateSide2.id}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key);
      expect(res.statusCode).toBe(403);
    });

    it('should fail non existing template side', async () => {
      await request(server)
        .delete(`${templateSidesUrl1}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .expect(404);
    });

    it('should delete a template side', async () => {
      const side = await testUtils.createTemplateSide(template);
      await request(server)
        .delete(`${templateSidesUrl1}/${side.id}`)
        .set(TestUtils.X_API_KEY, client1.apiKey.key)
        .expect(200);
    });
  });
});
