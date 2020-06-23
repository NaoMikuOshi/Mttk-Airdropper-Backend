import { Module, HttpModule } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { VirtualAccount } from 'src/entities/VirtualAccount.entity';
import { AirdropList } from 'src/entities/AirdropList.entity';
require('dotenv').config();

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.MTTK_API_URL,
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([ VirtualAccount, Transaction, AirdropList ]) ],
  providers: [HttpModule, VirtualAccountService],
  exports: [HttpModule, VirtualAccountService],
})
export class VirtualAccountModule {}
