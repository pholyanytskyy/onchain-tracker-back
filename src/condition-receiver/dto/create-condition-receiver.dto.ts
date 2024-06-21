import { ApiProperty } from '@nestjs/swagger';
import { Condition } from '../condition.interface';

export class AddConditionsRequestDto {
  @ApiProperty()
  conditions: Condition[];

  @ApiProperty()
  fromDate: string;

  @ApiProperty()
  toDate: string;
}

export class FilteredAccounts {
  @ApiProperty()
  accounts: string[];
}
