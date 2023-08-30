import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignSidesAdditions1692908443024 implements MigrationInterface {
  name = 'DesignSidesAdditions1692908443024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_side"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template_side" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "template_side" DROP COLUMN "created_at"
        `);
  }
}
