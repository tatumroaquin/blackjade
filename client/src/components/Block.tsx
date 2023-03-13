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

        <label className={styles['block__label--yellow']} htmlFor='timestamp'>
          Timestamp
        </label>
        <p className={styles['block__text--green']} id='timestamp'>
          {timestamp}
        </p>

        <label className={styles['block__label--yellow']} htmlFor='prev-hash'>
          PrevHash
        </label>
        <p className={styles['block__text--green']} id='prev-hash'>
          {prevHash}
        </p>

        <label className={styles['block__label--yellow']} htmlFor='nonce'>
          Nonce
        </label>
        <p className={styles['block__text--green']} id='nonce'>
          {nonce}
        </p>

        <label className={styles['block__label--yellow']} htmlFor='nonce'>
          Difficulty
        </label>
        <p className={styles['block__text--green']} id='difficulty'>
          {difficulty}
        </p>

        <label className={styles['block__label--yellow']} htmlFor='data'>
          Data
        </label>
        <p className={styles['block__text--green']} id='data'>
          {JSON.stringify(data)}
        </p>
      </div>
    </>
  );
};
