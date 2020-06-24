import { Controller, Get, Headers } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { VirtualAccountService } from './virtual-account/virtual-account.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly virtualAccountService: VirtualAccountService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/ttt')
  async getAccess(@Headers('x-access-token') accessToken: string): Promise<any> {
    const access_token = await this.virtualAccountService.getAccessToken();
    console.log(access_token)
    return access_token;
  }
}
