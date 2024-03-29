import styles from './Input.module.scss';

interface Input<T> {
  id: T;
  name: T;
  label: T;
  placeholder: T;
  type: T;
  value?: T;
}

export const Input = ({
  id,
  label,
  name,
  placeholder,
  type,
  value,
}: Input<string>) => {
  return (
    <div className={styles['input__container']}>
      <label className={styles['input__label']} htmlFor={`${id}`}>
        {label}
      </label>
      <input
        className={styles['input__field']}
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  );
};
