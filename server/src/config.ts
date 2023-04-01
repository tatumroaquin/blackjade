import { PubnubConfig } from 'pubnub';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const DIFFICULTY = 3;

const MINING_RATE = 1000;

const MINING_REWARD = 20;

const INITIAL_BALANCE = 50;

const GENESIS_BLOCK = {
  timestamp: 1674971522141,
  prevHash: 'ORIGIN',
  hash: 'GENESIS-HASH',
  nonce: 0,
  difficulty: 3,
  height: 0,
  data: [
    {
      id: 'GENESIS-TXID',
      input: {
        timestamp: 16749715222145,
        wallet: 'GENESIS-WALLET',
        amount: 25,
        signature: 'GENESIS-SIGNATURE',
      },
      output: {
        'GENESIS-WALLET': 25,
      },
    },
  ],
};

const NODE_ID: string = uuid();

const PUBNUB_KEYS: PubnubConfig = {
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY!,
  userId: NODE_ID,
};

const REDIS_URL = process.env.REDIS_URL;

export {
  GENESIS_BLOCK,
  DIFFICULTY,
  MINING_RATE,
  MINING_REWARD,
  INITIAL_BALANCE,
  PUBNUB_KEYS,
  REDIS_URL,
  NODE_ID,
};
