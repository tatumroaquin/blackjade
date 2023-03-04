import Wallet from '../wallet/wallet.js';

export type Input = {
  amount: number;
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
  recipientAddress: string;
  amount: number;
};

export type TransactionParams = {
  senderWallet: Wallet;
  recipientAddress: string;
  amount: number;
  input?: Input;
  output?: Output;
};

export type UpdateParams = {
  senderWallet: Wallet;
  recipientAddress: string;
  amount: number;
}
