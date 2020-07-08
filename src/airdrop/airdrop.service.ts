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
    const { title, tokenId, amount, quantity, owner } = dto;
    let airdropItem = new AirdropEvent();
    const cashtag = await this.genCharacterNumber(12);
    airdropItem.owner = owner;
    airdropItem.cashtag = cashtag;
    airdropItem.title = title;
    airdropItem.token_id = tokenId;
    airdropItem.amount = amount;
    airdropItem.quantity = quantity;
    return this.repo.save(airdropItem);
  }
  async genCharacterNumber(length) {
    const nanoid = customAlphabet(
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      length,
    );
    return nanoid();
  }

  async claim(reqBody) {
    const { to, amount, memo, cashtag } = reqBody;
    const airdropResult = await this.repo.findOne({ cashtag });
    const tokenId = airdropResult.token_id;

    return this.claimService.createClaim(
      {
        uid: to,
        cashtag,
        amount,
        token_id: tokenId,
        tx_hash: null,
      },
      airdropResult,
    );
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

  async stopAirdrop(cashtag: string) {
    const airdrop = await this.repo.findOne({ cashtag });
    airdrop.status = 'stopped';
    return this.repo.save(airdrop);
  }

  async isAirDropFinished(cashtag: string) {
    const airdrop = await this.repo.findOne({ cashtag });
    return airdrop.claimed >= airdrop.quantity;
  }

  async getAirdropAmount(cashtag: string) {
    const airdropResult = await this.repo.findOne({ cashtag });
    if (!airdropResult) return 0;
    const claimTotal = await this.claimService.getTotalClaimedOf(cashtag);
    const { amount, quantity } = airdropResult;
    if (amount <= claimTotal) return 0;
    const equally = Math.floor(amount / quantity);
    const d_amount = new Decimal(amount);
    const rest = parseFloat(d_amount.minus(claimTotal).toString());
    if (rest < equally) return rest;
    return equally;
  }
  async alreadyGetAirdrop(uid: number, cashtag: string) {
    const airdropResult = await this.getClaimLogForUser(uid, cashtag);
    if (airdropResult) {
      return true;
    } else {
      return false;
    }
  }

  getClaimLogForUser(uid: number, cashtag: string) {
    return this.claimService.findOne({ uid, cashtag });
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
