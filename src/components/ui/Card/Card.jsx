function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border bg-white text-black ${className}`}>
      {children}
    </div>
  );
}

export default Card;
