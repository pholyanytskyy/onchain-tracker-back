import { Test, TestingModule } from '@nestjs/testing';
import { ConditionReceiverController } from './condition-receiver.controller';
import { ConditionReceiverService } from './condition-receiver.service';

describe('ConditionReceiverController', () => {
  let controller: ConditionReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionReceiverController],
      providers: [ConditionReceiverService],
    }).compile();

    controller = module.get<ConditionReceiverController>(ConditionReceiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
