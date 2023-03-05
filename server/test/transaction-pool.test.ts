import Transaction from '../src/transaction/transaction.js';
import TransactionPool from '../src/transaction/transaction-pool.js';
import Wallet from '../src/wallet/wallet.js';
import Blockchain from '../src/blockchain/chain.js';

describe('TransactionPool', () => {
  let txpool: TransactionPool;
  let wallet: Wallet;

  beforeEach(() => {
    txpool = new TransactionPool();
    wallet = new Wallet();
  });

  describe('check tx-pool properties', () => {
    it('has a `transactionMap`', () => {
      expect(txpool.transactionMap).toBeDefined();
    });
  });

  describe('addTransaction()', () => {
    it('sets key-value pair of [tx.id]:transaction', () => {
      const tx = wallet.createTransaction({
        recipientAddress: new Wallet().getPublicKey(),
        amount: 2,
      });
      txpool.addTransaction(tx!);
      const loadedTx = txpool.transactionMap[tx!.id];
      expect(loadedTx).toEqual(tx);
    });
  });

  describe('getExistingTransaction', () => {
    let tx: Transaction | undefined;
    let existingTx: Transaction | undefined;
    beforeEach(() => {
      tx = wallet.createTransaction({
        recipientAddress: new Wallet().getPublicKey(),
        amount: 2,
      });

      txpool.addTransaction(tx!);

      existingTx = txpool.getExistingTransaction({
        inputAddress: tx!.input.wallet,
      });
    });

    it('returns a tx object when tx exist', () => {
      expect(existingTx instanceof Transaction).toBe(true);
      expect(existingTx).toEqual(tx);
    });

    it('returns undefined when tx does NOT exist', () => {
      delete txpool.transactionMap[tx!.id];
      expect(
        txpool.getExistingTransaction({ inputAddress: tx!.input.wallet })
      ).not.toBeDefined();
    });
  });

  describe('getValidTransactions()', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let validTransactions: Transaction[];

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());

      validTransactions = [];

      for (let i = 0; i < 10; ++i) {
        const tx = new Transaction({
          senderWallet: wallet,
          recipientAddress: new Wallet().getPublicKey(),
          amount: 2,
        });

        if (i % 3 === 0) {
          tx.input.amount = 99999;
        } else if (i % 3 === 1) {
          tx.input.signature = new Wallet().sign('EVIL DATA');
        } else {
          validTransactions.push(tx);
        }

        txpool.addTransaction(tx);
      }
    });

    afterAll(() => consoleErrorSpy.mockRestore());

    it('returns only valid tx objects', () => {
      expect(txpool.getValidTransactions()).toEqual(validTransactions);
    });

    it('outputs an error for invalid tx objects', () => {
      expect(consoleErrorSpy).toBeCalled();
    });
  });

  describe('clearBlockchainTransactions()', () => {
    let blockchain: Blockchain | undefined;
    let remainingTx: { [id: string]: Transaction | undefined };

    beforeEach(() => {
      blockchain = new Blockchain();
      remainingTx = {};

      for (let i = 0; i < 10; ++i) {
        const tx = new Wallet().createTransaction({
          recipientAddress: new Wallet().getPublicKey(),
          amount: 2,
        });

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [tx] });
        } else {
          remainingTx[tx!.id] = tx;
        }

        txpool.addTransaction(tx!);
      }
    });
    it('clears the `tx-pool` of `transactions` mined in blockchain', () => {
      txpool.clearBlockchainTransactions(blockchain!.chain);
      expect(txpool.transactionMap).toEqual(remainingTx);
    });
  });
});
