import { Test, TestingModule } from '@nestjs/testing';
import { ConditionReceiverService } from './condition-receiver.service';

describe('ConditionReceiverService', () => {
  let service: ConditionReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionReceiverService],
    }).compile();

    service = module.get<ConditionReceiverService>(ConditionReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
