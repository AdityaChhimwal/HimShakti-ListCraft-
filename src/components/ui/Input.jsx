/**
 * Input Component
 * Supports:
 * label
 * placeholder
 * type
 * value
 * onChange
 * error
 */

function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>

      <input
        className="border rounded p-2"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />

      {error && (
        <span className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;