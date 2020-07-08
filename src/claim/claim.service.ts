import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
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
import { CreateClaimDto } from './dto/CreateClaim';

@Injectable()
export class ClaimService extends TypeOrmCrudService<ClaimLog> {
  constructor(
    @InjectRepository(ClaimLog) repo: Repository<ClaimLog>,
    @InjectRepository(ClaimLog)
    private readonly aeRepo: Repository<AirdropEvent>,
    private readonly httpService: HttpService,
  ) {
    super(repo);
  }

  async createClaim(dto: CreateClaimDto, event: AirdropEvent) {
    let item = new ClaimLog();
    item.uid = dto.uid;
    item.cashtag = dto.cashtag;
    item.amount = dto.amount;
    item.token_id = dto.token_id;
    item.tx_hash = null;
    item.event = event;
    return this.repo.save(item);
  }

  getClaimLogs(cashtag: string) {
    return this.repo.find({
      where: { cashtag },
      order: { created_at: 'DESC' },
    });
  }

  getClaimsOf(cashtag: string) {
    return this.repo.find({ cashtag });
  }

  getCountOf(cashtag: string) {
    return this.repo.count({ cashtag });
  }

  async getTotalClaimedOf(cashtag: string) {
    const { total } = await this.repo
      .createQueryBuilder('claim_log')
      .select('SUM(amount) as total')
      .where('cashtag = :cashtag', { cashtag })
      .getRawOne();
    return Number(total);
  }
}
