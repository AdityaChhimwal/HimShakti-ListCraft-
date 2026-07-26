/**
 * Button Component
 * @param {string} variant - primary | secondary | outline
 * @param {string} size - sm | md | lg
 * @param {boolean} disabled
 * @param {function} onClick
 */

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
}) {
  const variants = {
    primary: "bg-green-700 text-white",
    secondary: "bg-gray-700 text-white",
    outline: "border border-green-700 text-green-700",
  };

  const sizes = {
    sm: "px-3 py-1",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded`}
    >
      {children}
    </button>
  );
}

export default Button;