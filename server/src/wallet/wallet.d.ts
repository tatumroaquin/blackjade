import Block from '../blockchain/block.js';

export type CreateTransaction = {
  recipientAddress: string;
  amount: number;
  chain?: Block[];
}

export type CalculateBalance = {
  chain: Block[];
  address: string;
}
