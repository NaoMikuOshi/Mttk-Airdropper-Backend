import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';

@Module({
  providers: [VirtualAccountService]
})
export class VirtualAccountModule {}
