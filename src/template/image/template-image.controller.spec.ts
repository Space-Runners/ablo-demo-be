import * as request from 'supertest';
import { TestUtils } from '../../../test';
import { Client } from '../../clients/client.entity';
import { Template } from '../template.entity';
import { TemplateColor } from '../color/template-color.entity';
import { TemplateImage } from './template-image.entity';
import { TemplateSide } from '../side/template-side.entity';

describe('TemplateController', () => {
  let testUtils: TestUtils;
  let server: any;
  // Client 1 items
  let client: Client;
  let template: Template;
  let templateColor: TemplateColor;
  let templateSide: TemplateSide;
  let templateImage1: TemplateImage;
  let templateImagesUrl: string;
  let templateImagesUrlGetAll: string;
  let imageUrl: string;
  // Client 2 items
  let client2: Client;
  let template2: Template;
  let templateColor2: TemplateColor;
  let templateSide2: TemplateSide;
  let templateImage2: TemplateImage;
  let templateImagesUrl2: string;
  let templateImagesUrlGetAll2: string;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    // Client 1
    client = testUtils.defaultClient;
    template = await testUtils.createTemplate(client);
    templateColor = await testUtils.createTemplateColor(template);
    templateSide = await testUtils.createTemplateSide(template);
    templateImage1 = await testUtils.createTemplateImage(
      template,
      templateColor.id,
      templateSide.id,
    );
    templateImagesUrl = `/templates/${template.id}/images`;
    templateImagesUrlGetAll = `/templates/${template.id}/images?templateColorId=${templateColor.id}`;
    imageUrl = `${templateImagesUrl}/${templateImage1.id}`;

    // Client 2
    client2 = await testUtils.createClient();
    template2 = await testUtils.createTemplate(client2);
    templateColor2 = await testUtils.createTemplateColor(template2);
    templateSide2 = await testUtils.createTemplateSide(template2);
    templateImage2 = await testUtils.createTemplateImage(
      template2,
      templateColor2.id,
      templateSide2.id,
    );
    templateImagesUrl2 = `/templates/${template2.id}/images`;
    templateImagesUrlGetAll2 = `/templates/${template2.id}/images?templateColorId=${templateColor2.id}`;
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('GET all', () => {
    it('should fail without auth (401)', async () => {
      await request(server).get(templateImagesUrlGetAll).expect(401);
    });

    it('should fail to GET other client`s template images (403)', async () => {
      const res = await request(server)
        .get(templateImagesUrlGetAll)
        .set(TestUtils.X_API_KEY, client2.apiKey.key);
      // .expect(403);
      expect(res.statusCode).toBe(403);
    });

    it('should return only client`s template images for a client', async () => {
      // One more image for client 2
      const tmpSide = await testUtils.createTemplateSide(template2);
      await testUtils.createTemplateImage(
        template2,
        templateColor2.id,
        tmpSide.id,
      );

      const res = await request(server)
        .get(templateImagesUrlGetAll2)
        .set(TestUtils.X_API_KEY, client2.apiKey.key)
        .expect(200);
      // client2 should get only 2 template images
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET', () => {
    it('should fail without auth (401)', async () => {
      await request(server)
        .get(`${templateImagesUrl}/${templateImage1.id}`)
        .expect(401);
    });

    it('should fail for not own template image', async () => {
      await request(server)
        .get(`${templateImagesUrl2}/${templateImage2.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(403);
    });

    it('should fail for non existing template image', async () => {
      await request(server)
        .get(`${templateImagesUrl}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should return one template image', async () => {
      const res = await request(server)
        .get(`${templateImagesUrl}/${templateImage1.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);

      // sizes relation
      expect(res.body.url).toBe(templateImage1.url);
      expect(res.body.templateColorId).toBe(templateImage1.templateColorId);
      expect(res.body.templateSideId).toBe(templateImage1.templateSideId);
    });
  });

  describe('POST', () => {
    const templateImagePOST = () => {
      return {
        image: TestUtils.FAKE_BASE64_IMAGE,
        templateColorId: templateColor.id,
        templateSideId: templateSide.id,
      };
    };

    it('should fail for empty template image JSON (400)', async () => {
      await request(server)
        .post(templateImagesUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(400);
    });

    it('should fail without auth (401)', async () => {
      await request(server)
        .post(templateImagesUrl)
        .send(templateImagePOST())
        .expect(401);
    });

    it('should create a template image for a client (all fields)', async () => {
      const tmpColor = await testUtils.createTemplateColor(template);
      const tmpSide = await testUtils.createTemplateSide(template);
      const data = {
        image: TestUtils.FAKE_BASE64_IMAGE,
        templateColorId: tmpColor.id,
        templateSideId: tmpSide.id,
      };

      const res = await request(server)
        .post(templateImagesUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(data)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.url).toBeDefined();
      expect(res.body.templateColorId).toBe(data.templateColorId);
      expect(res.body.templateSideId).toBe(data.templateSideId);
    });

    it('should fail to create two images for the same color-side combo', async () => {
      const tmp = await testUtils.createTemplate();
      const tmpColor = await testUtils.createTemplateColor(tmp);
      const tmpSide = await testUtils.createTemplateSide(tmp);

      const data = {
        image: TestUtils.FAKE_BASE64_IMAGE,
        templateColorId: tmpColor.id,
        templateSideId: tmpSide.id,
      };

      // First POST should pass
      await request(server)
        .post(templateImagesUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(data)
        .expect(201);

      // Second POST should return Conflict
      await request(server)
        .post(templateImagesUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(data)
        .expect(409);
    });
  });

  describe('PATCH', () => {
    const templateImagePATCH = {
      image: TestUtils.FAKE_BASE64_IMAGE,
    };

    it('should fail for incorrect params (400)', async () => {
      const res = await request(server)
        .patch(imageUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({
          image: false,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body?.message[0]).toBe('image must be a string');
    });

    it('should fail without auth (401)', async () => {
      await request(server)
        .patch(imageUrl)
        .send(templateImagePATCH)
        .expect(401);
    });

    it('should fail when trying to PATCH other clients template image (403)', async () => {
      const res = await request(server)
        .patch(`${templateImagesUrl2}/${templateImage2.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateImagePATCH);

      expect(res.statusCode).toBe(403);
    });

    it('should fail when not found (404)', async () => {
      await request(server)
        .patch(`${templateImagesUrl}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateImagePATCH)
        .expect(404);
    });

    it('should pass for empty patch', async () => {
      const resGet = await request(server)
        .get(imageUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key);

      const res = await request(server)
        .patch(imageUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send({})
        .expect(200);

      expect(resGet.body.url).toBe(res.body.url);
    });

    it('should update a template image for a client (all fields)', async () => {
      const res = await request(server)
        .patch(imageUrl)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .send(templateImagePATCH)
        .expect(200);

      expect(res.body.id).toBe(templateImage1.id);
      expect(res.body.url).toBeDefined();
      expect(res.body.url).not.toBe(templateImage1.url);
    });
  });

  describe('DELETE', () => {
    it('should fail without auth (401)', async () => {
      await request(server).delete(imageUrl).expect(401);
    });

    it('should fail for not own template image', async () => {
      const res = await request(server)
        .delete(`${templateImagesUrl2}/${templateImage2.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key);
      expect(res.statusCode).toBe(403);
    });

    it('should fail non existing template image', async () => {
      await request(server)
        .delete(`${templateImagesUrl}/${TestUtils.FAKE_UUID}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(404);
    });

    it('should delete a template image', async () => {
      // One more image for client 2
      const tmp = await testUtils.createTemplate(client);
      const tmpColor = await testUtils.createTemplateColor(tmp);
      const tmpSide = await testUtils.createTemplateSide(tmp);
      const image = await testUtils.createTemplateImage(
        tmp,
        tmpColor.id,
        tmpSide.id,
      );

      await request(server)
        .delete(`${templateImagesUrl}/${image.id}`)
        .set(TestUtils.X_API_KEY, client.apiKey.key)
        .expect(200);
    });
  });
});
