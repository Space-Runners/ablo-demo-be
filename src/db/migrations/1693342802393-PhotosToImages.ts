import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhotosToImages1693342802393 implements MigrationInterface {
  name = 'PhotosToImages1693342802393';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "image" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" character varying,
                "temporary" boolean NOT NULL DEFAULT false,
                "client_id" uuid NOT NULL,
                CONSTRAINT "UQ_602959dc3010ff4b4805ee7f104" UNIQUE ("url"),
                CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_f68e3608c01d52a0632f6c332be" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_f68e3608c01d52a0632f6c332be"
        `);
    await queryRunner.query(`
            DROP TABLE "image"
        `);
  }
}
