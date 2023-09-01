import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { imports } from '../test/test.imports';

describe('AppController', () => {
  let appController: AppController;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports,
      controllers: [AppController],
    }).compile();

    appController = testingModule.get<AppController>(AppController);
  });

  afterAll(async () => {
    await testingModule.close();
  });

  describe('root', () => {
    it('Health check', () => {
      expect(appController.getHealth()).toBe('ok');
    });
  });
});
