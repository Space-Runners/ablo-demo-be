import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientsToPhotos1691771033586 implements MigrationInterface {
  name = 'ClientsToPhotos1691771033586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop all photos first
    await queryRunner.query(`DELETE FROM "photo"`);

    await queryRunner.query(`
            ALTER TABLE "photo"
            ADD "client_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "photo"
            ADD CONSTRAINT "FK_9337e1dc541572b584431c3a5da" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "photo" DROP CONSTRAINT "FK_9337e1dc541572b584431c3a5da"
        `);
    await queryRunner.query(`
            ALTER TABLE "photo" DROP COLUMN "client_id"
        `);
  }
}
