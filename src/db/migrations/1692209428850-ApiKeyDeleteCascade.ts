import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApiKeyDeleteCascade1692209428850 implements MigrationInterface {
  name = 'ApiKeyDeleteCascade1692209428850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "api_key" DROP CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4"
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key"
            ADD CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "api_key" DROP CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4"
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key"
            ADD CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
