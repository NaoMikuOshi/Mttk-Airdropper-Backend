import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAirdropStatus1594111873935 implements MigrationInterface {
  name = 'addAirdropStatus1594111873935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { options } = queryRunner.connection;
    if (options.type !== 'postgres') {
      throw new Error('Require PostgreSQL database');
    }

    const schema = options.schema ?? 'public';
    await queryRunner.query(
      `ALTER TABLE "${schema}"."airdrop_event" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { options } = queryRunner.connection;
    if (options.type !== 'postgres') {
      throw new Error('Require PostgreSQL database');
    }

    const schema = options.schema ?? 'public';
    await queryRunner.query(
      `ALTER TABLE "${schema}"."airdrop_event" DROP COLUMN "status"`,
    );
  }
}
