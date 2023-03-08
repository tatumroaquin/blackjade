import Blockchain from '../blockchain/chain.js';
import TransactionPool from './transaction-pool.js';
import PubSub from '../pubsub.js';

export type TransactionMinerParams = {
  blockchain: Blockchain;
  txpool: TransactionPool;
  pubsub: PubSub;
}
