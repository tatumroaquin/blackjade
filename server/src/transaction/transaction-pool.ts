import Block from '../blockchain/block.js';
import Transaction from './transaction.js';
import {
  TransactionMapType,
  HasTransactionParams,
} from './transaction-pool.d.js';

export default class TransactionPool {
  transactionMap: TransactionMapType;

  constructor() {
    this.transactionMap = {};
  }

  addTransaction(transaction: Transaction) {
    const { id } = transaction;
    this.transactionMap[id] = transaction;
  }

  getExistingTransaction({
    inputAddress,
  }: HasTransactionParams): Transaction | undefined {
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

  setTransactionMap(transactionMap: TransactionMapType) {
    this.transactionMap = transactionMap;
  }

  clear() {
    this.transactionMap = {};
  }
}
