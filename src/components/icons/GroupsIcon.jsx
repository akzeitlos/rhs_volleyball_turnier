import Icon from "../../components/ui/Icon/Icon";

function GroupsIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path
        d="M7 7h10M7 12h10M7 17h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.5 7h.01M4.5 12h.01M4.5 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export default GroupsIcon;