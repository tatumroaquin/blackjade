import Transaction from './transaction.js';

export type TransactionMapType = {
  [id: string]: Transaction;
};

export type HasTransactionParams = {
    inputAddress: string;
};
