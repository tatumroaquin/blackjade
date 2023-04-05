import { FC, useEffect, useState } from 'react';
import { useHttp } from '../hooks/use-http';
import { Link } from 'react-router-dom';
import { Card } from './UI/Card';
import { Pagination } from './UI/Pagination';
import { _Block, _BlockChain } from '../types';
import classnames from 'classnames';
import styles from './BlockChain.module.scss';

interface Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  height: number;
  data: any;
}

interface BlockChain {
  chain: Array<Block>;
}

let pageLimit = 5;

export const BlockChain: FC<BlockChain> = ({ chain }) => {
  const [blockchain, setBlockchain] = useState<_BlockChain>({ chain: [] });
  const [chainLength, setChainLength] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { sendRequest, isLoading, error, clearError } = useHttp();

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const result = await sendRequest({
          url: `http://localhost:3000/api/blockchain?limit=${pageLimit}&page=${currentPage}`,
          abortController,
        });
        setBlockchain({ chain: result.data });
        setChainLength(result.total);
      } catch (error) {}
    })();
  }, [currentPage]);

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
              [...blockchain.chain].reverse().map((block) => (
                <tr key={block.hash}>
                  <td>{block.height}</td>
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
        <Pagination
          dataLength={chainLength}
          currentPage={currentPage}
          pageLimit={pageLimit}
          onPageChange={setCurrentPage}
          className={styles['pagination-bar']}
        />
    </div>
  );
};
