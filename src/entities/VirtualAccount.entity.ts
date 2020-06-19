import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction.entity';

@Entity()
export class VirtualAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  // Special token that can transfer token out of VA
  @Column()
  owner: number;

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  txCount: number;

  @OneToMany(type => Transaction, tx => tx.from)
  transactions: Transaction[];

  @Column()
  balance: string;
}
