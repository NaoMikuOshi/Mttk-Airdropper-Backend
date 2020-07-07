import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualAccountModule } from './virtual-account/virtual-account.module';
import { AirdropModule } from './airdrop/airdrop.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './share.module';
import { ClaimModule } from './claim/claim.module';
import { CronTasksModule } from './cron-tasks/cron-tasks.module';
import { UserModule } from './user/user.module';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      synchronize: false,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    VirtualAccountModule,
    AirdropModule,
    AuthModule,
    SharedModule,
    ClaimModule,
    CronTasksModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
