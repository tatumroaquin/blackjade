import redis from 'redis';
import Blockchain from '../blockchain/chain.js';
import Transaction from '../transaction/transaction.js';
import TransactionPool from '../transaction/transaction-pool.js';
import { Publish, HandleInput, PubSubParams } from './pubsub.redis.d.js';
import { REDIS_URL, NODE_ID } from '../config.js';

const CHANNELS: { [CHANNEL: string]: string } = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
};

export default class PubSub {
  blockchain: Blockchain;
  txpool: TransactionPool;
  redisPublisher: redis.RedisClientType;
  redisSubscriber: redis.RedisClientType;

  constructor({ blockchain, txpool }: PubSubParams) {
    this.blockchain = blockchain;
    this.txpool = txpool;

    this.redisPublisher = redis.createClient({
      url: REDIS_URL,
    });

    this.redisSubscriber = this.redisPublisher.duplicate();

    (async () => {
      await this.redisConnect();
    })();

    this.subscribeToAllChannels();
  }

  async redisConnect() {
    await this.redisPublisher.connect();
    await this.redisSubscriber.connect();
  }

  handleInput({ channel, input }: HandleInput<string>) {
    let { publisher, message } = JSON.parse(input);

    // message came from myself? ignore it
    if (publisher === NODE_ID) return;

    message = JSON.parse(message);
    console.log(`CHANNEL: ${channel}`);
    console.log(`NODE: ${publisher}`);
    console.log(`MESSAGE:`, message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain({
          blockchain: message,
          onSuccess: () => {
            this.txpool.clearBlockchainTransactions(message);
          },
        });
        break;
      case CHANNELS.TRANSACTION:
        this.txpool.addTransaction(message);
        break;
    }
  }

  listener(input: string, channel: string) {
    this.handleInput({ channel, input });
  }

  subscribeToAllChannels() {
    Object.values(CHANNELS).forEach(async (channel) => {
      await this.redisSubscriber.subscribe(channel, this.listener.bind(this));
    });
  }

  publish({ channel, message, publisher }: Publish<string>) {
    (async () => {
      message = JSON.stringify({ publisher, message });
      await this.redisPublisher.publish(channel, message);
    })();
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain),
      publisher: NODE_ID,
    });
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
      publisher: NODE_ID,
    });
  }
}
