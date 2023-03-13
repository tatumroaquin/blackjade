import { Input } from './UI/Input';
import { Button } from './UI/Button';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  return (
    <div className={styles['login__container']}>
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
        <Button type='button' disabled={false}>
          Login
        </Button>
      </form>
    </div>
  );
};
