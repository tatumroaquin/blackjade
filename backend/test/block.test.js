import Block from '../src/blockchain/block.js';
import { GENESIS_DATA } from '../config.js';
import sha256 from '../src/utility/sha256.js';

describe('Block', () => {
  // GENESIS BLOCK
  describe('getGenesis()', () => {
    it('returns an instance of `Block`', () => {
      expect(Block.getGenesis() instanceof Block).toBe(true);
    });
    it('returns the real genesis block', () => {
      expect(Block.getGenesis()).toEqual(GENESIS_DATA);
    });
  });

  // BLOCK MINING
  describe('mineBlock()', () => {
    const prevBlock = Block.getGenesis();
    const data = 'MINED BLOCK DATA';
    const minedBlock = Block.mineBlock({ prevBlock, data });

    it('returns an instance of `Block`', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });
    it("sets `prevHash` to the previous block's hash", () => {
      expect(minedBlock.prevHash).toEqual(prevBlock.hash);
    });
    it('has a `hash` prefix matching the `difficulty`', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        '0'.repeat(minedBlock.difficulty)
      );
    });
    it('calculates a `hash` matching its elements', () => {
      const { timestamp, prevHash, nonce, difficulty, data } = minedBlock;
      expect(minedBlock.hash).toEqual(
        sha256(timestamp, prevHash, nonce, difficulty, data)
      );
    });
  });

  // ADJUST MINING DIFFICULTY
  describe('adjustDifficulty()', () => {
    const prevBlock = Block.mineBlock({
      prevBlock: Block.getGenesis(),
      data: 'PREVIOUS BLOCK DATA',
    });
    const currBlock = Block.mineBlock({
      prevBlock,
      data: 'CURRENT BLOCK DATA',
    });
    const difficultyRange = [
      prevBlock.difficulty + 1,
      prevBlock.difficulty - 1,
    ];

    it('difficulty value is adjusted without jumps', () => {
      expect(difficultyRange.includes(currBlock.difficulty)).toBe(true);
    });
  });
});
