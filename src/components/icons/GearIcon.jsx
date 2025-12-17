import Icon from "../../components/ui/Icon/Icon";

function GearIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 13.1a7.8 7.8 0 0 0 .05-1.1 7.8 7.8 0 0 0-.05-1.1l2.03-1.58-1.93-3.34-2.5 1a7.66 7.66 0 0 0-1.9-1.1l-.38-2.67H9.28l-.38 2.67c-.68.26-1.33.62-1.9 1.1l-2.5-1-1.93 3.34L4.6 10.9a7.8 7.8 0 0 0-.05 1.1c0 .37.02.74.05 1.1l-2.03 1.58 1.93 3.34 2.5-1c.57.48 1.22.84 1.9 1.1l.38 2.67h5.44l.38-2.67c.68-.26 1.33-.62 1.9-1.1l2.5 1 1.93-3.34-2.03-1.58Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export default GearIcon;