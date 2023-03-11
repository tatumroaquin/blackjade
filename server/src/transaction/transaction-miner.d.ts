import Blockchain from '../blockchain/chain.js';
import TransactionPool from './transaction-pool.js';
import PubSub from '../network/pubsub.redis.js';

export type TransactionMinerParams = {
  blockchain: Blockchain;
  txpool: TransactionPool;
  pubsub: PubSub;
};
