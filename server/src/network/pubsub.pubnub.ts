import PubNub from 'pubnub';
import Blockchain from '../blockchain/chain.js';
import Transaction from '../transaction/transaction.js';
import TransactionPool from '../transaction/transaction-pool.js';
import { PUBNUB_KEYS, NODE_ID } from '../config.js';

type Message = {
  channel: string;
  message: string;
  publisher?: string;
};

const CHANNELS: { [CHANNEL: string]: string } = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
};

export default class PubSub {
  blockchain: Blockchain;
  txpool: TransactionPool;
  pubnub: PubNub;

  constructor({
    blockchain,
    txpool,
  }: {
    blockchain: Blockchain;
    txpool: TransactionPool;
  }) {
    this.blockchain = blockchain;
    this.txpool = txpool;
    this.pubnub = new PubNub(PUBNUB_KEYS);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
  }

  listener() {
    return {
      message: (messageObject: Message): void => {
        const { channel, message, publisher } = messageObject;
        console.log(`CHANNEL: ${channel}\nNODE: ${publisher}\nMESSAGE: ${message}
        `);
        this.handleMessage({ channel, message, publisher });
      },
    };
  }

  handleMessage({ channel, message, publisher }: Message) {
    // message came from myself? ignore it
    if (publisher === NODE_ID) return;

    const parsedData = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain({
          chain: parsedData,
          onSuccess: () => {
            this.txpool.clearBlockchainTransactions(parsedData);
          },
        });
        break;
      case CHANNELS.TRANSACTION:
        this.txpool.addTransaction(parsedData);
        break;
    }
  }

  publish({ channel, message }: Message) {
    (async () => {
      await this.pubnub.publish({ channel, message });
    })();
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain),
    });
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}
