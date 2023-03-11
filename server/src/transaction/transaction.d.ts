import Wallet from '../wallet/wallet.js';

export type Input = {
  amount: number;
  timestamp: number;
  wallet: string;
  signature: string;
  type?: string;
};

export type CreateInput = {
  senderWallet: Wallet;
  output: Output;
};

export type Output = {
  [recipient: string]: number;
};

export type CreateOutput = {
  senderWallet: Wallet;
  recipientAddress: string;
  amount: number;
};

export type TransactionParams = {
  senderWallet?: Wallet;
  recipientAddress?: string;
  amount?: number;
  input?: Input;
  output?: Output;
};

export type Update = {
  senderWallet: Wallet;
  recipientAddress: string;
  amount: number;
};

export type RewardMiner = {
  minerWallet: Wallet;
};
