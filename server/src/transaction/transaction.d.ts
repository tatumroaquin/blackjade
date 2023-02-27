import Wallet from '../wallet/wallet.js';

export type Input = {
  balance: number;
  timestamp: number;
  wallet: string;
  signature: string;
};

export type InputParams = {
  senderWallet: Wallet;
  output: Output;
};

export type Output = {
  [recipient: string]: number;
};

export type OutputParams = {
  senderWallet: Wallet;
  receiverWallet: Wallet;
  amount: number;
};

export type TransactionParams = {
  senderWallet: Wallet;
  receiverWallet: Wallet;
  amount: number;
  input: Input;
  output: Output;
};
