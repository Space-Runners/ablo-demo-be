import * as request from 'supertest';
import { TestUtils } from '../../test';
import { Client } from '../clients/client.entity';
import { faker } from '@faker-js/faker';

describe('TemplateController', () => {
  let testUtils: TestUtils;
  let server: any;
  let client: Client;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    client = testUtils.defaultClient;
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('GET Sizes and Currencies', () => {
    it('should return all sizes', async () => {
      await request(server).get('/sizes').expect(401);

      const res = await request(server)
        .get('/sizes')
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      expect(res.body).toHaveLength(7);
    });

    it('should return all currencies', async () => {
      await request(server).get('/currencies').expect(401);

      const res = await request(server)
        .get('/currencies')
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET all', () => {
    it('should fail without auth (401)', async () => {
      await request(server).get('/templates').expect(401);
    });

    it('should return only client`s templates for a client', async () => {
      const client2 = await testUtils.createClient();

      // Multiple templates for two clients
      await testUtils.createTemplate(client);
      await testUtils.createTemplate(client2);
      await testUtils.createTemplate(client2);

      const res = await request(server)
        .get('/templates')
        .set(TestUtils.X_API_KEY, client2.apiKey.key)
        .expect(200);

      // client2 should see only 2 templates
      expect(res.body).toHaveLength(2);
      // sizes relation
      expect(res.body[0].sizes).toHaveLength(2);
      // currency relation
      expect(res.body[0].currency.name).toBe('USD');
    });
  });

  describe('GET', () => {
    it('should fail without auth (401)', async () => {
      const template = await testUtils.createTemplate(client);
      await request(server).get(`/templates/${template.id}`).expect(401);
    });

    it('should fail for not own template', async () => {
      const client2 = await testUtils.createClient();
      const template = await testUtils.createTemplate(client2);
      await request(server)
        .get(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(403);
    });

    it('should fail non existing template', async () => {
      await testUtils.createTemplate(client);
      await request(server)
        .get(`/templates/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should return one template', async () => {
      const template = await testUtils.createTemplate(client);
      const res = await request(server)
        .get(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      // sizes relation
      expect(res.body.name).toBe(template.name);
      expect(res.body.currency.name).toBe('USD');
      expect(res.body.sizes[0].name).toBe('XXS');
    });
  });

  describe('POST', () => {
    const namePOST = faker.commerce.productName();
    const templatePOST = {
      name: namePOST,
      fabric: faker.commerce.productDescription(),
      currencyId: 1,
      price: Number(faker.commerce.price()),
      madeIn: faker.location.country(),
      fit: faker.commerce.productAdjective(),
      material: faker.commerce.productMaterial(),
      sizeIds: [1, 2],
    };

    it('should fail for empty template JSON (400)', async () => {
      await request(server)
        .post('/templates')
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(400);
    });

    it('should fail without auth (401)', async () => {
      await request(server).post('/templates').send(templatePOST).expect(401);
    });

    it('should create a template for a client (all fields)', async () => {
      const res = await request(server)
        .post('/templates')
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templatePOST)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(namePOST);
    });

    it('should create a template for a client (only required fields)', async () => {
      const name2 = faker.commerce.productName();
      const template2 = {
        name: name2,
      };

      const res = await request(server)
        .post('/templates')
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(template2)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(name2);
    });
  });

  describe('PATCH', () => {
    const namePATCH = faker.commerce.productName();
    const templatePATCH = {
      name: namePATCH,
      fabric: faker.commerce.productDescription(),
      currencyId: 2,
      price: Number(faker.commerce.price()),
      madeIn: faker.location.country(),
      fit: faker.commerce.productAdjective(),
      material: faker.commerce.productMaterial(),
      sizeIds: [3, 4, 5],
    };

    it('should fail for incorrect params (400)', async () => {
      const template = await testUtils.createTemplate(client);
      let res = await request(server)
        .patch(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          currencyId: 'test',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe(
        'currencyId must be a number conforming to the specified constraints',
      );

      res = await request(server)
        .patch(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          sizeIds: 'test',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe('sizeIds must be an array');
    });

    it('should fail without auth (401)', async () => {
      const template = await testUtils.createTemplate(client);
      await request(server)
        .patch(`/templates/${template.id}`)
        .send(templatePATCH)
        .expect(401);
    });

    it('should fail when trying to PATCH other clients template (403)', async () => {
      const client2 = await testUtils.createClient();
      const template = await testUtils.createTemplate(client2);
      await request(server)
        .patch(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templatePATCH)
        .expect(403);
    });

    it('should fail when not found (404)', async () => {
      await testUtils.createTemplate(client);
      await request(server)
        .patch(`/templates/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templatePATCH)
        .expect(404);
    });

    it('should pass for empty patch', async () => {
      const template = await testUtils.createTemplate(client);
      const res = await request(server)
        .patch(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(200);

      expect(res.body.name).toBe(template.name);
      expect(res.body.fabric).toBe(template.fabric);
    });

    it('should update a template for a client (all fields)', async () => {
      const template = await testUtils.createTemplate(client);
      const res = await request(server)
        .patch(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templatePATCH)
        .expect(200);

      expect(res.body.id).toBe(template.id);
      expect(res.body.name).toBe(namePATCH);
      expect(res.body.fabric).toBe(templatePATCH.fabric);
      expect(res.body.sizes).toHaveLength(3);
      expect(res.body.sizes[0].name).toBe('S');
    });

    it('should update a template for a client (only one field)', async () => {
      const template = await testUtils.createTemplate(client);

      const madeIn2 = faker.location.country();

      const res = await request(server)
        .patch(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          madeIn: madeIn2,
        })
        .expect(200);

      expect(res.body.id).toBe(template.id);
      expect(res.body.name).toBe(template.name);
      expect(res.body.fabric).toBe(template.fabric);
      expect(res.body.madeIn).toBe(madeIn2);
    });
  });

  describe('DELETE', () => {
    it('should fail without auth (401)', async () => {
      const template = await testUtils.createTemplate(client);
      await request(server).delete(`/templates/${template.id}`).expect(401);
    });

    it('should fail for not own template', async () => {
      const client2 = await testUtils.createClient();
      const template = await testUtils.createTemplate(client2);
      const res = await request(server)
        .delete(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key);
      expect(res.statusCode).toBe(403);
    });

    it('should fail non existing template', async () => {
      await testUtils.createTemplate(client);
      await request(server)
        .delete(`/templates/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should delete a template', async () => {
      const template = await testUtils.createTemplate(client);
      await request(server)
        .delete(`/templates/${template.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
    });
  });

  describe('POST full', () => {
    const templatesFullUrl = `/templates/full`;
    const nameFull = faker.commerce.productName();
    const color1Full = faker.color.human();
    const color2Full = faker.color.human();
    const templateFullPOST = {
      name: nameFull,
      fabric: faker.commerce.productDescription(),
      currencyId: 1,
      price: Number(faker.commerce.price()),
      madeIn: faker.location.country(),
      fit: faker.commerce.productAdjective(),
      material: faker.commerce.productMaterial(),
      sizeIds: [1, 2],
      sides: [
        {
          name: 'Front',
          hasArea: true,
          heightCm: faker.number.int(50),
          widthCm: faker.number.int(50),
        },
        {
          name: 'Back',
          hasArea: true,
          heightCm: faker.number.int(50),
          widthCm: faker.number.int(50),
        },
      ],
      colors: [
        {
          name: color1Full,
          hex: faker.color.rgb(),
          images: {
            Front: TestUtils.FAKE_BASE64_IMAGE,
            Back: TestUtils.FAKE_BASE64_IMAGE,
          },
        },
        {
          name: color2Full,
          hex: faker.color.rgb(),
          images: {
            Front: TestUtils.FAKE_BASE64_IMAGE,
            Back: TestUtils.FAKE_BASE64_IMAGE,
          },
        },
      ],
    };

    it('should fail for empty template JSON (400)', async () => {
      await request(server)
        .post(templatesFullUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(400);
    });

    it('should fail without auth (401)', async () => {
      await request(server)
        .post(templatesFullUrl)
        .send(templateFullPOST)
        .expect(401);
    });

    it('should create a template for a client (all fields)', async () => {
      const res = await request(server)
        .post(templatesFullUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateFullPOST)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(nameFull);
    });

    it('should fail without children collections', async () => {
      const template2 = {
        name: faker.commerce.productName(),
      };
      await request(server)
        .post(templatesFullUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(template2)
        .expect(400);
    });

    it('should create a template for a client (only required fields)', async () => {
      const name2 = faker.commerce.productName();
      const template2 = {
        name: name2,
        sizeIds: [1, 2],
        sides: [
          {
            name: 'Front',
            hasArea: true,
            heightCm: faker.number.int(50),
            widthCm: faker.number.int(50),
          },
        ],
        colors: [
          {
            name: color1Full,
            hex: faker.color.rgb(),
            images: {
              Front: TestUtils.FAKE_BASE64_IMAGE,
            },
          },
        ],
      };

      const res = await request(server)
        .post(templatesFullUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(template2)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(name2);
    });
  });
});
