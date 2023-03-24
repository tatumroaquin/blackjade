import { FC } from 'react';
import { Transaction } from './Transaction';
import { _Transaction, _Transactions } from '../types';
import styles from './Transactions.module.scss';

export const Transactions: FC<_Transactions> = ({ transactions }) => {
  return (
    <div className={styles['transactions']}>
      <h4>Transactions</h4>
      {transactions.map((tx: _Transaction, index: number) => (
        <Transaction transaction={tx} key={index} />
      ))}
    </div>
  );
};
