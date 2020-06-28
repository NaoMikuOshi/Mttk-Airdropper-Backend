import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AirdropEvent } from './AirdropEvent.entity';

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

  @ManyToOne((type) => AirdropEvent, (ae) => ae.claimLogs)
  event: AirdropEvent;

  @Column()
  tx_hash: string;

  @Column('timestamp with time zone', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
