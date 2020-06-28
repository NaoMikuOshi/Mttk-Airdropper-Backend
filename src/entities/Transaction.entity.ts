import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: number;

  @Column()
  txCount: number;

  @Column()
  amount: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid';

  @Column()
  txHash: string;
}
