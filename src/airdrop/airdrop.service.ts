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
    const { title, tokenId, amount, quantity, duration } = dto;
    let airdropItem = new AirdropList();
    const hash_tag = await this.genCharacterNumber(12);
    airdropItem.owner = 1111;
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
    const { tokenId, to, amount, memo, hash_tag } = reqBody
    const result = await this.transfer({tokenId, to, amount, memo}, access_token);
    console.log(result);
    if (result.code === 0) {
      return this.claimService.createClaim({
        uid: 1,
        hash_tag,
        amount,
        token_id: tokenId,
        tx_hash: result.data.tx_hash
      })
    }
  }
  async transfer(reqBody, access_token: string) {
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
    console.log('airdrop start: ', {tokenId, to, amount, memo}, access_token);
    
    const result = await this.transfer({tokenId, to, amount, memo}, access_token);
    console.log(result)
    return result
  }
}
