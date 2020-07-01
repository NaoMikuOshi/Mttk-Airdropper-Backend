import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimLog } from 'src/entities/ClaimLog.entity';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirdropEvent, ClaimLog])],
  controllers: [ClaimController],
  providers: [ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
