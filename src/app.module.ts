import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualAccountModule } from './virtual-account/virtual-account.module';
import { AirdropModule } from './airdrop/airdrop.module';

@Module({
  imports: [VirtualAccountModule, AirdropModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
