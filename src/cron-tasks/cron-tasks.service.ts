import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimLog } from 'src/entities/ClaimLog.entity';
import { Repository } from 'typeorm';
import { AirdropService } from 'src/airdrop/airdrop.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CronTasksService {
  private middlemanAccessToken: string = null;
  constructor(
    @InjectRepository(ClaimLog)
    private readonly claimRepo: Repository<ClaimLog>,
    private readonly airdropService: AirdropService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(CronTasksService.name);

  onApplicationBootstrap() {
    this.logger.log('Crontask module initialized, get accessToken now...');
    this.updateAccessToken();
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async updateAccessToken() {
    const middlemanAccessToken = await this.authService.getAccessToken();
    this.middlemanAccessToken = middlemanAccessToken.data;
    this.logger.log(
      'AccessToken updated, new token is: ' + this.middlemanAccessToken,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendoutAirdrop() {
    const notSentLog = await this.claimRepo.findOne({
      where: { status: 'pending' },
    });
    if (!this.middlemanAccessToken) {
      this.logger.warn(
        'no AccessToken was found, fetching it now, will sendout in the next minute',
      );
      this.updateAccessToken();
      return;
    }
    if (!notSentLog) {
      this.logger.log(
        'no pending transactions for now, waiting for the next minute.',
      );
      return;
    }
    const result = await this.airdropService.transfer(
      notSentLog.token_id,
      notSentLog.uid,
      notSentLog.amount,
      `Payout from Airdrop(cashtag: $${notSentLog.cashtag})`,
      this.middlemanAccessToken,
    );
    notSentLog.status = 'ok';
    notSentLog.tx_hash = result.data.tx_hash;
    this.claimRepo.save(notSentLog);
    this.logger.log(
      `Claim transaction ${notSentLog.id} is now sent, txHash is ${notSentLog.tx_hash}`,
    );
  }
}
