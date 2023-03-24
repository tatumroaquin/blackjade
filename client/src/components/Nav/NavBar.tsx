import { NavLink } from 'react-router-dom';
import { Button } from '../UI/Button';
import styles from './NavBar.module.scss';

export const NavBar = () => {
  function handleNavLink({ isActive }: { isActive: boolean }) {
    return isActive ? styles['navbar__link--active'] : styles['navbar__link'];
  }

  return (
    <nav className={styles['navbar']}>
      <ul className={styles['navbar__links']}>
        <li>
          <NavLink className={handleNavLink} to='/'>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink className={handleNavLink} to='/blockchain'>
            Blockchain
          </NavLink>
        </li>

        <li>
          <NavLink className={handleNavLink} to='/tx-pool'>
            Transactions
          </NavLink>
        </li>
      </ul>
      <Button type='button'>
        <NavLink to='/login'>Login</NavLink>
      </Button>
    </nav>
  );
};
