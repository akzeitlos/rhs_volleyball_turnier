import Icon from "../../components/ui/Icon/Icon";

function TableIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10v10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 10v10" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  );
}

export default TableIcon;
