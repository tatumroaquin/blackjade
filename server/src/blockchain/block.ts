import { GENESIS_BLOCK, MINING_RATE } from '../config.js';
import sha256 from '../utility/sha256.js';
import hexToBin from '../utility/hex-to-bin.js';

interface BlockParams {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  height: number;
  data: any;
}

export default class Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  height: number;
  data: any;

  constructor({
    timestamp,
    prevHash,
    hash,
    nonce,
    difficulty,
    height,
    data,
  }: BlockParams) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.height = height;
    this.data = data;
  }

  matches(hash: string) {
    return this.hash === hash;
  }

  static getGenesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ prevBlock, data }: { prevBlock: Block; data: any }) {
    const prevHash = prevBlock.hash;
    const height = prevBlock.height + 1;
    let { difficulty } = prevBlock;
    let timestamp,
      hash,
      nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({ prevBlock, timestamp });
      hash = sha256(timestamp, prevHash, difficulty, nonce, data);
    } while (
      hexToBin(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );

    return new this({ timestamp, prevHash, hash, nonce, difficulty, height, data });
  }

  static adjustDifficulty({
    prevBlock,
    timestamp,
  }: {
    prevBlock: Block;
    timestamp: number;
  }) {
    const { difficulty } = prevBlock;
    if (difficulty < 1) return 1;

    const timeDifference = timestamp - prevBlock.timestamp;
    if (timeDifference > MINING_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}
