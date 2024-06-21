import { Module } from '@nestjs/common';
import { AbiService } from './abi.service';
import { AbiController } from './abi.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AbiController],
  providers: [AbiService],
  exports: [AbiService],
})
export class AbiModule {}
