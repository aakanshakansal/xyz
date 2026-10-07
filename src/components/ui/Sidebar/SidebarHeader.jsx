

export default function SidebarHeader({ tabs, activeTab, onTabChange }) {
  return (
    <header className="viewer-sidebar-surface flex h-[5vh] min-h-10 shrink-0 items-center justify-between border-b border-gray-700 gap-[0.6vw] px-[0.5vw] py-[0.5vh]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-1  items-center justify-center gap-1 p-1 text-sm font-semibold ${
              active ? "bg-[#bada55] text-black" : "text-white hover:bg-[#333] "
            } `}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </header>
  );
}

