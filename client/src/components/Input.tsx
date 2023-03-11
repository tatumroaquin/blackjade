interface Input<T> {
  id: T;
  name: T;
  placeholder: T;
  type: T;
  value?: T;
}

export const Input = ({
  id,
  name,
  placeholder,
  type,
  value,
}: Input<string>) => {
  return (
    <input
      id={`${id}`}
      name={`${name}`}
      placeholder={`${placeholder}`}
      type={`${type}`}
      value={`${value}`}
    />
  );
};
