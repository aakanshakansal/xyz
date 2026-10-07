import { FaChevronRight } from "react-icons/fa";
export default function OutlinerRow({
  icon: Icon,
  label,
  onClick,
  expandable,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-row  w-full items-center gap-3 rounded-md px-1 py-2 text-left transition"
    >
      <Icon size={18} className="shrink-0 text-white" />
      <span className="text-sm">{label}</span>
      {expandable && <span className="ml-auto text-gray-400"><FaChevronRight size={18} className="text-gray-400" /></span>}
    </button>
  );
}
