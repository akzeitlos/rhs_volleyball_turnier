function CardTitle({ className = "", children }) {
  return <div className={`font-semibold ${className}`}>{children}</div>;
}

export default CardTitle;
