import { FC } from 'react';
import { Card } from './UI/Card';
import styles from './BlockChain.module.scss';

interface Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  data: any;
}

interface BlockChain {
  chain: Array<Block>;
}

export const BlockChain: FC<BlockChain> = ({ chain }) => {
  return (
    <Card>
      <table className={styles['block-chain']}>
        <thead>
          <tr>
            <th>Height</th>
            <th>Hash</th>
            <th>Timestamp</th>
            <th>Nonce</th>
            <th>Tx Count</th>
          </tr>
        </thead>
        <tbody>
          {[...chain].reverse().map((block, index) => (
            <tr key={block.hash}>
              <td>{chain.length - index - 1}</td>
              <td>{block.hash}</td>
              <td>{new Date(block.timestamp).toUTCString()}</td>
              <td>{block.nonce}</td>
              <td>{block.data.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
