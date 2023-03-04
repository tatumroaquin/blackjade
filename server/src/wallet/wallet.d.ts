import Block from '../blockchain/block.js';

export type createTransactionParams = {
  recipientAddress: string;
  amount: number;
  chain?: Block[];
}

export type calculateBalanceParams = {
  chain: Block[];
  address: string;
}
