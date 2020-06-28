import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ClaimLog } from '../entities/ClaimLog.entity';
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
  CrudAuth,
} from '@nestjsx/crud';
import { Repository } from 'typeorm';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';

@Injectable()
export class ClaimService extends TypeOrmCrudService<ClaimLog> {
  constructor(
    @InjectRepository(ClaimLog) repo: Repository<ClaimLog>,
    private readonly httpService: HttpService,
  ) {
    super(repo);
  }

  async createClaim(dto: any, event: AirdropEvent) {
    let item = new ClaimLog();
    item.uid = dto.uid;
    item.cashtag = dto.cashtag;
    item.amount = dto.amount;
    item.token_id = dto.token_id;
    item.tx_hash = dto.tx_hash;
    item.event = event;
    return this.repo.save(item);
  }
}
