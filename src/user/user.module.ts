import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
import { ClaimLog } from 'src/entities/ClaimLog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirdropEvent, ClaimLog])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
