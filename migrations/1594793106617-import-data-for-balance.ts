import { MigrationInterface, QueryRunner } from 'typeorm';

export class importDataForBalance1594793106617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { options } = queryRunner.connection;
    if (options.type !== 'postgres') {
      throw new Error('Require PostgreSQL database');
    }

    const schema = options.schema ?? 'public';
    const totalPayoutOfEachEvents = await queryRunner.query(
      `SELECT "eventId", SUM(amount) as "totalOfPayouts"
          FROM "${schema}"."claim_log"
          GROUP BY claim_log."eventId";`,
    );
    const totalOfEachEvents = await queryRunner.query(
      `SELECT id, amount FROM "${schema}".airdrop_event;`,
    );
    const req = totalPayoutOfEachEvents.map(({ eventId, totalOfPayouts }) => {
      const event = totalOfEachEvents.find((e) => e.id === eventId);
      const balance = event.amount - totalOfPayouts;
      return queryRunner.query(
        `UPDATE "${schema}"."airdrop_event" SET balance = ${balance} where "airdrop_event".id = ${eventId};`,
      );
    });
    await Promise.all(req);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { options } = queryRunner.connection;
    if (options.type !== 'postgres') {
      throw new Error('Require PostgreSQL database');
    }

    const schema = options.schema ?? 'public';
    await queryRunner.query(
      `UPDATE "${schema}"."airdrop_event" SET balance = 0;`,
    );
  }
}
