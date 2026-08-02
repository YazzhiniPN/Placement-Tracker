const COLORS = {
  Applied: "#5b7fdb",
  OA: "#a06fd6",
  Interview: "#e0a638",
  Offer: "#3fa66a",
  Rejected: "#d15b5b",
};

export default function StatusBadge({ status }) {
  const color = COLORS[status] || "#888";
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {status}
    </span>
  );
}
