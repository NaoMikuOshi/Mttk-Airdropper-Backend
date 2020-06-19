import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { VirtualAccount } from './VirtualAccount.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => VirtualAccount, va => va.transactions)
  from: VirtualAccount;

  @Column()
  to: number;

  @Column()
  txCount: number;

  @Column()
  amount: string;
}
