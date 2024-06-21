import { ApiProperty } from '@nestjs/swagger';
import { Condition } from '../condition.interface';

export class AddConditionsRequestDto {
  @ApiProperty()
  conditions: Condition[];
}

export class FilteredAccounts {
  @ApiProperty()
  accounts: string[];
}
