function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl bg-white/90 text-black ${className}`}>
      {children}
    </div>
  );
}

export default Card;
