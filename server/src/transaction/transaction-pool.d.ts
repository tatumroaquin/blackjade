import Transaction from './transaction.js';

export type TransactionMap = {
  [id: string]: Transaction;
};

export type HasTransaction = {
  inputAddress: string;
};
