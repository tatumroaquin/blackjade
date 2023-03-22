import { FC } from 'react';
import { Card } from './UI/Card';
import { _Transaction } from '../types';
import styles from './Transaction.module.scss';

// function hexToUint8Array(hexString: string) {
//   let result = [];
//   for (let i = 0; i < hexString.length; i += 2) {
//     result.push(parseInt(hexString.substring(i, i + 2), 16));
//   }
//   return Uint8Array.from(result)
// }

export const Transaction: FC<{ transaction: _Transaction }> = ({
  transaction,
}) => {
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
            <p key={key}>{`wallet: ${key} ${output[key]} BJC`}</p>
          ))}
        </Card>
      </Card>
    </div>
  );
};
