import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTemplateNameIndex1692813626797
  implements MigrationInterface
{
  name = 'RemoveTemplateNameIndex1692813626797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_269fe34413474442bf38e76b8c"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_269fe34413474442bf38e76b8c" ON "template" ("name", "client_id")
        `);
  }
}
