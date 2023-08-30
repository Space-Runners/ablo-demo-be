import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignSides1692897335174 implements MigrationInterface {
  name = 'DesignSides1692897335174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from "design"`);

    await queryRunner.query(`
            CREATE TABLE "design_side" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "has_graphics" boolean NOT NULL DEFAULT false,
                "has_text" boolean NOT NULL DEFAULT false,
                "canvas_url" character varying NOT NULL,
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
            ALTER TABLE "design"
            ADD "template_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "color_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "size_id" integer NOT NULL
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "design_side" DROP CONSTRAINT "FK_88c6b9b44328117b315917defdd"
        `);
    await queryRunner.query(`
            ALTER TABLE "design_side" DROP CONSTRAINT "FK_c7ad5eb43f89b99610fbc9e8d74"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "size_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "color_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "template_id"
        `);
    await queryRunner.query(`
            DROP TABLE "design_side"
        `);
  }
}
