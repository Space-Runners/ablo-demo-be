import { MigrationInterface, QueryRunner } from 'typeorm';
import { Client } from '../../clients/client.entity';

export class AddClientDomain1692636095591 implements MigrationInterface {
  name = 'AddClientDomain1692636095591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_fed09e6f9c08a5031ba1e3e9701"
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key" DROP CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4"
        `);

    // Save all existing clients and API keys
    const clients: Client[] = await queryRunner.query(`
            SELECT * FROM "client"
        `);

    // Save all existing photos
    const photos = await queryRunner.query(`
            SELECT * FROM "photo"
        `);

    // Save all exsiting designs
    const designs = await queryRunner.query(`
            SELECT * FROM "design"
        `);

    // Delete all photos
    await queryRunner.query(`
            DELETE FROM "photo"
        `);

    // Delete all designs
    await queryRunner.query(`
            DELETE FROM "design"
        `);

    // Delete all existing clients and API keys
    await queryRunner.query(`
            DELETE FROM "client"
        `);

    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "domain" character varying NOT NULL
        `);

    // Re-insert all clients and API keys
    for (const client of clients) {
      await queryRunner.query(`
                    INSERT INTO "client" ("id", "name", "domain") VALUES ('${client.id}', '${client.name}', '${client.name}.com')
                `);
    }

    // Re-insert all photos
    for (const photo of photos) {
      await queryRunner.query(`
            INSERT INTO photo (id, url, client_id) VALUES ('${photo.id}', '${photo.url}', '${photo.client_id}')
        `);
    }

    // Re-insert all designs
    for (const design of designs) {
      await queryRunner.query(`
                INSERT INTO design (id, name, client_id, user_id) VALUES ('${design.id}', '${design.name}', '${design.client_id}', '${design.user_id}')
            `);
    }

    await queryRunner.query(`
            ALTER TABLE "client"
            ADD CONSTRAINT "UQ_0ee4904a4ebdc9352c6ece06aaf" UNIQUE ("domain")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_fed09e6f9c08a5031ba1e3e9701" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "user" DROP CONSTRAINT "FK_fed09e6f9c08a5031ba1e3e9701"
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP CONSTRAINT "UQ_0ee4904a4ebdc9352c6ece06aaf"
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "domain"
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key"
            ADD CONSTRAINT "FK_f0d652528d940ee151a5fc5fed4" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_fed09e6f9c08a5031ba1e3e9701" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
