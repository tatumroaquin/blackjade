import styles from './Card.module.scss';

interface Card {
  children: React.ReactNode;
}

export const Card: React.FC<Card> = ({ children }) => {
  return <div className={`${styles['card']}`}>{children}</div>;
};
