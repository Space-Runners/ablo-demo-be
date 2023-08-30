import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditorStateChanges1692032889403 implements MigrationInterface {
  name = 'EditorStateChanges1692032889403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "garment_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "garment_color" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "editor_state"
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "editor_state" jsonb
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "editor_state"
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "editor_state" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "garment_color"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "garment_id"
            SET NOT NULL
        `);
  }
}
