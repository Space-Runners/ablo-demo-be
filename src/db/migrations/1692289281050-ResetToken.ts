import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResetToken1692289281050 implements MigrationInterface {
  name = 'ResetToken1692289281050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "reset_token" (
                "token" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "expires_at" TIMESTAMP NOT NULL,
                "has_been_used" boolean NOT NULL DEFAULT false,
                "user_id" uuid NOT NULL,
                CONSTRAINT "REL_765e2b25e88f51c41139d83ff7" UNIQUE ("user_id"),
                CONSTRAINT "PK_4765b68e90a8b2cf4b05a6a1c0d" PRIMARY KEY ("token")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "reset_token"
            ADD CONSTRAINT "FK_765e2b25e88f51c41139d83ff76" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reset_token" DROP CONSTRAINT "FK_765e2b25e88f51c41139d83ff76"
        `);
    await queryRunner.query(`
            DROP TABLE "reset_token"
        `);
  }
}
