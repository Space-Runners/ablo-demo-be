import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignUserNullable1692821748940 implements MigrationInterface {
  name = 'DesignUserNullable1692821748940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6"
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6"
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_b8ce694f1fb91d8c34f9002cec6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
