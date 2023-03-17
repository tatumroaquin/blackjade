import { Card } from './UI/Card';
import styles from './Transaction.module.scss';

interface Transaction {
  transaction: {
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
    children?: React.ReactNode;
  };
}

// function hexToUint8Array(hexString: string) {
//   let result = [];
//   for (let i = 0; i < hexString.length; i += 2) {
//     result.push(parseInt(hexString.substring(i, i + 2), 16));
//   }
//   return Uint8Array.from(result)
// }

export const Transaction: React.FC<Transaction> = ({ transaction }) => {
  const { id, input, output } = transaction;


  return (
    <div className={styles['transaction']}>
      <p>{id}</p>
      <p>{new Date(input.timestamp).toUTCString()}</p>
      <Card>
        <Card>
          <h3>Input</h3>
          <p>
            wallet: {input.wallet} {input.amount} BJC
          </p>
          <p>signature: {input.signature}</p>
        </Card>
        <Card>
          <h3>Output</h3>
          {Object.keys(output).map((key) => (
            <p key={key}>{`wallet: ${key.substring(key.length - 40)} ${
              output[key]
            } BJC`}</p>
          ))}
        </Card>
      </Card>
    </div>
  );
};
