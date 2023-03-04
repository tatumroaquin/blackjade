import Wallet from '../src/wallet/wallet.js';
import KeyPair from '../src/wallet/keypair.js';
import Transaction from '../src/transaction/transaction.js';
import Blockchain from '../src/blockchain/chain.js';
import { INITIAL_BALANCE } from '../src/config.js';

describe('Wallet', () => {
  let wallet: Wallet;
  let blockchain: Blockchain;

  beforeEach(() => {
    wallet = new Wallet();
    blockchain = new Blockchain();
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

    describe('and the `chain` is supplied as a parameter', () => {
      let calculateBalanceSpy: jest.SpyInstance;

      beforeEach(() => {
        calculateBalanceSpy = jest
          .spyOn(Wallet, 'calculateBalance')
          .mockImplementation(jest.fn());
      });

      it('calls calculateBalance() method', () => {
        wallet.createTransaction({
          recipientAddress: wallet.getPublicKey(),
          amount: 1,
          chain: blockchain.chain,
        });
        expect(calculateBalanceSpy).toBeCalled();
        calculateBalanceSpy.mockRestore();
      });
    });
  });

  describe('calculateBalance()', () => {

    describe('`Wallet` does NOT have outputs in the blockchain', () => {
      it('returns the `INITIAL_BALANCE`', () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.getPublicKey(),
        });
        expect(balance).toEqual(INITIAL_BALANCE);
      });
    });

    describe('`Wallet` IS receiving funds from the blockchain', () => {
      let transaction1: Transaction | undefined;
      let transaction2: Transaction | undefined;

      beforeEach(() => {
        transaction1 = new Wallet().createTransaction({
          recipientAddress: wallet.publicKey,
          amount: 2,
        });
        transaction2 = new Wallet().createTransaction({
          recipientAddress: wallet.publicKey,
          amount: 3,
        });
        blockchain.addBlock({ data: [transaction1, transaction2] });
      });

      it('adds the sum from `INITIAL_BALANCE` + t1 + t2 ...', () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey,
        });
        expect(balance).toEqual(
          INITIAL_BALANCE +
            transaction1!.output[wallet.getPublicKey()] +
            transaction2!.output[wallet.getPublicKey()]
        );
      });
    });

    describe('`Wallet` IS sending funds to the blockchain', () => {
      let transaction: Transaction | undefined;

      beforeEach(() => {
        transaction = wallet.createTransaction({
          recipientAddress: new Wallet().getPublicKey(),
          amount: 2,
        });
        transaction!.update({
          senderWallet: wallet,
          recipientAddress: new Wallet().getPublicKey(),
          amount: 3,
        });
        blockchain.addBlock({ data: [transaction] });
      });

      it('returns the output of most recent transaction', () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.getPublicKey(),
        });
        expect(balance).toEqual(transaction!.output[wallet.getPublicKey()]);
      });

      describe('and the transaction is with two other tx objects.', () => {
        let sameBlockTx: Transaction | undefined;
        let nextBlockTx: Transaction | undefined;

        beforeEach(() => {
          transaction = wallet.createTransaction({
            recipientAddress: new Wallet().getPublicKey(),
            amount: 4,
          });

          sameBlockTx = new Wallet().createTransaction({
            recipientAddress: wallet.getPublicKey(),
            amount: 5,
          });

          blockchain.addBlock({ data: [transaction, sameBlockTx] });

          nextBlockTx = new Wallet().createTransaction({
            recipientAddress: wallet.getPublicKey(),
            amount: 6,
          });

          blockchain.addBlock({ data: [nextBlockTx] });
        });

        it('returns the sum of all outputs for the wallet', () => {
          const balance = Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.getPublicKey(),
          });
          expect(balance).toEqual(
            transaction!.output[wallet.getPublicKey()] +
              sameBlockTx!.output[wallet.getPublicKey()] +
              nextBlockTx!.output[wallet.getPublicKey()]
          );
        });
      });
    });
  });
});
