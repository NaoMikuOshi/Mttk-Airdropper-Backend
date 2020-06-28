import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { AirdropList } from 'src/entities/AirdropList.entity';
require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, AirdropList])],
  providers: [VirtualAccountService],
  exports: [VirtualAccountService],
})
export class VirtualAccountModule {}
