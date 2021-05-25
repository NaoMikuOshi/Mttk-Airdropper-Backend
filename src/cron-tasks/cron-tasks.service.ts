import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimLog } from 'src/entities/ClaimLog.entity';
import { Repository } from 'typeorm';
import { AirdropService } from 'src/airdrop/airdrop.service';
import { AuthService } from 'src/auth/auth.service';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CronTasksService {
  private middlemanAccessToken: string = null;
  constructor(
    @InjectRepository(ClaimLog)
    private readonly claimRepo: Repository<ClaimLog>,
    @InjectRepository(AirdropEvent)
    private readonly aeRepo: Repository<AirdropEvent>,
    private readonly airdropService: AirdropService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
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

    try {
      const result = await this.airdropService.transfer(
        notSentLog.token_id,
        notSentLog.uid,
        notSentLog.amount,
        `Payout from Airdrop(cashtag: $${notSentLog.cashtag})`,
        this.middlemanAccessToken,
      );
      notSentLog.status = 'ok';
      notSentLog.tx_hash = result.data.tx_hash;
      await this.claimRepo.save(notSentLog);
      this.logger.log(
        `Claim transaction ${notSentLog.id} is now sent, txHash is ${notSentLog.tx_hash}`,
      );
    } catch (error) {
      this.logger.error(`Bad Transfer when handling ${notSentLog.id}`);
      this.notificationService.pushTextToDingTalk(`发放空投失败
      交易详情:
      发奖到 UID：${notSentLog.uid}
      金额：${notSentLog.amount / 10 ** 4}
      币种 TID：${notSentLog.token_id}
      已跳过，请及时处理。`);
      notSentLog.status = 'error';
      await this.claimRepo.save(notSentLog);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateFinished() {
    const currentActiveEvents = await this.aeRepo.find({ status: 'active' });
    const finishedEvents = currentActiveEvents.filter(
      (event) => event.quantity == event.claimed,
    );
    if (finishedEvents.length === 0) return;
    const ableToUpdate: AirdropEvent[] = finishedEvents.map((e) => ({
      ...e,
      status: 'finished',
    }));
    await this.aeRepo.save(ableToUpdate);
    this.logger.log(
      'update status as finished for events id: ' +
        finishedEvents.map((e) => e.id).join(),
    );
  }
}
