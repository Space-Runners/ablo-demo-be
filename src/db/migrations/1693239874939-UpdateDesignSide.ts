import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDesignSide1693239874939 implements MigrationInterface {
  name = 'UpdateDesignSide1693239874939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design_side"
                RENAME COLUMN "canvas_url" TO "canvas_state_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "editor_state"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "garment_color"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "garment_color" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "editor_state" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "design_side"
                RENAME COLUMN "canvas_state_url" TO "canvas_url"
        `);
  }
}
