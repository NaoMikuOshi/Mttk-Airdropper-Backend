import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { customAlphabet } from 'nanoid/async';
import { AirdropEvent } from '../entities/AirdropEvent.entity';
import { ClaimService } from '../claim/claim.service';
import { Decimal } from 'decimal.js';
import * as moment from 'moment';
import { Repository } from 'typeorm';

@Injectable()
export class AirdropService extends TypeOrmCrudService<AirdropEvent> {
  constructor(
    @InjectRepository(AirdropEvent)
    readonly repo: Repository<AirdropEvent>,
    private readonly httpService: HttpService,
    private readonly claimService: ClaimService,
  ) {
    super(repo);
  }
  async createOne(req, dto) {
    const { title, tokenId, amount, quantity, duration, owner } = dto;
    let airdropItem = new AirdropEvent();
    const cashtag = await this.genCharacterNumber(12);
    airdropItem.owner = owner;
    airdropItem.cashtag = cashtag;
    airdropItem.title = title;
    airdropItem.token_id = tokenId;
    airdropItem.amount = amount;
    airdropItem.quantity = quantity;
    airdropItem.duration = duration;
    return this.repo.save(airdropItem);
  }
  async genCharacterNumber(length) {
    const nanoid = customAlphabet(
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      length,
    );
    return nanoid();
  }

  async claim(reqBody, access_token: string) {
    // @todo: needs a rewrite, use scheduled tasks to avoid transaction have race condition
    const { to, amount, memo, cashtag } = reqBody;
    const airdropResult = await this.repo.findOne({ cashtag });
    const tokenId = airdropResult.token_id;
    const result = await this.transfer(
      { tokenId, to, amount, memo },
      access_token,
    );
    console.log('transfer end result: ', result);
    if (result.code !== 0) {
      throw new InternalServerErrorException('Error happened in transfer');
    }
    return this.claimService.createClaim({
      uid: to,
      cashtag,
      amount,
      token_id: tokenId,
      tx_hash: result.data.tx_hash,
    });
  }
  async transfer(reqBody, access_token: string) {
    console.log('transfer start params: ', reqBody, access_token);
    const { tokenId, to, amount, memo } = reqBody;
    return this.httpService
      .post(
        '/minetoken/transfer',
        {
          tokenId,
          to,
          amount,
          memo,
        },
        {
          headers: {
            'x-access-token': access_token,
          },
        },
      )
      .toPromise()
      .then((res) => res.data);
  }
  async airdrop(reqBody, access_token: string) {
    const { tokenId, amount, title } = reqBody;
    const memo = title;
    const to = Number(process.env.TEMP_UID);
    const result = await this.transfer(
      { tokenId, to, amount, memo },
      access_token,
    );
    console.log('transfer end result: ', result);
    return result;
  }
  async getAirdropAmount(cashtag): Promise<Number> {
    /* const claimLogRepoResult = await this.claimLogRepo
    .createQueryBuilder('claimLog')
    .select(' SUM(amount) as total ')
    .where('cashtag = :cashtag')
    .setParameters({ cashtag })
    .getMany(); */
    const airdropResult = await this.repo.findOne({ cashtag });
    if (!airdropResult) return 0;
    const claimLogResult = await this.repo.query(
      'SELECT SUM(amount) as total FROM ' +
        process.env.DB_SCHEMA +
        '.claim_log WHERE cashtag = $1;',
      [cashtag],
    );
    const claimTotal = claimLogResult[0].total || 0;
    const { amount, quantity } = airdropResult;
    if (amount <= claimTotal) return 0;
    const equally = Math.floor(amount / quantity);
    const d_amount = new Decimal(amount);
    const rest = parseFloat(d_amount.minus(claimTotal).toString());
    if (rest < equally) return rest;
    return equally;
  }
  async isAirdropExpired(cashtag): Promise<Boolean> {
    const airdropResult = await this.repo.findOne({ cashtag });
    if (!airdropResult) return false;
    const { created_at, duration } = airdropResult;
    const expiredTime = moment(created_at).add(duration, 'd');
    return moment().isAfter(expiredTime);
  }
  async alreadyGetAirdrop(uid, cashtag) {
    const airdropResult = await this.claimService.findOne({ uid, cashtag });
    if (airdropResult) {
      return true;
    } else {
      return false;
    }
  }
  // 获取用户余额
  async balance(tokenId, access_token: string) {
    return this.httpService
      .get('/minetoken/balance', {
        params: { tokenId },
        headers: {
          'x-access-token': access_token,
        },
      })
      .toPromise()
      .then((res) => res.data);
  }
}
