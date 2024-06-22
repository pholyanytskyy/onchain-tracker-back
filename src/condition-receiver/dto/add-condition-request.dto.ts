import { ApiProperty } from '@nestjs/swagger';
import {
  SCCondition,
  TokenHoldingCondition,
  TxCountCondition,
} from '../condition.interface';

export class AddConditionsRequestDto {
  conditions: (SCCondition & TokenHoldingCondition & TxCountCondition)[];

  @ApiProperty()
  fromDate: string;

  @ApiProperty()
  toDate: string;
}

export class FilteredAccounts {
  @ApiProperty()
  accounts: string[];
}
