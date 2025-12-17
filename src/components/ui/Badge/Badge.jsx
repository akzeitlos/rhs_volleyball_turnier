function Badge({ variant = "secondary", children }) {
  const base = "inline-flex items-center rounded-full px-2 py-1 text-xs";
  const styles =
    variant === "outline" ? "border border-black/15" : "bg-black/5";
  return <span className={`${base} ${styles}`}>{children}</span>;
}

export default Badge;