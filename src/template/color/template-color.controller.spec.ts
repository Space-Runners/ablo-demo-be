import * as request from 'supertest';
import { TestUtils } from '../../../test';
import { Client } from '../../clients/client.entity';
import { faker } from '@faker-js/faker';
import { Template } from '../template.entity';
import { TemplateColor } from './template-color.entity';

describe('TemplateColorController', () => {
  let testUtils: TestUtils;
  let server: any;
  let client: Client;
  let client2: Client;
  let template: Template;
  let template2: Template;
  let templateColorsUrl1: string;
  let templateColorsUrl2: string;
  let templateColor1: TemplateColor;
  let templateColor2: TemplateColor;
  let colorUrl: string;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    client = testUtils.defaultClient;
    client2 = await testUtils.createClient();
    template = await testUtils.createTemplate(client);
    template2 = await testUtils.createTemplate(client2);
    templateColorsUrl1 = `/templates/${template.id}/colors`;
    templateColorsUrl2 = `/templates/${template2.id}/colors`;
    // Sample default colors
    templateColor1 = await testUtils.createTemplateColor(template);
    colorUrl = `${templateColorsUrl1}/${templateColor1.id}`;
    templateColor2 = await testUtils.createTemplateColor(template2);
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('GET all', () => {
    it('should fail without auth (401)', async () => {
      await request(server).get(templateColorsUrl1).expect(401);
    });

    it('should fail to GET other client`s template colors (403)', async () => {
      await request(server)
        .get(templateColorsUrl1)
        .set(TestUtils.X_API_KEY, client2.apiKey.key)
        .expect(403);
    });

    it('should return only client`s template colors for a client', async () => {
      // One more color for client 2
      await testUtils.createTemplateColor(template2);

      const res = await request(server)
        .get(templateColorsUrl2)
        .set(TestUtils.X_API_KEY, client2.apiKey.key)
        .expect(200);
      // client2 should get only 2 template colors
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET', () => {
    it('should fail without auth (401)', async () => {
      await request(server)
        .get(`${templateColorsUrl1}/${templateColor1.id}`)
        .expect(401);
    });

    it('should fail for NOT own template color', async () => {
      await request(server)
        .get(`${templateColorsUrl2}/${templateColor2.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(403);
    });

    it('should fail for non existing template color', async () => {
      await request(server)
        .get(`${templateColorsUrl1}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should return one template color', async () => {
      const res = await request(server)
        .get(`${templateColorsUrl1}/${templateColor1.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      // sizes relation
      expect(res.body.name).toBe(templateColor1.name);
      expect(res.body.hex).toBe(templateColor1.hex);
    });
  });

  describe('POST', () => {
    const namePOST = faker.color.human();
    const templateColorPOST = {
      name: namePOST,
      hex: faker.color.rgb(),
    };

    it('should fail for empty template color JSON (400)', async () => {
      await request(server)
        .post(templateColorsUrl1)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(400);
    });

    it('should fail without auth (401)', async () => {
      await request(server)
        .post(templateColorsUrl1)
        .send(templateColorPOST)
        .expect(401);
    });

    it('should create a template color for a client (all fields)', async () => {
      const res = await request(server)
        .post(templateColorsUrl1)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateColorPOST)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(namePOST);
    });

    it('should create a template color for a client (only required fields)', async () => {
      const name2 = faker.color.human();
      const hex2 = faker.color.rgb();
      const templateColor2 = {
        name: name2,
        hex: hex2,
      };

      const res = await request(server)
        .post(templateColorsUrl1)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateColor2)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(name2);
      expect(res.body.hex).toBe(hex2);
    });
  });

  describe('PATCH', () => {
    const namePATCH = faker.color.human();
    const templateColorPATCH = {
      name: namePATCH,
      hex: faker.color.rgb(),
    };

    it('should fail for incorrect params (400)', async () => {
      let res = await request(server)
        .patch(colorUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          hex: true,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe('hex must be a string');

      res = await request(server)
        .patch(colorUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          name: 123.45,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe('name must be a string');
    });

    it('should fail without auth (401)', async () => {
      await request(server)
        .patch(colorUrl)
        .send(templateColorPATCH)
        .expect(401);
    });

    it('should fail when trying to PATCH other clients template color (403)', async () => {
      const res = await request(server)
        .patch(`${templateColorsUrl2}/${templateColor2.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateColorPATCH);

      expect(res.statusCode).toBe(403);
    });

    it('should fail when not found (404)', async () => {
      await request(server)
        .patch(`${templateColorsUrl1}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateColorPATCH)
        .expect(404);
    });

    it('should pass for empty patch', async () => {
      const res = await request(server)
        .patch(colorUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(200);

      expect(res.body.name).toBe(templateColor1.name);
      expect(res.body.hex).toBe(templateColor1.hex);
    });

    it('should update a template color for a client (all fields)', async () => {
      const res = await request(server)
        .patch(colorUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateColorPATCH)
        .expect(200);

      expect(res.body.id).toBe(templateColor1.id);
      expect(res.body.name).toBe(namePATCH);
      expect(res.body.hex).toBe(templateColorPATCH.hex);
    });

    it('should update a template color for a client (only one field)', async () => {
      const color = await testUtils.createTemplateColor(template);

      const hex2 = faker.color.rgb();

      const res = await request(server)
        .patch(`${templateColorsUrl1}/${color.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          hex: hex2,
        })
        .expect(200);

      expect(res.body.id).toBe(color.id);
      expect(res.body.name).toBe(color.name);
      expect(res.body.hex).toBe(hex2);
    });
  });

  describe('DELETE', () => {
    it('should fail without auth (401)', async () => {
      await request(server).delete(colorUrl).expect(401);
    });

    it('should fail for not own template color', async () => {
      const res = await request(server)
        .delete(`${templateColorsUrl2}/${templateColor2.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key);
      expect(res.statusCode).toBe(403);
    });

    it('should fail non existing template color', async () => {
      await request(server)
        .delete(`${templateColorsUrl1}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should delete a template color', async () => {
      const color = await testUtils.createTemplateColor(template);
      await request(server)
        .delete(`${templateColorsUrl1}/${color.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
    });
  });
});
