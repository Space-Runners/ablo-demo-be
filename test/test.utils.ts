import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/user/role.entity';
import { User } from '../src/user/user.entity';
import { TemplateService } from '../src/template/template.service';
import { ICreateUserOptions, imports } from '.';
import { AuthService } from '../src/auth/auth.service';
import { RoleName } from '../src/auth/role-name.enum';
import { DesignService } from '../src/design/design.service';
import { JwtAuthGuard } from '../src/auth/jwt.guard';
import { StorageService } from '../src/generator/storage.service';
import { GeneratorService } from '../src/generator/generator.service';
import { Currency } from '../src/template/currency/currency.entity';
import { Size } from '../src/template/size/size.entity';
import { Design } from '../src/design/design.entity';
import { DesignSideService } from '../src/design/side/design-side.service';
import { MailService } from '../src/mail/mail.service';
import { DesignSide } from 'src/design/side/design-side.entity';

// Set timeout to 20s (each suite recreates the DB)
jest.setTimeout(20000);

export class TestUtils {
  static X_API_KEY = 'X-Api-key';
  static FAKE_BASE64_IMAGE =
    'data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  static FAKE_UUID = '27f49f61-7977-4757-b1e4-3190d532e826';
  private static instance = null;
  static async getInstance() {
    if (!this.instance) {
      this.instance = new TestUtils();
      await this.instance.init();
    }
    return this.instance;
  }

  testingModule: TestingModule;

  app: INestApplication;
  authService: AuthService;
  designService: DesignService;
  designSideService: DesignSideService;
  templateService: TemplateService;
  userService: UserService;
  currencyRepo;
  roleRepo;
  sizeRepo;

  adminRole: Role;
  userRole: Role;
  superAdminRole: Role;
  defaultUser: User;

  async close() {
    await this.app.close();
  }

  async init() {
    const generatorServiceMock = {
      removeBackground: jest.fn(
        () =>
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/9AtyRoAAAAASUVORK5CYII=',
      ),
    };

    const mailServiceMock = {
      sendVerificationEmail: jest.fn(),
      send: jest.fn(),
    };

    const storageServiceMock = {
      uploadFile: () => faker.internet.url(),
      downloadFile: () => TestUtils.FAKE_BASE64_IMAGE,
      removeFile: () => jest.fn(),
      removeFolder: () => jest.fn(),
    };

    this.testingModule = await Test.createTestingModule({
      imports,
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(JwtAuthGuard)
      .overrideProvider(GeneratorService)
      .useValue(generatorServiceMock)
      .overrideProvider(MailService)
      .useValue(mailServiceMock)
      .overrideProvider(StorageService)
      .useValue(storageServiceMock)
      .compile();

    // Services
    this.authService = this.testingModule.get<AuthService>(AuthService);
    this.designService = this.testingModule.get<DesignService>(DesignService);
    this.designSideService =
      this.testingModule.get<DesignSideService>(DesignSideService);
    this.templateService =
      this.testingModule.get<TemplateService>(TemplateService);
    this.userService = this.testingModule.get<UserService>(UserService);
    // Repos
    this.currencyRepo = this.testingModule.get(getRepositoryToken(Currency));
    this.roleRepo = this.testingModule.get(getRepositoryToken(Role));
    this.sizeRepo = this.testingModule.get(getRepositoryToken(Size));

    this.app = this.testingModule.createNestApplication();
    await this.app.init();

    // Init defaults
    this.adminRole = await this.roleRepo.save({ name: RoleName.Admin });
    this.userRole = await this.roleRepo.save({ name: RoleName.User });
    this.superAdminRole = await this.roleRepo.save({
      name: RoleName.SuperAdmin,
    });
    await this.currencyRepo.save([{ name: 'USD' }, { name: 'EUR' }]);
    await this.sizeRepo.save([
      { name: 'XXS' },
      { name: 'XS' },
      { name: 'S' },
      { name: 'M' },
      { name: 'L' },
      { name: 'XL' },
      { name: 'XXL' },
    ]);

    this.defaultUser = await this.createDemoUser();
  }

  async createSuperAdmin(): Promise<User> {
    const superuser = await this.createDemoUser({ role: this.superAdminRole });
    return superuser;
  }

  async createDemoUser(options?: ICreateUserOptions): Promise<User> {
    const user = await this.userService.createDemoUser(
      {
        email: options?.email || faker.internet.email(),
        password: options?.password || faker.internet.password(),
        firstName: faker.person.firstName(),
      },
      options?.role,
    );

    return user;
  }

  getJwt(user: User): string {
    const jwt = this.authService.generateJwt({
      email: user.email,
      id: user.id,
      roles: user.roles.map((r) => r.name),
    });
    return jwt;
  }

  async createDesignSide(design?: Design) {
    // const templateSide = await this.createTemplateSide();

    // if (!design) {
    //   design = await this.createDesign();
    // }

    // const side = await this.designSideService.create(
    //   {
    //     templateSideId: templateSide.id,
    //     hasGraphics: faker.datatype.boolean(),
    //     hasText: faker.datatype.boolean(),
    //     canvasState: faker.datatype.json(),
    //     image: TestUtils.FAKE_BASE64_IMAGE,
    //     preview: TestUtils.FAKE_BASE64_IMAGE,
    //   },
    //   design.id,
    //   design.client.id,
    // );

    return new DesignSide();
  }

  async createDesign(): Promise<Design> {
    // const user = options?.user || (await this.createDemoUser());
    // const client =
    //   options?.client ||
    //   options?.template?.client ||
    //   (await this.createClient(user));
    // const template = options?.template || (await this.createTemplate(client));

    // const design = await this.designService.create(
    //   {
    //     name: options?.name || faker.commerce.productName(),
    //     templateColorId:
    //       options?.color?.id || (await this.createTemplateColor(template)).id,
    //     sizeId:
    //       options?.size?.id ||
    //       faker.number.int({ min: 1, max: template.sizes.length }),
    //     templateId: template.id,
    //   },
    //   user,
    //   client,
    // );

    return new Design();
  }
}
