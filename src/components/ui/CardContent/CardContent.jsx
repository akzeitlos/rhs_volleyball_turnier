function CardContent({ className = "", children }) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

export default CardContent;
