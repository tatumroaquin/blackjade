import Block from '../blockchain/block.js';
import Transaction from './transaction.js';
import { TransactionMap, HasTransaction } from './transaction-pool.d.js';

export default class TransactionPool {
  transactionMap: TransactionMap;

  constructor() {
    this.transactionMap = {};
  }

  addTransaction(transaction: Transaction) {
    if (Transaction.isValidTransaction(transaction)) {
      this.transactionMap[transaction.id] = transaction;
    }
  }

  getExistingTransaction({
    inputAddress,
  }: HasTransaction): Transaction | undefined {
    const transactions = Object.values(this.transactionMap);
    return transactions.find((tx) => tx.input.wallet === inputAddress);
  }

  getValidTransactions(): Transaction[] {
    return Object.values(this.transactionMap).filter((tx) =>
      Transaction.isValidTransaction(tx)
    );
  }

  clearBlockchainTransactions(chain: Block[]) {
    for (let block of chain) {
      block.data.forEach((tx: Transaction) => {
        if (this.transactionMap[tx.id]) {
          delete this.transactionMap[tx.id];
        }
      });
    }
  }

  setTransactionMap(transactionMap: TransactionMap) {
    this.transactionMap = transactionMap;
  }

  clear() {
    this.transactionMap = {};
  }
}
