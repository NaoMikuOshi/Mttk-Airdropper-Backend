import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AirdropList {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  owner: number;

  @Column()
  hash_tag: string;

  @Column()
  token_id: number;

  @Column()
  quantity: number;

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  
  @Column()
  duration: number;

  @Column()
  amount: number;
}