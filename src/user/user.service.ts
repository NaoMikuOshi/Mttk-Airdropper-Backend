import { Injectable } from '@nestjs/common';
import { AirdropEvent } from 'src/entities/AirdropEvent.entity';
import { ClaimLog } from 'src/entities/ClaimLog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AirdropEvent)
    private readonly aeRepo: Repository<AirdropEvent>,
    @InjectRepository(ClaimLog)
    private readonly claimRepo: Repository<ClaimLog>,
  ) {}

  findAirdropEventOf(uid: number): Promise<AirdropEvent[]> {
    return this.aeRepo.find({
      where: { owner: uid },
      order: { created_at: 'DESC' },
    });
  }

  findClaimLogsOf(uid: number): Promise<ClaimLog[]> {
    return this.claimRepo.find({
      where: { uid },
      order: { created_at: 'DESC' },
    });
  }
}
