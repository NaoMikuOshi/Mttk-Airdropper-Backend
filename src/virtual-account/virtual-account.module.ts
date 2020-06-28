import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, AirdropEvent])],
  providers: [VirtualAccountService],
  exports: [VirtualAccountService],
})
export class VirtualAccountModule {}
