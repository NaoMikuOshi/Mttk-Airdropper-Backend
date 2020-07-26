import {
  HttpService,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
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
  private readonly logger = new Logger(ClaimService.name);

  constructor(
    @InjectRepository(ClaimLog) repo: Repository<ClaimLog>,
    @InjectRepository(AirdropEvent)
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
    event.balance = event.balance - dto.amount;
    if (event.balance < 0) {
      this.logger.error('Error when handling claim request');
      this.logger.error('CreateClaimDto: ' + JSON.stringify(dto));
      this.logger.error('AirdropEvent: ' + JSON.stringify(event));
      throw new BadRequestException(
        `System error when create claim for $${dto.cashtag}`,
      );
    }
    await this.aeRepo.save(event);
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
