import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualAccountModule } from './virtual-account/virtual-account.module';
import { AirdropModule } from './airdrop/airdrop.module';
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
      synchronize: true,
      autoLoadEntities: true,
    }),
    VirtualAccountModule, AirdropModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
