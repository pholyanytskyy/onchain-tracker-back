import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConditionReceiverService } from './condition-receiver.service';
import {
  AddConditionsRequestDto,
  FilteredAccounts,
} from './dto/add-condition-request.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConditionType } from './condition.enum';

@ApiTags('Condition Receiver')
@Controller('condition')
export class ConditionReceiverController {
  constructor(
    private readonly conditionReceiverService: ConditionReceiverService,
  ) {}

  @ApiBody({ type: AddConditionsRequestDto })
  @ApiOkResponse({ type: FilteredAccounts })
  @Post('validate')
  create(@Body() createConditionReceiverDto: any) {
    return this.conditionReceiverService.create(createConditionReceiverDto);
  }

  @Get('types')
  getTypes() {
    return ConditionType;
  }
}
