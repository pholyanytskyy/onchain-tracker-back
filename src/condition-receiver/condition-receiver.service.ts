import { Injectable } from '@nestjs/common';
import {
  AddConditionsRequestDto,
  FilteredAccounts,
} from './dto/create-condition-receiver.dto';
import { ConditionType } from './condition.enum';

@Injectable()
export class ConditionReceiverService {
  async create(
    createConditionReceiverDto: AddConditionsRequestDto,
  ): Promise<FilteredAccounts> {
    const { conditions } = createConditionReceiverDto;

    for (const condition in conditions) {
      if (condition[condition] === null || condition[condition] === undefined) {
        throw new Error(`Condition key ${condition} is missing`);
      }

      switch (condition) {
        case ConditionType.TX_COUNT:
          //anything
          break;
        case ConditionType.CONTRACT_INTERACTION:
          //anything
          break;
        case ConditionType.TOKEN_HOLDING:
          //anything
          break;
      }
    }

    // return random 100 eth addresses
    return {
      accounts: Array.from({ length: 100 }, () =>
        this.generateRandomEthAddress(),
      ),
    };
  }

  private generateRandomEthAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }
}
