import { Controller, Get, Query } from '@nestjs/common';
import { AbiService } from './abi.service';
import { GetAbiDto } from './dto/abi';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AbiExample } from './abi.example';

@ApiTags('abi')
@Controller({ path: 'abi', version: '1' })
export class AbiController {
  constructor(private readonly abiService: AbiService) {}

  @ApiOkResponse({ schema: { example: AbiExample } })
  @Get()
  findOne(@Query() { address }: GetAbiDto) {
    return this.abiService.findAbi(address);
  }
}
