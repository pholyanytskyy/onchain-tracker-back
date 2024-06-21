import { Body, Controller, Post } from '@nestjs/common';
import { ConditionReceiverService } from './condition-receiver.service';
import {
  AddConditionsRequestDto,
  FilteredAccounts,
} from './dto/create-condition-receiver.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Condition Receiver')
@Controller('condition-receiver')
export class ConditionReceiverController {
  constructor(
    private readonly conditionReceiverService: ConditionReceiverService,
  ) {}

  @ApiBody({ type: AddConditionsRequestDto })
  @ApiOkResponse({ type: FilteredAccounts })
  @Post()
  create(@Body() createConditionReceiverDto: AddConditionsRequestDto) {
    return this.conditionReceiverService.create(createConditionReceiverDto);
  }
}
