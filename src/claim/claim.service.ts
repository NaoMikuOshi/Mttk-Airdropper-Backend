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

@Injectable()
export class ClaimService extends TypeOrmCrudService<ClaimLog> {
  constructor(
    @InjectRepository(ClaimLog) repo: Repository<ClaimLog>,
    private readonly httpService: HttpService,
  ) {
    super(repo);
  }
  async createClaim(dto) {
    let item = new ClaimLog();
    item.uid = dto.uid;
    item.hash_tag = dto.hash_tag;
    item.amount = dto.amount;
    item.token_id = dto.token_id;
    item.tx_hash = dto.tx_hash;
    return this.repo.save(item);
  }
}
