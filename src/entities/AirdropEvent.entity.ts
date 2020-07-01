import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { ClaimLog } from './ClaimLog.entity';

@Entity()
export class AirdropEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'equal' })
  type: string | 'equal' | 'random';

  @Column()
  title: string;

  @Column()
  owner: number;

  @Column()
  cashtag: string;

  @Column()
  token_id: number;

  @Column()
  quantity: number;

  @Column('timestamp with time zone', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  amount: number;

  @OneToMany((type) => ClaimLog, (log) => log.event)
  claimLogs: ClaimLog[];

  @RelationCount((event: AirdropEvent) => event.claimLogs)
  claimed: number;
}
