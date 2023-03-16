import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import styles from './Login.module.scss';

export const Login = () => {
  return (
    <div className={styles['login']}>
      <Card>
        <form>
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
          <Button type='button' disabled={false}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};
