import Wallet from '../src/wallet/wallet.js';
import Transaction from '../src/transaction/transaction.js';
import { Input, Output } from '../src/transaction/transaction.d.js';

describe('Transaction', () => {
  let transaction: Transaction;
  let senderWallet: Wallet;
  let recipientWallet: Wallet;
  let recipientAddress: string;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipientWallet = new Wallet();
    recipientAddress = recipientWallet.publicKey;
    transaction = new Transaction({
      senderWallet,
      recipientAddress,
      amount: 1,
    });
  });
  describe('check tx properties', () => {
    it('has a unique id', () => {
      expect(transaction.id).toBeDefined();
    });
    it('has a an tx input object', () => {
      expect(transaction.input).toBeDefined();
    });
    it('has a an tx input object', () => {
      expect(transaction.output).toBeDefined();
    });
  });

  describe('createOutput()', () => {
    it('returns a valid tx output object', () => {
      const amount = 1;
      const mockOutput = {
        [recipientWallet.keypair.getPublicKey()]: amount,
        [senderWallet.keypair.getPublicKey()]: senderWallet.balance - amount,
      };
      expect(
        transaction.createOutput({ senderWallet, recipientAddress, amount })
      ).toEqual(mockOutput);
    });
  });

  describe('createInput()', () => {
    let amount: number;
    let output: Output;
    let input: Input;

    beforeEach(() => {
      amount = 1;
      output = transaction.createOutput({
        senderWallet,
        recipientAddress,
        amount,
      });
      input = transaction.createInput({ senderWallet, output });
    });

    describe('check tx input properties', () => {
      it('has a numerical timestamp', () => {
        expect(input.timestamp).toBeDefined();
        expect(typeof input.timestamp).toBe('number');
      });

      it('has a sender wallet address', () => {
        expect(input.wallet).toBeDefined();
        expect(typeof input.wallet).toBe('string');
      });

      it('has a record of input balance', () => {
        expect(input.amount).toBeDefined();
        expect(typeof input.amount).toBe('number');
      });

      it('has a signature for the output', () => {
        expect(input.signature).toBeDefined();
        expect(typeof input.signature).toBe('string');
      });
    });
  });

  describe('isValidTransaction()', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    describe('transaction has invalid total output amount', () => {
      it('returns false', () => {
        Object.keys(transaction.output).map(
          (wallet) =>
            (transaction.output[wallet] = transaction.output[wallet] + 1)
        );
        expect(Transaction.isValidTransaction(transaction)).toBe(false);
        expect(consoleErrorSpy).toBeCalled();
      });
    });
    describe('transaction has invalid signature', () => {
      it('returns false', () => {
        let evilSignature = transaction.input.signature.replace(/[0-9]/g, '1');
        evilSignature = evilSignature.replace(/[a-f]/g, 'c');
        transaction.input.signature = evilSignature;
        expect(Transaction.isValidTransaction(transaction)).toBe(false);
        expect(consoleErrorSpy).toBeCalled();
      });
    });
    describe('transaction is completely valid', () => {
      it('returns true', () => {
        expect(Transaction.isValidTransaction(transaction)).toBe(true);
      });
    });
  });
});
