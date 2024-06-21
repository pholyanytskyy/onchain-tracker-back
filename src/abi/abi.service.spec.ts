import { Test, TestingModule } from '@nestjs/testing';
import { AbiService } from './abi.service';

describe('AbiService', () => {
  let service: AbiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbiService],
    }).compile();

    service = module.get<AbiService>(AbiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
