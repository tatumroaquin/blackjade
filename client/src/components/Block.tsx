import { FC, useState, useEffect } from 'react';
import { useHttp } from '../hooks/use-http';

import { Link, useParams } from 'react-router-dom';
import { Transactions } from './Transactions';
import { Button } from './UI/Button';
import { DUMMY_BLOCKCHAIN } from '../dummy/BLOCKCHAIN';
import { _Block } from '../types';
import styles from './Block.module.scss';

// export const Block: FC<{ block: _Block }> = ({ block }) => {
export const Block: FC = () => {
  const { hashId } = useParams();
  const [block, setBlock] = useState<_Block>();
  const [prevBlockHash, setPrevBlockHash] = useState<string>('');
  const [nextBlockHash, setNextBlockHash] = useState<string>('');

  const [blockIndex, setBlockIndex] = useState<number>(0);

  const { sendRequest, isLoading, error, clearError } = useHttp();

  useEffect(() => {
    const abortController = new AbortController();

    // GET CURRENT BLOCK BY HASH
    (async () => {
      try {
        const data = await sendRequest({
          url: `http://localhost:3000/api/block/hash/${hashId}`,
          abortController,
        });
        setBlockIndex(data.index);
        setBlock(data.block);
      } catch (error) {}
    })();

    // GET PREVIOUS BLOCK BY INDEX
    (async () => {
      try {
        const data = await sendRequest({
          url: `http://localhost:3000/api/block/index/${blockIndex - 1}`,
          abortController,
        });
        setPrevBlockHash(data.hash);
      } catch (error) {}
    })();

    // GET NEXT BLOCK BY INDEX
    (async () => {
      try {
        const data = await sendRequest({
          url: `http://localhost:3000/api/block/index/${blockIndex + 1}`,
          abortController,
        });
        setNextBlockHash(data.hash);
      } catch (error) {}
    })();
  }, [sendRequest]);

  const { timestamp, prevHash, hash, nonce, difficulty, data } = block ?? {};

  return (
    <>
      <div className={styles['block__paging']}>
        {prevBlockHash && (
          <Link to={`/block/${prevBlockHash}`}>
            <Button>&lt;</Button>
          </Link>
        )}
        {nextBlockHash && (
          <Link to={`/block/${nextBlockHash}`}>
            <Button>&gt;</Button>
          </Link>
        )}
      </div>
      {!isLoading && block && (
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
      )}
    </>
  );
};
