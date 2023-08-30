import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../user/role.entity';
import { User } from '../../user/user.entity';

export class Initial1691612146034 implements MigrationInterface {
  name = 'Initial1691612146034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "photo" (
                "id" SERIAL NOT NULL,
                "url" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "user_id" character varying,
                "temporary" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_26e2f7347378254c076729d53cb" UNIQUE ("url"),
                CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "configuration" (
                "id" SERIAL NOT NULL,
                "engine_id" character varying NOT NULL,
                "keywords" character varying NOT NULL,
                "parameters" jsonb NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "PK_03bad512915052d2342358f0d8b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "api_key" (
                "id" SERIAL NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "key" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "client_id" uuid NOT NULL,
                CONSTRAINT "REL_f0d652528d940ee151a5fc5fed" UNIQUE ("client_id"),
                CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "role" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"),
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "design" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "garment_id" integer NOT NULL,
                "garment_color" character varying NOT NULL,
                "editor_state" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_e7a44f12414f03b7f38ff26dc8c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying NOT NULL,
                "last_name" character varying,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "social_login" character varying,
                "social_id" character varying,
                "verified" boolean NOT NULL DEFAULT false,
                "client_id" uuid,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "client" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_480f88a019346eae487a0cd7f0c" UNIQUE ("name"),
                CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "user_id" uuid NOT NULL,
                "client_id" uuid,
                CONSTRAINT "UQ_3a50106e03fb06a0063d44200ff" UNIQUE ("url"),
                CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_af82130bb2aecafe768bfcdfb8" ON "template" ("user_id", "name")
        `);
    await queryRunner.query(`
            CREATE TABLE "user_roles_role" (
                "user_id" uuid NOT NULL,
                "role_id" integer NOT NULL,
                CONSTRAINT "PK_cbb8cdf197992a93da55155c14e" PRIMARY KEY ("user_id", "role_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_09d115a69b6014d324d592f9c4" ON "user_roles_role" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0e2f5483d5e8d52043f9763453" ON "user_roles_role" ("role_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key"
            ADD CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_fed09e6f9c08a5031ba1e3e9701" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_8e88152c46dcdac7827f32b9267" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_6e402af08ea7748e36be22e8240" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_roles_role"
            ADD CONSTRAINT "FK_09d115a69b6014d324d592f9c42" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_roles_role"
            ADD CONSTRAINT "FK_0e2f5483d5e8d52043f97634538" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);

    // SEED INITIAL DATA
    // Default Roles
    const roles = await queryRunner.manager.save(
      queryRunner.manager.create<Role>(Role, [
        { name: 'super_admin' },
        { name: 'admin' },
        { name: 'user' },
      ]),
    );
    const superAdminRole = roles.find((r) => r.name === 'super_admin');
    await queryRunner.manager.save(
      queryRunner.manager.create<User>(User, [
        {
          email: 'devops@spacerunners.com',
          firstName: 'Devops',
          lastName: 'Spacerunners',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$z6Bi1PE9D8Cg5kjtXnrNAw$A05qyxde2jlwNf14zguyn3PLhRWCEvYDzIUUS2awMY4',
          verified: true,
          isActive: true,
          roles: [superAdminRole],
        },
        {
          email: 'mihovil@spacerunners.com',
          firstName: 'Mihovil',
          lastName: 'Kovacevic',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$BTaY56aBY4bElCF+Dldefw$ZvlnRQoprziGcxcXPxdGhriagULC/pG8zgmiF6dKroE',
          verified: true,
          isActive: true,
          roles: [superAdminRole],
        },
        {
          email: 'karim@spacerunners.com',
          firstName: 'Karim',
          lastName: 'Varela',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$oUp97HSiUCcH6lEqTJb/eg$nQ1ldXkybl40aheiUcSetTfFy51Ljx+PJsHqic8w7Hs',
          verified: true,
          isActive: true,
          roles: [superAdminRole],
        },
        {
          email: 'bojan@spacerunners.com',
          firstName: 'Bojan',
          lastName: 'Tosic',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$ylaUp3IzxmnVFOLZgQ89AQ$xpsZRMghFx3HA0teJ+6TvWXqFR8HI/H4/gIw2sY2MwI',
          verified: true,
          isActive: true,
          roles: [superAdminRole],
        },
      ]),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_0e2f5483d5e8d52043f97634538"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_09d115a69b6014d324d592f9c42"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_6e402af08ea7748e36be22e8240"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_8e88152c46dcdac7827f32b9267"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_fed09e6f9c08a5031ba1e3e9701"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6"
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key" DROP CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0e2f5483d5e8d52043f9763453"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_09d115a69b6014d324d592f9c4"
        `);
    await queryRunner.query(`
            DROP TABLE "user_roles_role"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_af82130bb2aecafe768bfcdfb8"
        `);
    await queryRunner.query(`
            DROP TABLE "template"
        `);
    await queryRunner.query(`
            DROP TABLE "client"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "design"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
    await queryRunner.query(`
            DROP TABLE "api_key"
        `);
    await queryRunner.query(`
            DROP TABLE "configuration"
        `);
    await queryRunner.query(`
            DROP TABLE "photo"
        `);
  }
}
