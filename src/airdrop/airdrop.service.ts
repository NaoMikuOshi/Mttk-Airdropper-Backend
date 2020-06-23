import { Injectable, NotImplementedException } from '@nestjs/common';
import { of, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { InjectRepository } from '@nestjs/typeorm'
import { AirdropList } from '../entities/AirdropList.entity'
import { Repository } from 'typeorm'
import nanoid from 'nanoid';



@Injectable()
export class AirdropService {
    constructor(
        @InjectRepository(AirdropList) 
        private readonly AirdropRepository: Repository<AirdropList>,
    ){
    }
    async getCat(id: number): Promise<AirdropList[]> {
        return await this.AirdropRepository.find({ id })
    }
    async create(airdrop): Promise<any> {
        let airdropItem = new AirdropList();
        airdropItem.owner = 1111;
        airdropItem.hash_tag = '231231';
        airdropItem.token_id = airdrop.tokenId;
        airdropItem.amount = airdrop.amount;
        airdropItem.quantity = airdrop.quantity;
        airdropItem.duration = airdrop.duration;
        return await this.AirdropRepository.save(airdropItem);
    } 
    // 生成0-9A-Za-z的随机字符串
    genCharacterNumber(length) {
        // return nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length);
    }
}
