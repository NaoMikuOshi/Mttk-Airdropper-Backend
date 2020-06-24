import { Global, Module,HttpModule } from '@nestjs/common';
require('dotenv').config();

@Global()
@Module({
    imports: [
      HttpModule.register({
        baseURL: process.env.MTTK_API_URL,
        maxRedirects: 5,
      })],
    providers: [HttpModule],
    exports: [HttpModule]
  })
  export class SharedModule {}