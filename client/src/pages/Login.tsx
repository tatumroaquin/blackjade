import { FC } from 'react';
import { useEffect } from 'react';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import styles from './Login.module.scss';

interface Login {
  setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: FC<Login> = ({ setShowNavBar }) => {
  useEffect(() => {
    setShowNavBar(false);
  }, []);

  return (
    <div className={styles['login']}>
      <Card>
        <form className={styles['login__form']}>
          <h1 className={styles['login__title']}>Login</h1>
          <Input
            id='username'
            label='Username'
            name='username'
            type='text'
            placeholder='Enter Username'
          />
          <Input
            id='password'
            label='Password'
            name='password'
            type='password'
            placeholder='Enter Password'
          />
          <Button type='button'>Login</Button>
        </form>
      </Card>
    </div>
  );
};
