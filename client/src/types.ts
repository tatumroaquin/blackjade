export interface _Transaction {
  id: string;
  input: {
    timestamp: number;
    wallet: string;
    amount: number;
    signature: string;
  };
  output: {
    [address: string]: number;
  };
  children?: React.ReactNode;
}

export interface _Transactions {
  transactions: _Transaction[];
}

export interface _Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  data: _Transaction[];
}

export interface _BlockChain {
  chain: _Block[];
}
