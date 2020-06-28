import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { AirdropService } from './airdrop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
import { ClaimLog } from 'src/entities/ClaimLog.entity';
import { AuthModule } from '../auth/auth.module';
import { ClaimModule } from '../claim/claim.module';

@Module({
  imports: [
    ClaimModule,
    AuthModule,
    TypeOrmModule.forFeature([Transaction, AirdropEvent, ClaimLog]),
  ],
  controllers: [AirdropController],
  providers: [AirdropService],
})
export class AirdropModule {}
