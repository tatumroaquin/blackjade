import { FC, useEffect, useState } from 'react';
import { useHttp } from '../hooks/use-http';
import { Link } from 'react-router-dom';
import { Card } from './UI/Card';
import { _Block, _BlockChain } from '../types';
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
  const [blockchain, setBlockchain] = useState<_BlockChain>();
  const { sendRequest, isLoading, error, clearError } = useHttp();

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const data = await sendRequest({
          url: 'http://localhost:3000/api/blockchain',
          abortController,
        });
        setBlockchain(data);
      } catch (error) {}
    })();
  }, [sendRequest]);

  return (
    <div className={styles['container']}>
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
            {blockchain &&
              [...blockchain.chain].reverse().map((block, index) => (
                <tr key={block.hash}>
                  <td>{chain.length - index - 1}</td>
                  <td>
                    <Link to={`/block/${block.hash}`}>{block.hash}</Link>
                  </td>
                  <td>{new Date(block.timestamp).toUTCString()}</td>
                  <td>{block.nonce}</td>
                  <td>{block.data.length}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
