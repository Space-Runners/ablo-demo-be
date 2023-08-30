import { MigrationInterface, QueryRunner } from 'typeorm';
import { ClientService } from '../../clients/client.service';

export class AddAbloDemoClient1691695560738 implements MigrationInterface {
  ABLO_DEMO_CLIENT_NAME = 'Ablo Demo';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO client (name, created_at)
      VALUES ('${this.ABLO_DEMO_CLIENT_NAME}', NOW());
    `);

    // Get Ablo Demo client id
    const client = await queryRunner.query(`
        SELECT id FROM client WHERE name = '${this.ABLO_DEMO_CLIENT_NAME}';
    `);

    // Create API key for Ablo Demo client
    await queryRunner.query(`
        INSERT INTO api_key (client_id, key, created_at) VALUES ('${
          client[0].id
        }', '${ClientService.generateApiKey()}', NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete Ablo Demo client by name
    await queryRunner.query(`
        DELETE FROM client WHERE name = '${this.ABLO_DEMO_CLIENT_NAME}';
    `);
  }
}
