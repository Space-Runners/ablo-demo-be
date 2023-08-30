import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateColorDates1692959684056 implements MigrationInterface {
  name = 'AddTemplateColorDates1692959684056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_color"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "template_color"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_color" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_color" DROP COLUMN "created_at"
        `);
  }
}
