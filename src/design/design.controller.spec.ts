import * as request from 'supertest';
import { TestUtils } from '../../test';
import { User } from '../user/user.entity';
import { faker } from '@faker-js/faker';

describe('DesignController', () => {
  let testUtils: TestUtils;
  let server: any;
  let user: User;
  let tokenUser: string;

  beforeAll(async () => {
    testUtils = await TestUtils.getInstance();
    server = testUtils.app.getHttpServer();
    user = testUtils.defaultUser;
    tokenUser = testUtils.getJwt(user);
  });

  afterAll(async () => {
    await testUtils.close();
  });

  describe('DesignController', () => {
    describe('GET /designs', () => {
      it('should GET all designs for user', async () => {
        let res = await request(server)
          .get('/designs')
          .auth(tokenUser, { type: 'bearer' })
          .expect(200);

        expect(res.body).toHaveLength(0);

        // Add some designs
        await testUtils.createDesign(user);
        await testUtils.createDesign(user);

        res = await request(server)
          .get('/designs')
          .auth(tokenUser, { type: 'bearer' })
          .expect(200);

        expect(res.body).toHaveLength(2);
      });
    });

    it('should GET one design', async () => {
      // Add a design
      const design = await testUtils.createDesign(user);
      const url = `/designs/${design.id}`;
      await request(server).get(url).expect(401);

      const res = await request(server)
        .get(url)
        .auth(tokenUser, { type: 'bearer' })
        .expect(200);
      expect(res.body.id).toBe(design.id);
    });

    it('should POST design', async () => {
      let res = await request(server).post('/designs').expect(401);
      const newDesign = {
        name: faker.commerce.productName(),
        sizeId: 1,
        templateId: 123,
      };

      res = await request(server)
        .post('/designs')
        .send(newDesign)
        .auth(tokenUser, { type: 'bearer' })
        .expect(201);
      expect(res.body.id).toBeDefined();
    });

    it('should PATCH design', async () => {
      // Add a design
      const design = await testUtils.createDesign(user);
      const url = `/designs/${design.id}`;
      let res = await request(server).patch(url).expect(401);

      const newDesignName = faker.commerce.productName();
      const designUpdate = {
        name: newDesignName,
      };
      // Put design and verify
      await request(server)
        .patch(url)
        .send(designUpdate)
        .auth(tokenUser, { type: 'bearer' })
        .expect(200);

      res = await request(server)
        .get(url)
        .auth(tokenUser, { type: 'bearer' })
        .expect(200);
      expect(res.body.id).toBeDefined();
    });

    it('should DELETE design', async () => {
      // Add a design
      const design = await testUtils.createDesign(user);
      const url = `/designs/${design.id}`;
      await request(server).delete(url).expect(401);

      // Delete design and verify
      await request(server)
        .delete(url)
        .auth(tokenUser, { type: 'bearer' })
        .expect(200);
    });
  });
});
