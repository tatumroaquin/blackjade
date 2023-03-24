import Blockchain from '../src/blockchain/chain.js';
import Wallet from '../src/wallet/wallet.js';
import TransactionPool from '../src/transaction/transaction-pool.js';
import TransactionMiner from '../src/transaction/transaction-miner.js';
import PubSub from '../src/network/pubsub.redis.js';

jest.mock('../src/network/pubsub.redis.js');

describe('TransactionMiner', () => {
  let blockchain: Blockchain;
  let txpool: TransactionPool;
  let pubsub: PubSub;
  let txminer: TransactionMiner;
  let minerWallet: Wallet;

  beforeAll(() => {
    blockchain = new Blockchain();
    txpool = new TransactionPool();
    pubsub = new PubSub({ blockchain, txpool });
    minerWallet = new Wallet();

    txminer = new TransactionMiner({
      blockchain,
      txpool,
      pubsub,
    });
  });

  describe('check txminer properties', () => {
    it('has a `blockchain` instance', () => {
      expect(txminer.blockchain).toBeInstanceOf(Blockchain);
    });
    it('has a `txpool` instance', () => {
      expect(txminer.txpool).toBeInstanceOf(TransactionPool);
    });
    it('has a `pubsub` instance', () => {
      expect(txminer.pubsub).toBeInstanceOf(PubSub);
    });
  })

  describe('mineTransactions()', () => {
    it('adds valid transactions to the blockchain', () => {
      txminer.mineTransactions({ minerWallet });
      expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
      expect(blockchain.isValidTransactions(blockchain.chain)).toBe(true);
    });

    it('generates a miner reward for block mined', () => {
      let rewardCount = 0;

      blockchain.chain.map((block) => {
        for (let transaction of block.data) {
          if (transaction.input?.type === 'MINER-REWARD')
            rewardCount++;
        }
      })

      // skip genesis block as it doesn't have miner's reward
      expect(rewardCount).toEqual(blockchain.chain.length - 1);
    });

    it('broadcasts the blockchain to the network', () => {
      expect(pubsub.broadcastChain).toBeCalled();
    });

    it('clears all transaction objects in the txpool', () => {
      expect(txpool.transactionMap).toEqual({});
    });
  });
});
