import Wallet from '../src/wallet/wallet.js';
import KeyPair from '../src/wallet/keypair.js';
import Transaction from '../src/transaction/transaction.js';
import { INITIAL_BALANCE } from '../src/config.js';

describe('Wallet', () => {
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe('check properties', () => {
    it('has a `keypair` instance', () => {
      expect(wallet.keypair instanceof KeyPair).toBe(true);
    });
    it('has a `publicKey` exported from `keypair`', () => {
      expect(wallet.publicKey).toEqual(wallet.keypair.getPublicKey());
    });
    it('has a `privateKey` exported from `keypair`', () => {
      expect(wallet.privateKey).toEqual(wallet.keypair.getPrivateKey());
    });
    it('has a `balance` equal to `INITIAL_BALANCE`', () => {
      expect(wallet.balance).toEqual(INITIAL_BALANCE);
    });
  });

  describe('createTransaction()', () => {
    let recipientWallet: Wallet;
    let transaction: Transaction | undefined;

    beforeEach(() => {
      recipientWallet = new Wallet();
    });

    describe('and amount is less/equal to balance', () => {
      it('returns a valid transaction object', () => {
        transaction = wallet.createTransaction({
          recipientAddress: recipientWallet.publicKey,
          amount: 2,
        });
        expect(transaction instanceof Transaction).toBe(true);
        expect(Transaction.isValidTransaction(transaction!)).toBe(true);
      });
    });

    describe('and amount is greater than balance', () => {
      it('outputs an error', () => {
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation(jest.fn());
        transaction = wallet.createTransaction({
          recipientAddress: recipientWallet.publicKey,
          amount: 100,
        });
        expect(transaction).toBe(undefined);
        expect(consoleErrorSpy).toBeCalled();
        consoleErrorSpy.mockRestore();
      });
    });
  });
});
