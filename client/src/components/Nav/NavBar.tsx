import { Button } from '../UI/Button';
import styles from './NavBar.module.scss';

export const NavBar = () => {
  return (
    <div className={styles['navbar']}>
      <ul className={styles['navbar__links']}>
        <li className={styles['navbar__link']}>Home</li>
        <li className={styles['navbar__link']}>Blockchain</li>
        <li className={styles['navbar__link']}>Transactions</li>
        <li
          className={`${styles['navbar__link']} ${styles['navbar__link--login']}`}
        ></li>
      </ul>
      <Button type='button'>Login</Button>
    </div>
  );
};
