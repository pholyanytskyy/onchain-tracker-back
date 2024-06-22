export interface TxCountCondition {
  name: string;
  nonce: number;
}

export interface SCCondition {
  name: string;
  address: string;
  abi: string;
  eventName: string;
  args: { key: string; value: string }[];
}

export interface TokenHoldingCondition {
  name: string;
  ercType: 'erc20' | 'erc721' | 'erc1155';
  address: string;
  value: number;
}
