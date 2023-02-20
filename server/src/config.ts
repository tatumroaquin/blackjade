import { PubnubConfig } from 'pubnub';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv'

dotenv.config()

const DIFFICULTY = 3;

const MINING_RATE = 1000;

const GENESIS_DATA = {
  timestamp: 1674971522141,
  prevHash: 'ORIGIN',
  hash: 'GENESIS-HASH',
  data: 'GENESIS-DATA',
  nonce: 0,
  difficulty: DIFFICULTY,
};

const NODE_ID: string = uuid();

const PUBNUB_KEYS: PubnubConfig = {
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY!,
  userId: NODE_ID
};

export { GENESIS_DATA, DIFFICULTY, MINING_RATE, PUBNUB_KEYS, NODE_ID };