import React from 'react';

export type TabType = 'create' | 'script' | 'performer' | 'cue-cards';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'create' as TabType, label: 'Create', icon: 'auto_awesome' },
    { id: 'script' as TabType, label: 'Script', icon: 'description' },
    { id: 'performer' as TabType, label: 'Performer', icon: 'theater_comedy' },
    { id: 'cue-cards' as TabType, label: 'Cue Cards', icon: 'style' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-[#0d0d16]/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.6)] border-t border-[#1f1f28]">
      <div className="grid grid-cols-4 items-center h-16 sm:h-20 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#f5a623] font-bold scale-105'
                  : 'text-[#d7c3ae] hover:text-[#e4e1ee] active:scale-95'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] sm:text-[24px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              <span className="font-['Space_Mono'] text-[10px] sm:text-[11px] tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
