import { Module } from '@nestjs/common';
import { ConditionReceiverService } from './condition-receiver.service';
import { ConditionReceiverController } from './condition-receiver.controller';

@Module({
  controllers: [ConditionReceiverController],
  providers: [ConditionReceiverService],
})
export class ConditionReceiverModule {}
