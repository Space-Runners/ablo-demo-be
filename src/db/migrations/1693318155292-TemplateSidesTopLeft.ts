import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateSidesTopLeft1693318155292 implements MigrationInterface {
  name = 'TemplateSidesTopLeft1693318155292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_side"
            ADD "top" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side"
            ADD "left" integer
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_side" DROP COLUMN "left"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side" DROP COLUMN "top"
        `);
  }
}
