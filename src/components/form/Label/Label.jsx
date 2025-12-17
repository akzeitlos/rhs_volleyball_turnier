function Label({ className = "", children }) {
  return (
    <label className={`text-sm font-medium ${className}`}>{children}</label>
  );
}

export default Label;