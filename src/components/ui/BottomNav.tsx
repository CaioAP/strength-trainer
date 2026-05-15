import React from "react";

interface NavTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function BottomNav({ tabs, activeTab, onTabChange }: BottomNavProps): React.JSX.Element {
  return (
    <nav
      role="tablist"
      className="fixed bottom-0 left-0 right-0 p-2 bg-brand-secondary/80 backdrop-blur-md flex justify-around items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={tab.label}
          onClick={(): void => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? "text-brand-primary" : "text-text-subtle"
          }`}
        >
          <div
            className={`p-2 rounded-xl transition-all ${
              activeTab === tab.id ? "bg-brand-primary/10" : "bg-transparent"
            }`}
          >
            {tab.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
