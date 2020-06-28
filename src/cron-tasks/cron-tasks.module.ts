import { Module } from '@nestjs/common';
import { CronTasksService } from './cron-tasks.service';

@Module({
  providers: [CronTasksService],
})
export class CronTasksModule {}
