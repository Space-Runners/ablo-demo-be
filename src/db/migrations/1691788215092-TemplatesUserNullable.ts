import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplatesUserNullable1691788215092 implements MigrationInterface {
  name = 'TemplatesUserNullable1691788215092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_af82130bb2aecafe768bfcdfb8"
        `);
    await queryRunner.query(`
            ALTER TABLE "role"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "photo"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_8e88152c46dcdac7827f32b9267"
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "updated_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "configuration"
            ALTER COLUMN "created_at"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_269fe34413474442bf38e76b8c" ON "template" ("name", "client_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_8e88152c46dcdac7827f32b9267" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "template" DROP CONSTRAINT "FK_8e88152c46dcdac7827f32b9267"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_269fe34413474442bf38e76b8c"
        `);
    await queryRunner.query(`
            ALTER TABLE "configuration"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "updated_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "design"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_8e88152c46dcdac7827f32b9267" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "photo"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "api_key"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "role"
            ALTER COLUMN "created_at"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_af82130bb2aecafe768bfcdfb8" ON "template" ("name", "user_id")
        `);
  }
}
