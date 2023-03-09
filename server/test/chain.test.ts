import Block from '../src/blockchain/block.js';
import Blockchain from '../src/blockchain/chain.js';
import Transaction from '../src/transaction/transaction.js';
import Wallet from '../src/wallet/wallet.js';

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

  describe('isValidChain()', () => {
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
    let consoleErrorSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());
    });
    describe('the new chain is shorter to the current chain', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'block1' });
        blockchain.addBlock({ data: 'block2' });
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      describe('and the chain is valid', () => {
        it('retains the current `chain` instance', () => {
          blockchain.replaceChain({ chain: newChain.chain });
          expect(blockchain.chain).not.toEqual(newChain.chain);
          expect(consoleErrorSpy).toBeCalled();
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
          blockchain.replaceChain({
            chain: newChain.chain,
            skipValidation: true,
          });
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });

      describe('and the chain is invalid', () => {
        it('retains the current `chain` instance', () => {
          newChain.chain[1].data = 'EVIL DATA';
          blockchain.replaceChain({ chain: newChain.chain });
          expect(blockchain.chain).not.toEqual(newChain.chain);
          expect(consoleErrorSpy).toBeCalled();
        });
      });
    });
  });

  describe('isValidTransactions()', () => {
    let transaction1: Transaction;
    let minerReward1: Transaction;

    beforeEach(() => {
      transaction1 = new Wallet().createTransaction({
        recipientAddress: new Wallet().getPublicKey(),
        amount: 1,
      })!;
      minerReward1 = Transaction.rewardMiner({
        minerWallet: new Wallet(),
      });
    });

    describe('the first block is NOT the genesis block', () => {
      it('returns false', () => {
        let fakeGenesis = Block.getGenesis();
        fakeGenesis.data = 'EVIL DATA';
        newChain.chain[0] = fakeGenesis;
        expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
      });
    });

    describe('there is a duplicate miner reward tx in one block', () => {
      it('returns false', () => {
        let minerReward2 = Transaction.rewardMiner({
          minerWallet: new Wallet(),
        });
        newChain.addBlock({ data: [transaction1, minerReward1, minerReward2] });
        expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
      });
    });

    describe('miner reward value does NOT match the global constant', () => {
      it('returns false', () => {
        let minerAddress = Object.keys(minerReward1.output)[0];
        minerReward1.output[minerAddress] = 999;
        newChain.addBlock({ data: [transaction1, minerReward1] });
        expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
      });
    });

    describe('the transaction object is NOT valid', () => {
      let senderWallet: Wallet;
      let recipientWallet: Wallet;
      let transaction2: Transaction;

      beforeEach(() => {
        senderWallet = new Wallet();
        recipientWallet = new Wallet();
        transaction2 = senderWallet.createTransaction({
          recipientAddress: recipientWallet.getPublicKey(),
          amount: 1,
        })!;
      });

      describe("sender's return output is higher than the balance", () => {
        it('returns false', () => {
          transaction2.output[senderWallet.getPublicKey()] = 999;
          newChain.addBlock({
            data: [transaction1, transaction2, minerReward1],
          });
          expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
        });
      });

      describe("the recipent's output is higher than sender balance", () => {
        it('returns false', () => {
          transaction2.output[recipientWallet.getPublicKey()] = 999;
          newChain.addBlock({
            data: [transaction1, transaction2, minerReward1],
          });
          expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
        });
      });

      describe('the tx input amount does NOT equal outputs', () => {
        it('returns false', () => {
          transaction2.input.amount = 999;
          newChain.addBlock({
            data: [transaction1, transaction2, minerReward1],
          });
          expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
        });
      });
    });

    describe('there is a duplicate transaction (double-spending)', () => {
      it('returns false', () => {
        newChain.addBlock({ data: [transaction1, transaction1, minerReward1] });
        expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
      });
    });

    describe("wallet's true balance does NOT match the transactions", () => {
      it('returns false', () => {
        const evilWallet = new Wallet();
        evilWallet.balance = 9000;

        const evilTransaction = evilWallet.createTransaction({
          recipientAddress: new Wallet().getPublicKey(),
          amount: 100,
        });
        newChain.addBlock({
          data: [transaction1, evilTransaction, minerReward1],
        });
        expect(blockchain.isValidTransactions(newChain.chain)).toBe(false);
      });
    });

    describe('all transactions are completely valid', () => {
      it('returns true', () => {
        expect(blockchain.isValidTransactions(newChain.chain)).toBe(true);
      });
    });
  });
});
