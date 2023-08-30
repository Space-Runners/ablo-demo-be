import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignsToClient1691833739169 implements MigrationInterface {
  name = 'DesignsToClient1691833739169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD "client_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ADD CONSTRAINT "FK_4d83a15afb8c62d853a1d9fc3ea" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "design" DROP CONSTRAINT "FK_4d83a15afb8c62d853a1d9fc3ea"
        `);
    await queryRunner.query(`
            ALTER TABLE "design" DROP COLUMN "client_id"
        `);
  }
}
