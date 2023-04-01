export type Input = {
  timestamp: number;
  wallet: string;
  amount: number;
  signature: string;
  type?: 'MINER-REWARD';
}

export type Output = {
  [address: string]: number;
}

export interface _Transaction {
  id: string;
  input: Input;
  output: Output;
  children?: React.ReactNode;
}

export interface _Transactions {
  transactions: _Transaction[];
}

export interface _TransactionPool {
  [id: string]: _Transaction;
}

export interface _Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  height: number;
  data: _Transaction[];
}

export interface _BlockChain {
  chain: _Block[];
}
