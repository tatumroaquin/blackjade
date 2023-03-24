import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Transactions } from './Transactions';
import { Button } from './UI/Button';
import { DUMMY_BLOCKCHAIN } from '../dummy/BLOCKCHAIN';
import { _Block } from '../types';
import styles from './Block.module.scss';

// export const Block: FC<{ block: _Block }> = ({ block }) => {
export const Block: FC = () => {
  const { hashId } = useParams();

  const block: _Block = DUMMY_BLOCKCHAIN.chain.find(
    (block) => block.hash === hashId
  )!;

  const index: number = DUMMY_BLOCKCHAIN.chain.findIndex(
    (block) => block.hash === hashId
  );

  let prevBlockHash: string;
  let nextBlockHash: string;

  if (index > 0) prevBlockHash = DUMMY_BLOCKCHAIN.chain[index - 1].hash;

  if (index < DUMMY_BLOCKCHAIN.chain.length - 1)
    nextBlockHash = DUMMY_BLOCKCHAIN.chain[index + 1].hash;

  const { timestamp, prevHash, hash, nonce, difficulty, data } = block;

  return (
    <>
      <div className={styles['block__paging']}>
        {prevBlockHash! && (
          <Link to={`/block/${prevBlockHash}`}>
            <Button>&lt;</Button>
          </Link>
        )}
        {nextBlockHash! && (
          <Link to={`/block/${nextBlockHash}`}>
            <Button>&gt;</Button>
          </Link>
        )}
      </div>
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
          <Transactions transactions={data} />
        </div>
      </div>
    </>
  );
};
