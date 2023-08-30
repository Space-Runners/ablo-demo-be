import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateImageUniqueColorSide1693305128458
  implements MigrationInterface
{
  name = 'TemplateImageUniqueColorSide1693305128458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_image"
            ADD CONSTRAINT "UQ_4703118e473bbf5942cd736ff6b" UNIQUE ("template_color_id", "template_side_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_image" DROP CONSTRAINT "UQ_4703118e473bbf5942cd736ff6b"
        `);
  }
}
