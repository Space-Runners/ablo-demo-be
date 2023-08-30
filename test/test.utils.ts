import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserService } from '../src/user/user.service';
import { ClientService } from '../src/clients/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/user/role.entity';
import { User } from '../src/user/user.entity';
import { Client } from '../src/clients/client.entity';
import { TemplateService } from '../src/template/template.service';
import { ICreateDesignOptions, ICreateUserOptions, imports } from '.';
import { AuthService } from '../src/auth/auth.service';
import { RoleName } from '../src/auth/role-name.enum';
import { DesignService } from '../src/design/design.service';
import { JwtAuthGuard } from '../src/auth/jwt.guard';
import { StorageService } from '../src/generator/storage.service';
import { GeneratorService } from '../src/generator/generator.service';
import { Currency } from '../src/template/currency/currency.entity';
import { Size } from '../src/template/size/size.entity';
import { TemplateSideService } from '../src/template/side/template-side.service';
import { Design } from '../src/design/design.entity';
import { Template } from '../src/template/template.entity';
import { TemplateColorService } from '../src/template/color/template-color.service';
import { DesignSideService } from '../src/design/side/design-side.service';
import { TemplateImageService } from '../src/template/image/template-image.service';
import { MailService } from '../src/mail/mail.service';

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
  clientService: ClientService;
  designService: DesignService;
  designSideService: DesignSideService;
  templateService: TemplateService;
  templateColorService: TemplateColorService;
  templateImageService: TemplateImageService;
  templateSideService: TemplateSideService;
  userService: UserService;
  currencyRepo;
  roleRepo;
  sizeRepo;

  adminRole: Role;
  userRole: Role;
  superAdminRole: Role;
  defaultClient: Client;
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
    this.clientService = this.testingModule.get<ClientService>(ClientService);
    this.designService = this.testingModule.get<DesignService>(DesignService);
    this.designSideService =
      this.testingModule.get<DesignSideService>(DesignSideService);
    this.templateService =
      this.testingModule.get<TemplateService>(TemplateService);
    this.templateColorService =
      this.testingModule.get<TemplateColorService>(TemplateColorService);
    this.templateImageService =
      this.testingModule.get<TemplateImageService>(TemplateImageService);
    this.templateSideService =
      this.testingModule.get<TemplateSideService>(TemplateSideService);
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
    this.defaultClient = await this.createClient(this.defaultUser);
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

  async createClient(user?: User) {
    if (!user) {
      user = await this.createDemoUser();
    }

    return this.clientService.create(user, {
      domain: faker.internet.domainName(),
      name: faker.company.name(),
    });
  }

  async createDesignSide(design?: Design) {
    const templateSide = await this.createTemplateSide();

    if (!design) {
      design = await this.createDesign();
    }

    const side = await this.designSideService.create(
      {
        templateSideId: templateSide.id,
        hasGraphics: faker.datatype.boolean(),
        hasText: faker.datatype.boolean(),
        canvasState: faker.datatype.json(),
        image: TestUtils.FAKE_BASE64_IMAGE,
        preview: TestUtils.FAKE_BASE64_IMAGE,
      },
      design.id,
      design.client.id,
    );

    return side;
  }

  async createTemplate(client?: Client, user?: User) {
    if (!client) {
      client = await this.createClient(user);
    }

    return this.templateService.create(
      {
        name: faker.commerce.productName(),
        fabric: faker.commerce.productDescription(),
        currencyId: 1,
        price: Number(faker.commerce.price()),
        madeIn: faker.location.country(),
        fit: faker.commerce.productAdjective(),
        material: faker.commerce.productMaterial(),
        sizeIds: [1, 2],
      },
      client.id,
    );
  }

  async createTemplateColor(template?: Template) {
    if (!template) {
      template = await this.createTemplate();
    }

    return this.templateColorService.create(
      {
        name: faker.color.human(),
        hex: faker.color.rgb(),
      },
      template.id,
    );
  }

  async createTemplateSide(template?: Template) {
    if (!template) {
      template = await this.createTemplate();
    }

    return this.templateSideService.create(
      {
        name: faker.commerce.productName(),
        hasArea: true,
        heightCm: faker.number.int(50),
        widthCm: faker.number.int(50),
      },
      template.id,
    );
  }

  async createTemplateImage(
    template: Template,
    templateColorId: string,
    templateSideId: string,
  ) {
    if (!template) {
      template = await this.createTemplate();
    }

    return this.templateImageService.create({
      templateColorId,
      templateSideId,
      image: TestUtils.FAKE_BASE64_IMAGE,
    });
  }

  async createDesign(options?: ICreateDesignOptions): Promise<Design> {
    const user = options?.user || (await this.createDemoUser());
    const client =
      options?.client ||
      options?.template?.client ||
      (await this.createClient(user));
    const template = options?.template || (await this.createTemplate(client));

    const design = await this.designService.create(
      {
        name: options?.name || faker.commerce.productName(),
        templateColorId:
          options?.color?.id || (await this.createTemplateColor(template)).id,
        sizeId:
          options?.size?.id ||
          faker.number.int({ min: 1, max: template.sizes.length }),
        templateId: template.id,
      },
      user,
      client,
    );

    return design;
  }
}
