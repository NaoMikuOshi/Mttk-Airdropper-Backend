import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/:uid')
  async getUser(@Param('uid', ParseIntPipe) uid: number) {
    const logs = await this.service.findClaimLogsOf(uid);
    const events = await this.service.findAirdropEventOf(uid);
    return { logs, events };
  }

  @Get('/:uid/claims')
  async getClaimsOf(@Param('uid', ParseIntPipe) uid: number) {
    const logs = await this.service.findClaimLogsOf(uid);
    return { logs };
  }

  @Get('/:uid/events')
  async getEventOf(@Param('uid', ParseIntPipe) uid: number) {
    const events = await this.service.findAirdropEventOf(uid);
    return { events };
  }
}
