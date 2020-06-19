import { Test, TestingModule } from '@nestjs/testing';
import { VirtualAccountService } from './virtual-account.service';

describe('VirtualAccountService', () => {
  let service: VirtualAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualAccountService],
    }).compile();

    service = module.get<VirtualAccountService>(VirtualAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
