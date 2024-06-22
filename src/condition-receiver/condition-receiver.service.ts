import { Address, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

import { Injectable } from '@nestjs/common';
import {
  AddConditionsRequestDto,
  FilteredAccounts,
} from './dto/add-condition-request.dto';
import { ConditionType } from './condition.enum';
import { ContractInteractionService } from './filtering/contract-interaction.service';
import {
  SCCondition,
  TokenHoldingCondition,
  TxCountCondition,
} from './condition.interface';
import { TokenHoldingService } from './filtering/token-holding.service';
import { ContractTypes } from './erc.enum';

@Injectable()
export class ConditionReceiverService {
  constructor(
    private readonly contractInteractionService: ContractInteractionService,
    private readonly tokenHoldingService: TokenHoldingService,
  ) {}
  async create(
    createConditionReceiverDto: AddConditionsRequestDto,
  ): Promise<FilteredAccounts> {
    const { conditions, fromDate, toDate } = createConditionReceiverDto;
    const { fromBlock, toBlock } = await this.convertDateToBlockRange(
      new Date(fromDate),
      new Date(toDate),
    );
    const scInteractionConditions: SCCondition[] = conditions.filter(
      (condition) => condition.name === ConditionType.CONTRACT_INTERACTION,
    );

    const nonceCondition: TxCountCondition[] = conditions.filter(
      (condition) => condition.name === ConditionType.TX_COUNT,
    );

    if (nonceCondition.length > 1) {
      throw new Error('Only one nonce condition is allowed');
    }

    const holdingCondition: TokenHoldingCondition[] = conditions.filter(
      (condition) => condition.name === ConditionType.TOKEN_HOLDING,
    );

    const scInteractionAccounts = new Set();
    for (const condition of scInteractionConditions) {
      if (!condition || !condition?.name) {
        throw new Error(`Condition key ${condition} is missing`);
      }

      const addresses = await this.handleContractInteraction(
        condition as SCCondition,
        fromBlock,
        toBlock,
        nonceCondition[0]?.nonce ?? null,
      );

      scInteractionAccounts.add(addresses);
    }

    if (holdingCondition.length === 0) {
      return {
        accounts: Array.from(scInteractionAccounts) as string[],
      };
    }

    // if (scInteractionAccounts.size === 0) {
    //   return {
    //     accounts: [],
    //   };
    // }

    const holdingConditionAccounts = new Set();
    for (const condition of holdingCondition) {
      switch (condition.ercType) {
        case ContractTypes.ERC1155:
          const erc1155Accounts =
            await this.tokenHoldingService.checkErc1155HoldingCondition(
              condition.address,
              Array.from(scInteractionAccounts) as string[],
              condition.value,
              fromBlock,
              toBlock,
            );
          holdingConditionAccounts.add(erc1155Accounts);
          break;
        case ContractTypes.ERC20:
          const erc20Accounts =
            await this.tokenHoldingService.checkErc20HoldingCondition(
              condition.address,
              Array.from(scInteractionAccounts) as string[],
              condition.value,
              fromBlock,
              toBlock,
            );
          holdingConditionAccounts.add(erc20Accounts);
          break;
        case ContractTypes.ERC721:
          const erc721Accounts =
            await this.tokenHoldingService.checkErc721HoldingCondition(
              condition.address,
              Array.from(scInteractionAccounts) as string[],
              condition.value,
              fromBlock,
              toBlock,
            );
          holdingConditionAccounts.add(erc721Accounts);
          break;
        default:
          throw new Error('Invalid erc type');
      }
    }

    return {
      accounts: Array.from(holdingConditionAccounts) as string[],
    };
  }
  // convert fromDate and toDate to range of ethereum blocks
  public async convertDateToBlockRange(fromDate: Date, toDate: Date) {
    // convert date to block
    const client = createPublicClient({ chain: mainnet, transport: http() });
    const now = new Date();
    const currentBlock = await client.getBlockNumber();
    const fromBlock = Math.floor(
      (fromDate.getTime() - now.getTime()) / 1000 / 12.07 + // ETH case
        parseInt(currentBlock.toString()),
    );

    const toBlock = Math.floor(
      (toDate.getTime() - now.getTime()) / 1000 / 12.07 + // ETH case
        parseInt(currentBlock.toString()),
    );

    return { fromBlock, toBlock };
  }
  private async handleContractInteraction(
    condition: SCCondition,
    fromBlock: number,
    toBlock: number,
    nonce: number,
  ) {
    //convert condition args to object with key: value
    const args = condition.args.reduce((acc, arg) => {
      acc[arg.key] = arg.value;
      return acc;
    }, {});

    const eventsPerPeriod =
      await this.contractInteractionService.getContractEvents(
        condition.address,
        condition.eventName,
        condition.abi as any,
        args,
        fromBlock,
        toBlock,
      );

    const accounts: Address[] = [];
    for (const event of eventsPerPeriod) {
      const tx = await this.getTxByHash(event.transactionHash);
      nonce
        ? tx.nonce >= nonce && accounts.push(tx.from)
        : accounts.push(tx.from);
    }

    return accounts;
  }
  private async getTxByHash(hash: string) {
    const client = createPublicClient({ chain: mainnet, transport: http() });

    return client.getTransaction({ hash: hash as Address });
  }

  // return random 100 eth addresses
  // return {
  //   accounts: Array.from({ length: 100 }, () =>
  //     this.generateRandomEthAddress(),
  //   ),
  // };

  private generateRandomEthAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }
}
