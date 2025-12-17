
function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition ${
        checked ? "bg-black" : "bg-white"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default Switch;