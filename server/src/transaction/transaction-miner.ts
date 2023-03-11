import Blockchain from '../blockchain/chain.js';
import Transaction from './transaction.js';
import TransactionPool from './transaction-pool.js';
import PubSub from '../network/pubsub.redis.js';
import Wallet from '../wallet/wallet.js';
import { TransactionMinerParams } from './transaction-miner.d.js';

export default class TransactionMiner {
  blockchain: Blockchain;
  txpool: TransactionPool;
  pubsub: PubSub;

  constructor({ blockchain, txpool, pubsub }: TransactionMinerParams) {
    this.blockchain = blockchain;
    this.txpool = txpool;
    this.pubsub = pubsub;
  }

  mineTransactions({ minerWallet }: { minerWallet: Wallet }) {
    // get txpool's valid tx objects
    const validTransactions = this.txpool.getValidTransactions();
    // allocate miner's reward
    const minerReward = Transaction.rewardMiner({ minerWallet });
    validTransactions.push(minerReward);
    // add mined tx to a block and push to the blockchain
    this.blockchain.addBlock({ data: validTransactions });
    // broadcast blockchain to the network
    this.pubsub.broadcastChain();
    // clear transaction pool
    this.txpool.clear();
  }
}
