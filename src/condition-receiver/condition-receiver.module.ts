import { Module } from '@nestjs/common';
import { ConditionReceiverService } from './condition-receiver.service';
import { ConditionReceiverController } from './condition-receiver.controller';
import { ContractInteractionService } from './filtering/contract-interaction.service';
import { TokenHoldingService } from './filtering/token-holding.service';

@Module({
  controllers: [ConditionReceiverController],
  providers: [
    ConditionReceiverService,
    ContractInteractionService,
    TokenHoldingService,
  ],
})
export class ConditionReceiverModule {}
