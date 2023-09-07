import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/user/role.entity';
import { User } from '../src/user/user.entity';
import { ICreateUserOptions, imports } from '.';
import { AuthService } from '../src/auth/auth.service';
import { RoleName } from '../src/auth/role-name.enum';
import { DesignService } from '../src/design/design.service';
import { JwtAuthGuard } from '../src/auth/jwt.guard';
import { MailService } from '../src/mail/mail.service';
import { Design } from '../src/design/design.entity';
import { Equal } from 'typeorm';

// Set timeout to 20s (each suite recreates the DB)
jest.setTimeout(20000);

export class TestUtils {
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
  userService: UserService;
  designRepo;
  roleRepo;

  adminRole: Role;
  userRole: Role;
  superAdminRole: Role;
  defaultUser: User;

  async close() {
    await this.app.close();
  }

  async init() {
    const mailServiceMock = {
      sendVerificationEmail: jest.fn(),
      send: jest.fn(),
    };
    const designServiceMock = {
      getAllForUser: async (userId: string) =>
        await this.designRepo.findBy({ userId }),
      getOne: async (id: string) =>
        await this.designRepo.findOne({ where: { id: Equal(id) } }),
      create: async (dto: any, user: User) =>
        await this.designRepo.save({
          id: faker.string.uuid(),
          userId: user.id,
        }),
      patch: () => {
        return {};
      },
      delete: () => async (id: string) => await this.designRepo.delete({ id }),
      checkAuth: () => true,
    };

    this.testingModule = await Test.createTestingModule({
      imports,
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(JwtAuthGuard)
      .overrideProvider(MailService)
      .useValue(mailServiceMock)
      .overrideProvider(DesignService)
      .useValue(designServiceMock)
      .compile();

    // Services
    this.authService = this.testingModule.get<AuthService>(AuthService);
    this.designService = this.testingModule.get<DesignService>(DesignService);
    this.userService = this.testingModule.get<UserService>(UserService);
    // Repos
    this.designRepo = this.testingModule.get(getRepositoryToken(Design));
    this.roleRepo = this.testingModule.get(getRepositoryToken(Role));

    this.app = this.testingModule.createNestApplication();
    await this.app.init();

    // Init defaults
    this.adminRole = await this.roleRepo.save({ name: RoleName.Admin });
    this.userRole = await this.roleRepo.save({ name: RoleName.User });
    this.superAdminRole = await this.roleRepo.save({
      name: RoleName.SuperAdmin,
    });
    this.defaultUser = await this.createDemoUser();
  }

  async createSuperAdmin(): Promise<User> {
    const superuser = await this.createDemoUser({ role: this.superAdminRole });
    return superuser;
  }

  async createDesign(user: User): Promise<Design> {
    return await this.designRepo.save({
      id: faker.string.uuid(),
      userId: user.id,
    });
  }

  async createDemoUser(options?: ICreateUserOptions): Promise<User> {
    const user = await this.userService.create(
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
}
