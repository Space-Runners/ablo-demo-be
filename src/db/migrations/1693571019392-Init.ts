import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../user/role.entity';
import { User } from '../../user/user.entity';

export class Init1693571019392 implements MigrationInterface {
  name = 'Init1693571019392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "role" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"),
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "reset_token" (
                "token" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "expires_at" TIMESTAMP NOT NULL,
                "has_been_used" boolean NOT NULL DEFAULT false,
                "user_id" uuid NOT NULL,
                CONSTRAINT "REL_765e2b25e88f51c41139d83ff7" UNIQUE ("user_id"),
                CONSTRAINT "PK_4765b68e90a8b2cf4b05a6a1c0d" PRIMARY KEY ("token")
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
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "social_login" character varying,
                "social_id" character varying,
                "verified" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "design" (
                "id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                CONSTRAINT "PK_e7a44f12414f03b7f38ff26dc8c" PRIMARY KEY ("id")
            )
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
            ALTER TABLE "reset_token"
            ADD CONSTRAINT "FK_765e2b25e88f51c41139d83ff76" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
        { name: 'admin' },
        { name: 'user' },
        { name: 'guest' },
      ]),
    );
    const adminRole = roles.find((r) => r.name === 'admin');
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
          roles: [adminRole],
        },
        {
          email: 'mihovil@spacerunners.com',
          firstName: 'Mihovil',
          lastName: 'Kovacevic',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$BTaY56aBY4bElCF+Dldefw$ZvlnRQoprziGcxcXPxdGhriagULC/pG8zgmiF6dKroE',
          verified: true,
          isActive: true,
          roles: [adminRole],
        },
        {
          email: 'karim@spacerunners.com',
          firstName: 'Karim',
          lastName: 'Varela',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$oUp97HSiUCcH6lEqTJb/eg$nQ1ldXkybl40aheiUcSetTfFy51Ljx+PJsHqic8w7Hs',
          verified: true,
          isActive: true,
          roles: [adminRole],
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
            ALTER TABLE "design" DROP CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6"
        `);
    await queryRunner.query(`
            ALTER TABLE "reset_token" DROP CONSTRAINT "FK_765e2b25e88f51c41139d83ff76"
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
            DROP TABLE "design"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "reset_token"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
  }
}
