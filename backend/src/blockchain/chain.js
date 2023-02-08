import Block from './block.js';
import sha256 from '../utility/sha256.js';

export default class Blockchain {
  constructor() {
    this.chain = [Block.getGenesis()];
  }

  addBlock({ data }) {
    const prevBlock = this.chain.slice(-1).pop();
    const newBlock = Block.mineBlock({ prevBlock, data });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.getGenesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      let currBlock = chain[i];
      let prevBlock = chain[i - 1];

      let { timestamp, prevHash, hash, nonce, difficulty, data } = currBlock;

      if (prevBlock.hash !== prevHash)
        return false;

      let realHash = sha256(timestamp, prevHash, nonce, difficulty, data);

      if (realHash !== hash) 
        return false;
    }

    return true;
  }

  replaceChain({ chain }) {
    if (this.chain.length >= chain.length) {
      console.error('incoming chain must be longer')
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('incoming chain must be valid')
      return;
    }

    this.chain = chain;
  }
}
