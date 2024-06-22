import { Injectable } from '@nestjs/common';
import {
  Address,
  createPublicClient,
  erc20Abi,
  erc721Abi,
  getContract,
  http,
  parseGwei,
} from 'viem';
import { mainnet } from 'viem/chains';
import { erc1155abi } from './erc-1155.abi';

@Injectable()
export class TokenHoldingService {
  async checkNativeHoldingCondition(
    accountAddresses: string[],
    fromBlock: number,
    toBlock: number,
    balance: number,
  ): Promise<string[]> {
    const periods = this.splitPeriodByDays(fromBlock, toBlock);
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const balanceGwei = parseGwei(balance.toString());
    const acceptedAccountAddresses: Address[] = [];

    for (const account of accountAddresses) {
      let userBalanceGreaterThan = true;
      for (const period of periods) {
        const accountBalance = Number(
          await client.getBalance({
            address: account as any,
            blockNumber: BigInt(period),
          }),
        );
        if (Number(accountBalance) < Number(balanceGwei)) {
          userBalanceGreaterThan = false;
          break;
        }
      }
      if (!userBalanceGreaterThan) {
        continue;
      }
      acceptedAccountAddresses.push(account as any);
    }
    return acceptedAccountAddresses;
  }
  async checkErc20HoldingCondition(
    contractAddress: string,
    accountAddresses: string[],
    balance: number,
    fromBlock: number,
    toBlock: number,
  ): Promise<string[]> {
    const periods = this.splitPeriodByDays(fromBlock, toBlock);
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    const contract = getContract({
      abi: erc20Abi,
      address: contractAddress as any,
      client: { public: client },
    });
    const decimals = parseFloat(`1e${Number(await contract.read.decimals())}`);

    const acceptedAccountAddresses: Address[] = [];

    for (const account of accountAddresses) {
      let userBalanceGreaterThan = true;
      for (const period of periods) {
        const accountBalance =
          Number(
            await contract.read.balanceOf([account as any], {
              blockNumber: BigInt(period),
            }),
          ) / decimals;
        if (accountBalance < balance) {
          userBalanceGreaterThan = false;
          break;
        }
      }
      if (!userBalanceGreaterThan) {
        continue;
      }
      acceptedAccountAddresses.push(account as any);
    }
    return acceptedAccountAddresses;
  }

  async checkErc721HoldingCondition(
    contractAddress: string,
    accountAddresses: string[],
    balance: number,
    fromBlock: number,
    toBlock: number,
  ): Promise<string[]> {
    const periods = this.splitPeriodByDays(fromBlock, toBlock);
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    const contract = getContract({
      abi: erc721Abi,
      address: contractAddress as any,
      client: { public: client },
    });

    const acceptedAccountAddresses: Address[] = [];

    for (const account of accountAddresses) {
      let userBalanceGreaterThan = true;
      for (const period of periods) {
        const accountBalance = Number(
          await contract.read.balanceOf([account as any], {
            blockNumber: BigInt(period),
          }),
        );
        if (accountBalance < balance) {
          userBalanceGreaterThan = false;
          break;
        }
      }
      if (!userBalanceGreaterThan) {
        continue;
      }
      acceptedAccountAddresses.push(account as any);
    }
    return acceptedAccountAddresses;
  }

  async checkErc1155HoldingCondition(
    contractAddress: string,
    accountAddresses: string[],
    balance: number,
    fromBlock: number,
    toBlock: number,
  ): Promise<string[]> {
    const periods = this.splitPeriodByDays(fromBlock, toBlock);
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    const contract = getContract({
      abi: erc1155abi,
      address: contractAddress as any,
      client: { public: client },
    });

    const balanceGwei = parseGwei(balance.toString());

    const acceptedAccountAddresses: Address[] = [];

    for (const account of accountAddresses) {
      let userBalanceGreaterThan = true;
      for (const period of periods) {
        const accountBalance = Number(
          await contract.read.balanceOf([account as any, BigInt(1)], {
            blockNumber: BigInt(period),
          }),
        );
        if (Number(accountBalance) < Number(balanceGwei)) {
          userBalanceGreaterThan = false;
          break;
        }
      }
      if (!userBalanceGreaterThan) {
        continue;
      }
      acceptedAccountAddresses.push(account as any);
    }
    return acceptedAccountAddresses;
  }

  private splitPeriodByDays(fromBlock: number, toBlock: number) {
    const ethBlocksPerDay = 7148;
    const diff = toBlock - fromBlock;
    if (diff > ethBlocksPerDay) {
      const slices: number[][] = [];
      for (let i = fromBlock; i < toBlock; i += ethBlocksPerDay) {
        if (i + ethBlocksPerDay > toBlock) {
          slices.push([i, toBlock]);
          break;
        }
        slices.push([i, i + ethBlocksPerDay]);
      }
      return slices.flat(1);
    }

    return [fromBlock, toBlock];
  }
}
