import { Controller, Get } from '@nestjs/common';
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
  getAccess(): Observable<any> {
    const access_token = this.virtualAccountService.getAccessToken();
    return access_token;
  }
}
