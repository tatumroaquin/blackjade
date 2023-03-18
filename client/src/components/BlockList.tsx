import { Card } from './UI/Card';
import styles from './BlockList.module.scss';
interface Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  data: any;
}

interface BlockList {
  chain: Array<Block>;
}

export const BlockList: React.FC<BlockList> = ({ chain }) => {
  return (
    <Card>
      <table className={styles['block-list']}>
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
