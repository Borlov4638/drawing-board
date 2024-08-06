import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDrawingHistory1722109521904 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "drawing_history" (
        "image_id" uuid PRIMARY KEY,
        "history" jsonb NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_image_id" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "drawing_history";
    `);
  }
}
