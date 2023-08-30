import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateUpdate1692707274140 implements MigrationInterface {
  name = 'TemplateUpdate1692707274140';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
                "template_id" uuid NOT NULL,
                CONSTRAINT "PK_6b207292c93a1f58fa217d8432e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template_image" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "template_color_id" uuid NOT NULL,
                "template_side_id" uuid NOT NULL,
                CONSTRAINT "PK_c1e091d952dc7e0412eb4321109" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "template_side" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "has_area" boolean NOT NULL DEFAULT true,
                "height_cm" integer,
                "width_cm" integer,
                "template_id" uuid NOT NULL,
                CONSTRAINT "PK_c5dd398d91ddf9e60a16e0278ed" PRIMARY KEY ("id")
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
            ALTER TABLE "template" DROP CONSTRAINT "UQ_3a50106e03fb06a0063d44200ff"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "url"
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "fabric" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "currency_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "price" numeric
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "made_in" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "fit" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "material" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
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
            ALTER TABLE "template_side"
            ADD CONSTRAINT "FK_7cc3c0fd1b67e11c861012440c1" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_33b18ff30f938538a0702de4938" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size"
            ADD CONSTRAINT "FK_f3c957dc35d922c05c551eaf77e" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size"
            ADD CONSTRAINT "FK_be161476ae4393f7e8b5390a74a" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size" DROP CONSTRAINT "FK_be161476ae4393f7e8b5390a74a"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_sizes_size" DROP CONSTRAINT "FK_f3c957dc35d922c05c551eaf77e"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_33b18ff30f938538a0702de4938"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side" DROP CONSTRAINT "FK_7cc3c0fd1b67e11c861012440c1"
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
            ALTER TABLE "template" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "material"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "fit"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "made_in"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "price"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "currency_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP COLUMN "fabric"
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD "url" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "UQ_3a50106e03fb06a0063d44200ff" UNIQUE ("url")
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
            DROP TABLE "template_side"
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
  }
}
