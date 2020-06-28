import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClaimLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: number;

  @Column()
  cashtag: string;

  @Column()
  amount: number;

  @Column()
  token_id: number;

  @Column()
  tx_hash: string;

  @Column('timestamp with time zone', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
