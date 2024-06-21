import { Test, TestingModule } from '@nestjs/testing';
import { AbiController } from './abi.controller';
import { AbiService } from './abi.service';

describe('AbiController', () => {
  let controller: AbiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbiController],
      providers: [AbiService],
    }).compile();

    controller = module.get<AbiController>(AbiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
