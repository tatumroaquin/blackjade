import { Card } from './UI/Card';
import { Transaction } from './Transaction';
import styles from './Transactions.module.scss';

interface Transaction {
  id: string;
  input: {
    timestamp: number;
    wallet: string;
    amount: number;
    signature: string;
  };
  output: {
    [address: string]: number;
  };
}

// type Transactions = Transaction[]

interface Transactions {
  transactions: Transaction[];
}

export const Transactions: React.FC<Transactions> = ({ transactions }) => {
  return (
    <div className={styles['transactions']}>
      <h4>Transactions</h4>
      {transactions.map((tx, index) => {
        return <Transaction transaction={tx} key={index} />;
      })}
    </div>
  );
};
