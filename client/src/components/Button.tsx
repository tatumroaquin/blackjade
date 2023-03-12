import styles from './Button.module.scss';

interface Button {
  type?: 'button' | 'submit' | 'reset';
  disabled: boolean;
  children: string;
}

export const Button = ({ type, disabled, children }: Button) => {
  return (
    <button className={styles['button']} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
