import { Module } from '@nestjs/common';
import { CronTasksService } from './cron-tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimLog } from 'src/entities/ClaimLog.entity';
import { AirdropModule } from 'src/airdrop/airdrop.module';
import { AuthModule } from 'src/auth/auth.module';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClaimLog, AirdropEvent]),
    AirdropModule,
    NotificationModule,
    AuthModule,
  ],
  providers: [CronTasksService],
})
export class CronTasksModule {}
