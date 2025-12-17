function Button({ variant = "default", className = "", children, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "ghost"
      ? "bg-transparent text-black hover:bg-slate-100"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-black text-white hover:bg-slate-800";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;