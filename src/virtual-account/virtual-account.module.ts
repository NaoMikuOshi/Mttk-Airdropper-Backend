import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { VirtualAccount } from 'src/entities/VirtualAccount.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ VirtualAccount, Transaction ]) ],
  providers: [VirtualAccountService]
})
export class VirtualAccountModule {}
