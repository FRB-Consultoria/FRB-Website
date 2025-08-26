import { Label } from "./styled";

// eslint-disable-next-line react/prop-types
export const Input = ({
  type,
  name,
  label,
  placeholder,
  className,
  register,
  error,
  value,
  required,
}) => {
  return (
    <Label>
      {" "}
      <span>{label}</span>
      <input
        required={required}
        {...register}
        name={name}
        type={type}
        placeholder={placeholder}
        className={className}
        value={value}
      />
      {error}
    </Label>
  );
};
