import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateClientRequired1692188526982 implements MigrationInterface {
  name = 'TemplateClientRequired1692188526982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_6e402af08ea7748e36be22e8240"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_269fe34413474442bf38e76b8c"
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ALTER COLUMN "client_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_269fe34413474442bf38e76b8c" ON "template" ("name", "client_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_6e402af08ea7748e36be22e8240" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_6e402af08ea7748e36be22e8240"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_269fe34413474442bf38e76b8c"
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ALTER COLUMN "client_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_269fe34413474442bf38e76b8c" ON "template" ("name", "client_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_6e402af08ea7748e36be22e8240" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
