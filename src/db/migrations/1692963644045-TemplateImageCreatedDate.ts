import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateImageCreatedDate1692963644045
  implements MigrationInterface
{
  name = 'TemplateImageCreatedDate1692963644045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_image"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_image" DROP COLUMN "created_at"
        `);
  }
}
