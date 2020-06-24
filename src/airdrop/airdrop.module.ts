import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { AirdropService } from './airdrop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { VirtualAccount } from 'src/entities/VirtualAccount.entity';
import { AirdropList } from 'src/entities/AirdropList.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ VirtualAccount, Transaction, AirdropList ]) ],
    controllers: [ AirdropController ],
    providers: [ AirdropService ]
})
export class AirdropModule {}
