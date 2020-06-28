import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forFeature([AirdropEvent])],
  providers: [VirtualAccountService],
  exports: [VirtualAccountService],
})
export class VirtualAccountModule {}
