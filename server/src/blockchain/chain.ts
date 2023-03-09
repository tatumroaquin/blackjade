import { MINING_REWARD, GENESIS_BLOCK } from '../config.js';
import Block from './block.js';
import Transaction from '../transaction/transaction.js';
import Wallet from '../wallet/wallet.js';
import sha256 from '../utility/sha256.js';

export default class Blockchain {
  chain: Block[];

  constructor() {
    this.chain = [Block.getGenesis()];
  }

  addBlock({ data }: { data: any }) {
    const prevBlock = this.chain.slice(-1).pop()!;
    const newBlock = Block.mineBlock({ prevBlock, data });
    this.chain.push(newBlock);
  }

  static isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.getGenesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      let currBlock = chain[i];
      let prevBlock = chain[i - 1];

      let { timestamp, prevHash, hash, nonce, difficulty, data } = currBlock;

      if (prevBlock.hash !== prevHash) return false;

      if (Math.abs(prevBlock.difficulty - currBlock.difficulty) > 1)
        return false;

      let realHash = sha256(timestamp, prevHash, nonce, difficulty, data);

      if (realHash !== hash) return false;
    }

    return true;
  }

  replaceChain(chain: Block[]) {
    if (this.chain.length >= chain.length) {
      console.error('incoming chain must be longer');
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('incoming chain must be valid');
      return;
    }

    this.chain = chain;
  }

  isValidTransactions(chain: Block[]): boolean {
    const genesisBlock = JSON.stringify(Block.getGenesis());
    const firstBlock = JSON.stringify(chain[0]);

    if (firstBlock !== genesisBlock) return false;

    for (let block of chain) {
      let minerRewardCount = 0;
      let transactionSet = new Set();

      for (let transaction of block.data) {
        if (transaction.id === GENESIS_BLOCK.data[0].id) break;

        if (transaction.input?.type === 'MINER-REWARD') {
          minerRewardCount++;

          // only one miner reward tx object must exist
          if (minerRewardCount > 1) {
            console.error('Duplicate reward transactions found!');
            return false;
          }

          // check miner reward value matches MINING_REWARD constant
          if (Object.values(transaction.output)[0] !== MINING_REWARD) {
            console.error('Miner reward value is invalid!');
            return false;
          }
          continue;
        }

        if (!Transaction.isValidTransaction(transaction)) {
          console.error('Invalid transaction found!');
          return false;
        }

        // Patch double-spending problem
        if (transactionSet.has(transaction)) {
          console.error('Duplicate transactions found!');
          return false;
        }

        // we must supply `this.chain` to check the real balance
        // this is also the reason why this method is not static
        const existingBalance = Wallet.calculateBalance({
          chain: this.chain,
          address: transaction.input.wallet,
        });

        if (transaction.input.amount !== existingBalance) {
          console.error('Invalid transaction input amount!');
          return false;
        }

        transactionSet.add(transaction);
      }
    }
    return true;
  }
}
