import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAirdropBalance1594725510220 implements MigrationInterface {
  name = 'addAirdropBalance1594725510220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { options } = queryRunner.connection;
    if (options.type !== 'postgres') {
      throw new Error('Require PostgreSQL database');
    }

    const schema = options.schema ?? 'public';
    await queryRunner.query(
      `ALTER TABLE "${schema}"."airdrop_event" ADD "balance" integer NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { options } = queryRunner.connection;
    if (options.type !== 'postgres') {
      throw new Error('Require PostgreSQL database');
    }

    const schema = options.schema ?? 'public';
    await queryRunner.query(
      `ALTER TABLE "${schema}"."airdrop_event" DROP COLUMN "balance"`,
    );
  }
}
