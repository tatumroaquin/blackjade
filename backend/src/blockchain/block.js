import { GENESIS_DATA, MINING_RATE } from '../../config.js';
import sha256 from '../utility/sha256.js';
import hexToBin from '../utility/hex-to-bin.js';

export default class Block {
  constructor({ timestamp, prevHash, hash, nonce, difficulty, data }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
  }

  static getGenesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ prevBlock, data }) {
    const prevHash = prevBlock.hash;
    let { difficulty } = prevBlock;
    let timestamp, hash, nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({ prevBlock, timestamp });
      hash = sha256(timestamp, prevHash, difficulty, nonce, data);
    } while (hexToBin(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, prevHash, hash, nonce, difficulty, data });
  }

  static adjustDifficulty({ prevBlock, timestamp }) {
    const { difficulty } = prevBlock;
    if (difficulty < 1)
      return 1;

    const timeDifference = timestamp - prevBlock.timestamp;
    if (timeDifference > MINING_RATE) 
      return difficulty - 1;

    return difficulty + 1;
  }
}
