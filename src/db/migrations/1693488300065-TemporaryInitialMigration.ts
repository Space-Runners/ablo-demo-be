import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../user/role.entity';
import { User } from '../../user/user.entity';

export class TemporaryInitialMigration1693488300065
  implements MigrationInterface
{
  name = 'TemporaryInitialMigration1693488300065';

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
            CREATE TABLE "currency" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_77f11186dd58a8d87ad5fff0246" UNIQUE ("name"),
                CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "size" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_b8e36a8ba22b803165ac6b2c917" UNIQUE ("name"),
                CONSTRAINT "PK_66e3a0111d969aa0e5f73855c7a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template_color" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "hex" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "template_id" uuid NOT NULL,
                CONSTRAINT "PK_6b207292c93a1f58fa217d8432e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template_image" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "template_color_id" uuid NOT NULL,
                "template_side_id" uuid NOT NULL,
                CONSTRAINT "UQ_4703118e473bbf5942cd736ff6b" UNIQUE ("template_color_id", "template_side_id"),
                CONSTRAINT "PK_c1e091d952dc7e0412eb4321109" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "design_side" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "has_graphics" boolean NOT NULL DEFAULT false,
                "has_text" boolean NOT NULL DEFAULT false,
                "canvas_state_url" character varying NOT NULL,
                "image_url" character varying NOT NULL,
                "preview_url" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "design_id" uuid NOT NULL,
                "template_side_id" uuid NOT NULL,
                CONSTRAINT "REL_88c6b9b44328117b315917defd" UNIQUE ("template_side_id"),
                CONSTRAINT "PK_199391790b3d2eace943d67a915" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template_side" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "has_area" boolean NOT NULL DEFAULT true,
                "top" integer,
                "left" integer,
                "height_cm" integer,
                "width_cm" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "template_id" uuid NOT NULL,
                CONSTRAINT "PK_c5dd398d91ddf9e60a16e0278ed" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "fabric" character varying,
                "currency_id" integer,
                "price" numeric,
                "made_in" character varying,
                "fit" character varying,
                "material" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id")
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
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "garment_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "template_id" uuid NOT NULL,
                "color_id" uuid NOT NULL,
                "size_id" integer NOT NULL,
                CONSTRAINT "PK_e7a44f12414f03b7f38ff26dc8c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template_sizes_size" (
                "template_id" uuid NOT NULL,
                "size_id" integer NOT NULL,
                CONSTRAINT "PK_c983432adf94dbecd4b251fd3f4" PRIMARY KEY ("template_id", "size_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f3c957dc35d922c05c551eaf77" ON "template_sizes_size" ("template_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_be161476ae4393f7e8b5390a74" ON "template_sizes_size" ("size_id")
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
            ALTER TABLE "template_color"
            ADD CONSTRAINT "FK_4279efc986f4d190e52c07fdc89" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template_image"
            ADD CONSTRAINT "FK_d91d98ad5c00f80c6ff8c948b94" FOREIGN KEY ("template_color_id") REFERENCES "template_color"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template_image"
            ADD CONSTRAINT "FK_e05d997eba1d8e1a91e37ea25ad" FOREIGN KEY ("template_side_id") REFERENCES "template_side"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "design_side"
            ADD CONSTRAINT "FK_c7ad5eb43f89b99610fbc9e8d74" FOREIGN KEY ("design_id") REFERENCES "design"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "design_side"
            ADD CONSTRAINT "FK_88c6b9b44328117b315917defdd" FOREIGN KEY ("template_side_id") REFERENCES "template_side"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side"
            ADD CONSTRAINT "FK_7cc3c0fd1b67e11c861012440c1" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_33b18ff30f938538a0702de4938" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_8e88152c46dcdac7827f32b9267" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_4778ee5cf74ae5d9cb971646ee3" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_61d460941c583b22f8507c64195" FOREIGN KEY ("color_id") REFERENCES "template_color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_9fdbd15105daad9341462854455" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size"
            ADD CONSTRAINT "FK_f3c957dc35d922c05c551eaf77e" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size"
            ADD CONSTRAINT "FK_be161476ae4393f7e8b5390a74a" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE CASCADE
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
            ALTER TABLE "template_sizes_size" DROP CONSTRAINT "FK_be161476ae4393f7e8b5390a74a"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size" DROP CONSTRAINT "FK_f3c957dc35d922c05c551eaf77e"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_9fdbd15105daad9341462854455"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_61d460941c583b22f8507c64195"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_4778ee5cf74ae5d9cb971646ee3"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6"
        `);
    await queryRunner.query(`
            ALTER TABLE "reset_token" DROP CONSTRAINT "FK_765e2b25e88f51c41139d83ff76"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_8e88152c46dcdac7827f32b9267"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_33b18ff30f938538a0702de4938"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side" DROP CONSTRAINT "FK_7cc3c0fd1b67e11c861012440c1"
        `);
    await queryRunner.query(`
            ALTER TABLE "design_side" DROP CONSTRAINT "FK_88c6b9b44328117b315917defdd"
        `);
    await queryRunner.query(`
            ALTER TABLE "design_side" DROP CONSTRAINT "FK_c7ad5eb43f89b99610fbc9e8d74"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_image" DROP CONSTRAINT "FK_e05d997eba1d8e1a91e37ea25ad"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_image" DROP CONSTRAINT "FK_d91d98ad5c00f80c6ff8c948b94"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_color" DROP CONSTRAINT "FK_4279efc986f4d190e52c07fdc89"
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
            DROP INDEX "public"."IDX_be161476ae4393f7e8b5390a74"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f3c957dc35d922c05c551eaf77"
        `);
    await queryRunner.query(`
            DROP TABLE "template_sizes_size"
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
            DROP TABLE "template"
        `);
    await queryRunner.query(`
            DROP TABLE "template_side"
        `);
    await queryRunner.query(`
            DROP TABLE "design_side"
        `);
    await queryRunner.query(`
            DROP TABLE "template_image"
        `);
    await queryRunner.query(`
            DROP TABLE "template_color"
        `);
    await queryRunner.query(`
            DROP TABLE "size"
        `);
    await queryRunner.query(`
            DROP TABLE "currency"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
  }
}
