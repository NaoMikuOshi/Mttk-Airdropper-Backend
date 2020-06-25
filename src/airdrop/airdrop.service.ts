/* import { Injectable, NotImplementedException } from '@nestjs/common';
import { of, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { InjectRepository } from '@nestjs/typeorm'
import { AirdropList } from '../entities/AirdropList.entity'
import { Repository } from 'typeorm'
import { customAlphabet } from 'nanoid/async'

@Injectable()
export class AirdropService {
    constructor(
        @InjectRepository(AirdropList) 
        private readonly AirdropRepository: Repository<AirdropList>,
    ){
    }
    async getAirdrop(id: number): Promise<AirdropList[]> {
        return await this.AirdropRepository.find({ id })
    }
    async create(airdrop): Promise<any> {
        let airdropItem = new AirdropList();
        const hash_tag = await this.genCharacterNumber(12);
        airdropItem.owner = 1111;
        airdropItem.hash_tag = hash_tag;
        airdropItem.token_id = airdrop.tokenId;
        airdropItem.amount = airdrop.amount;
        airdropItem.quantity = airdrop.quantity;
        airdropItem.duration = airdrop.duration;
        return this.AirdropRepository.save(airdropItem);
    } 
    // 生成0-9A-Za-z的随机字符串
    async genCharacterNumber(length) {
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length)
        return nanoid()
    }
} */

import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { customAlphabet } from 'nanoid/async'
import { AirdropList } from '../entities/AirdropList.entity'
import { ClaimService } from '../claim/claim.service'
import { Decimal } from 'decimal.js';
import * as moment from 'moment';

@Injectable()
export class AirdropService extends TypeOrmCrudService<AirdropList> {
  constructor(
    @InjectRepository(AirdropList) repo,
    private readonly httpService: HttpService,
    private readonly claimService: ClaimService,
    ) {
    super(repo);
  }
  async createOne(req, dto) {
    const { title, tokenId, amount, quantity, duration, owner } = dto;
    let airdropItem = new AirdropList();
    const hash_tag = await this.genCharacterNumber(12);
    airdropItem.owner = owner;
    airdropItem.hash_tag = hash_tag;
    airdropItem.title = title;
    airdropItem.token_id = tokenId;
    airdropItem.amount = amount;
    airdropItem.quantity = quantity;
    airdropItem.duration = duration;
    return this.repo.save(airdropItem)
  }
  async genCharacterNumber(length) {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length)
    return nanoid()
  }
  async claim(reqBody, access_token: string): Promise<any> {
    const { to, amount, memo, hash_tag } = reqBody
    const airdropResult = await this.repo.findOne({ hash_tag })
    const tokenId = airdropResult.token_id;
    const result = await this.transfer({tokenId, to, amount, memo}, access_token);
    console.log('transfer end result: ', result);
    if (result.code === 0) {
      return this.claimService.createClaim({
        uid: to,
        hash_tag,
        amount,
        token_id: tokenId,
        tx_hash: result.data.tx_hash
      })
    }
  }
  async transfer(reqBody, access_token: string) {
    console.log('transfer start params: ', reqBody, access_token);
    const { tokenId, to, amount, memo } = reqBody
    return this.httpService.post('/minetoken/transfer', {
      tokenId, to, amount, memo
    }, {
      headers: {
        'x-access-token': access_token
      }
    }).toPromise().then(res => res.data)
  }
  async airdrop(reqBody, access_token: string) {
    const { tokenId, amount, title } = reqBody
    const memo = title;
    const to = Number(process.env.TEMP_UID);
    const result = await this.transfer({tokenId, to, amount, memo}, access_token);
    console.log('transfer end result: ', result);
    return result
  }
  async getAirdropAmount(hash_tag): Promise<Number> {
    /* const claimLogRepoResult = await this.claimLogRepo
    .createQueryBuilder('claimLog')
    .select(' SUM(amount) as total ')
    .where('hash_tag = :hash_tag')
    .setParameters({ hash_tag })
    .getMany(); */
    const airdropResult = await this.repo.findOne({ hash_tag })
    if (!airdropResult) return 0
    const claimLogResult = await this.repo.query('SELECT SUM(amount) as total FROM ' + process.env.DB_SCHEMA + '.claim_log WHERE hash_tag = $1;', [hash_tag]);
    const claimTotal = claimLogResult[0].total || 0;
    const { amount, quantity } = airdropResult;
    if (amount <= claimTotal) return 0;
    const equally = Math.floor(amount/quantity);
    const d_amount = new Decimal(amount);
    const rest = parseFloat(d_amount.minus(claimTotal).toString());
    if (rest < equally) return rest;
    return equally;
  }
  async isAirdropExpired(hash_tag): Promise<Boolean> {
    const airdropResult = await this.repo.findOne({ hash_tag });
    if (!airdropResult) return false
    const { created_at, duration } = airdropResult
    const expiredTime = moment(created_at).add(duration, 'd');
    return moment().isAfter(expiredTime)
  }
  async alreadyGetAirdrop(uid, hash_tag) {
    const airdropResult = await this.claimService.findOne({ uid, hash_tag });
    if (airdropResult) {
      return true
    } else {
      return false
    }
  }
  // 获取用户余额
  async balance(tokenId, access_token: string) {
    return this.httpService.get('/minetoken/balance', {
      params: {tokenId},
      headers: {
        'x-access-token': access_token
      }
    }).toPromise().then(res => res.data)
  }
}
