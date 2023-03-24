import Blockchain from '../blockchain/chain.js';
import Transaction from '../transaction/transaction.js';
import TransactionPool from '../transaction/transaction-pool.js';

export type Publish<T> = {
  channel: T;
  message: T;
  publisher?: T;
};

export type HandleInput<T> = {
  channel: T;
  input: T;
};

export type PubSubParams = {
  blockchain: Blockchain;
  txpool: TransactionPool;
};
