import { Card } from './UI/Card';
import styles from './Block.module.scss';

interface Block<T> {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  data: object;
}

export const Block = ({ block }: { block: Block<string> }) => {
  const { timestamp, prevHash, hash, nonce, difficulty, data } = block;

  return (
    <>
      <div className={styles['block']}>
        <div className={styles['hash']}>
          <label className={styles['hash__label']} htmlFor='hash'>
            Hash
          </label>
          <h1 id='hash'>{hash}</h1>
        </div>

        <table className={styles['block__info']}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Prev Hash</th>
              <th>Nonce</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{new Date(timestamp).toUTCString()}</td>
              <td>{prevHash}</td>
              <td>{nonce}</td>
              <td>{difficulty}</td>
            </tr>
          </tbody>
        </table>

        <div className={styles['block__data']}>
          {JSON.stringify(data, null, 2)}
        </div>
      </div>
    </>
  );
};
