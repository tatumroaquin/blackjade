import Block from '../src/blockchain/block.js';
import Blockchain from '../src/blockchain/chain.js';

describe('Blockchain', () => {
  let blockchain = new Blockchain();
  let newChain = new Blockchain();

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
  });

  it('has a property of `chain` and an instance of array', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.getGenesis());
  });

  it('adds a block to the chain', () => {
    const data = 'NEW-BLOCK-DATA';
    blockchain.addBlock({ data });

    expect(blockchain.chain.slice(-1).pop()?.data).toEqual(data);
  });

  describe('isValidchain()', () => {
    beforeEach(() => {
      blockchain.addBlock({ data: 'block 1' });
      blockchain.addBlock({ data: 'block 2' });
      blockchain.addBlock({ data: 'block 3' });
    });

    describe('block 0 is NOT the genesis block', () => {
      it('returns false', () => {
        let genesis = blockchain.chain[0];
        blockchain.chain[0] = { ...genesis, data: 'fake genesis' };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("a block's `prevHash` is corrupted", () => {
      it('returns false', () => {
        blockchain.chain[2].prevHash = 'EVIL HASH';

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("a block's `hash` is corrupted", () => {
      it('returns false', () => {
        blockchain.chain[1].hash = 'EVIL HASH';
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("a block's data is corrupted", () => {
      it('returns false', () => {
        blockchain.chain[3].data = 'EVIL DATA';
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('the chain has a jumped difficulty', () => {
      it('returns false', () => {
        blockchain.chain[2].difficulty++;
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('the chain is completely valid', () => {
      it('returns true', () => {
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
      });
    });
  });

  describe('replaceChain()', () => {
    describe('the new chain is shorter to the current chain', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'block1' });
        blockchain.addBlock({ data: 'block2' });
      });

      describe('and the chain is valid', () => {
        it('retains the current `chain` instance', () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).not.toEqual(newChain.chain);
        });
      });
    });

    describe('the new chain is longer than the current chain', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'block1' });
        newChain.addBlock({ data: 'block2' });
      });

      describe('and the chain is valid', () => {
        it('replaces the `chain` instance with the new chain', () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });

      describe('and the chain is invalid', () => {
        it('retains the current `chain` instance', () => {
          newChain.chain[1].data = 'EVIL DATA';
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).not.toEqual(newChain.chain);
        });
      });
    });
  });
});
