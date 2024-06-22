import { Injectable } from '@nestjs/common';
import { Abi, Address, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

@Injectable()
export class ContractInteractionService {
  public async getContractEvents(
    contractAddress: string,
    eventName: string,
    abi: Abi,
    args: { [key: string]: string },
    fromBlock: number,
    toBlock: number,
  ) {
    const diff = toBlock - fromBlock;
    if (diff > 800) {
      // split the range into 800 blocks slices
      const slices: number[][] = [];
      for (let i = fromBlock; i < toBlock; i += 799) {
        if (i + 799 > toBlock) {
          slices.push([i, toBlock]);
          break;
        }
        slices.push([i, i + 799]);
      }
      const promises = slices.map(([fromBlock, toBlock]) =>
        this.getActivityBySlices(
          contractAddress,
          eventName,
          abi, // :-) I know what I'm doing
          args,
          fromBlock,
          toBlock,
        ),
      );
      const results = await Promise.all(promises);
      return results.flat();
    }

    const client = createPublicClient({ chain: mainnet, transport: http() });
    const txs = await client.getContractEvents({
      address: contractAddress as Address,
      eventName,
      args,
      abi,
      fromBlock: BigInt(fromBlock),
      toBlock: BigInt(toBlock),
    });
    return txs;
  }

  private async getActivityBySlices(
    contractAddress: string,
    eventName: string,
    abi: Abi,
    args: { [key: string]: string },
    fromBlock: number,
    toBlock: number,
  ) {
    const client = createPublicClient({ chain: mainnet, transport: http() });
    const txs = await client.getContractEvents({
      address: contractAddress as Address,
      eventName,
      abi,
      args,
      fromBlock: BigInt(fromBlock),
      toBlock: BigInt(toBlock),
    });
    return txs;
  }
}
