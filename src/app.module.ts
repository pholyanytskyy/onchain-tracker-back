import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConditionReceiverModule } from './condition-receiver/condition-receiver.module';
import { AbiModule } from './abi/abi.module';

@Module({
  imports: [AbiModule, ConditionReceiverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
