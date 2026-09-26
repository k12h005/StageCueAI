import React, { useState } from 'react';
import { TabType } from './BottomNav';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  rehearsalMode: boolean;
  onToggleRehearsalMode: () => void;
  selectedActor: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  rehearsalMode,
  onToggleRehearsalMode,
  selectedActor,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getSubLabel = () => {
    switch (currentTab) {
      case 'create':
        return 'Create';
      case 'script':
        return 'Script';
      case 'performer':
        return 'Performer';
      case 'cue-cards':
        return 'Cue Cards';
      default:
        return 'Script';
    }
  };

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'create', label: 'Create', icon: 'auto_awesome' },
    { id: 'script', label: 'Script', icon: 'description' },
    { id: 'performer', label: 'Performer', icon: 'theater_comedy' },
    { id: 'cue-cards', label: 'Cue Cards', icon: 'style' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#0d0d16]/90 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.5)] border-b border-[#1f1f28]/80 transition-colors">
        <div className="h-16 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              alt="StageCue AI Logo"
              className="h-8 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XANUNo-208yJkwIoiOY2V-tGP1T9LSCl4JnhyS4C_RSli77cFqC7_3rLblr0-Njfw_8Xqys1rfKBck0ZGwg9aEEaFhVKMiUkUb4awAbXC-5xHdJTyjebyP_1T6OMiXtohMrPeGfymalh9GpFNhnfqqBbeBT9PzsC8Imr48JSVRYTglEooiQVcSdWytK7NfC80l-HIH0DXQ2WZAAoKAit879ITxuROKN_sLbeZfCH4A447CwMc_y8YdsNM"
              onClick={() => onTabChange('script')}
            />
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-base sm:text-lg tracking-tight text-[#e4e1ee] leading-tight">
                StageCue AI
              </span>
              <span className="font-['Space_Mono'] text-[10px] sm:text-[11px] text-[#d7c3ae] truncate max-w-[130px]">
                {getSubLabel()}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile, visible on md+) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1b1b24]/90 p-1 rounded-full border border-[#34343e]/60">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-['Space_Mono'] font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#f5a623] text-[#452b00] shadow-md scale-102'
                      : 'text-[#d7c3ae] hover:text-[#e4e1ee] hover:bg-[#292933]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Rehearsal Pill & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleRehearsalMode}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                rehearsalMode
                  ? 'bg-[#292933] border border-[#f5a623]/50 shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                  : 'bg-[#1f1f28] border border-[#34343e] opacity-75 hover:opacity-100'
              }`}
              title="Toggle Live Stage Rehearsal Mode"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  rehearsalMode ? 'bg-[#f5a623] animate-pulse' : 'bg-[#9f8e7a]'
                }`}
              ></span>
              <span
                className={`font-['Space_Mono'] text-[10px] sm:text-[11px] uppercase tracking-wider font-bold ${
                  rehearsalMode ? 'text-[#ffc880]' : 'text-[#9f8e7a]'
                }`}
              >
                Rehearsal Mode
              </span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full bg-[#ffc880] hover:bg-[#f5a623] transition-colors flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label="Profile and Settings"
            >
              <span className="material-symbols-outlined text-[#452b00] text-[18px]">
                person
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile & Stage Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1f1f28] border border-[#34343e] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f5a623] text-[#452b00] font-extrabold flex items-center justify-center text-lg shadow-md">
                  {selectedActor[0] || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-[#e4e1ee] text-base leading-tight">
                    Stage Supervisor
                  </h3>
                  <p className="text-xs text-[#d7c3ae] font-['Space_Mono']">
                    Performer Focus: {selectedActor}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg text-[#d7c3ae] hover:text-[#e4e1ee] hover:bg-[#34343e] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#34343e]">
              <div className="flex items-center justify-between py-1.5 text-xs text-[#d7c3ae]">
                <span>Stage Standard</span>
                <span className="text-[#82deff] font-['Space_Mono'] font-bold">Samuel French</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-xs text-[#d7c3ae]">
                <span>Prompt Speech Voice</span>
                <span className="text-[#ffc880] font-['Space_Mono'] font-bold">Web Speech API</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-xs text-[#d7c3ae]">
                <span>Rehearsal Status</span>
                <span className="px-2 py-0.5 rounded bg-[#f5a623]/20 text-[#ffc880] text-[10px] font-bold uppercase font-['Space_Mono']">
                  {rehearsalMode ? 'Active (Solo Spotlight)' : 'Full Cast Stream'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#f5a623] hover:bg-[#ffb955] text-[#452b00] font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-98"
            >
              Back to Stage
            </button>
          </div>
        </div>
      )}
    </>
  );
};
