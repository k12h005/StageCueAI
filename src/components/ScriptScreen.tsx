import React, { useState } from 'react';
import { ScriptData } from '../types';
import { ExportModal } from './ExportModal';

interface ScriptScreenProps {
  script: ScriptData;
  selectedActor: string;
  onSelectActor: (actor: string) => void;
  onNavigateToPerformer: (actor?: string) => void;
  rehearsalMode: boolean;
}

export const ScriptScreen: React.FC<ScriptScreenProps> = ({
  script,
  selectedActor,
  onSelectActor,
  onNavigateToPerformer,
  rehearsalMode,
}) => {
  const [isolatedActor, setIsolatedActor] = useState<string | null>(null);
  const [showDirectorLens, setShowDirectorLens] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const toggleActorFocus = (actorName: string) => {
    if (isolatedActor === actorName) {
      setIsolatedActor(null);
    } else {
      setIsolatedActor(actorName);
      onSelectActor(actorName);

      // Smoothly scroll to the first line of the selected actor
      setTimeout(() => {
        const firstLine = document.querySelector(`[data-actor="${actorName.toUpperCase()}"]`);
        if (firstLine) {
          firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  };

  const handleIsolateCuesClick = () => {
    const target = isolatedActor || selectedActor || script.characters[0]?.name || 'PRIYA';
    onSelectActor(target);
    onNavigateToPerformer(target);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
      {/* Responsive Grid: on lg+, left rail holds cast & rehearsal tools; right rail holds full script */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Main Script Content Column (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Production Snapshot & Meta Card */}
          <div className="w-full rounded-2xl bg-[#292933] p-4 sm:p-5 shadow-lg flex flex-col gap-3 relative overflow-hidden border border-[#34343e]/50">
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-[#f5a623]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ad0224] text-[#ffdad6] font-['Space_Mono'] text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                    {script.draftBadge}
                  </span>
                  <span className="flex items-center gap-1 font-['Space_Mono'] text-[11px] text-[#d7c3ae]">
                    <span className="material-symbols-outlined text-[14px] text-[#ffc880]">
                      verified
                    </span>
                    AI Validated
                  </span>
                </div>
                <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#e4e1ee] tracking-tight uppercase leading-tight">
                  {script.title}
                </h1>
                <p className="font-['Space_Mono'] text-[12px] sm:text-[13px] text-[#d7c3ae] font-bold mt-1">
                  {script.formatSubtitle}
                </p>
              </div>

              <button
                onClick={() => setShowExportModal(true)}
                aria-label="Export Script"
                className="p-2.5 rounded-xl bg-[#1f1f28] hover:bg-[#34343e] text-[#d7c3ae] hover:text-[#ffc880] transition-colors flex items-center justify-center shadow-md cursor-pointer border border-[#34343e] active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-[22px]">download</span>
              </button>
            </div>

            {/* Quick Actions Action Shelf */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => onNavigateToPerformer(isolatedActor || selectedActor)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#f5a623] hover:bg-[#ffb955] text-[#452b00] font-['Plus_Jakarta_Sans'] text-[13px] font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Character View</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => setShowDirectorLens(!showDirectorLens)}
                className={`px-3.5 py-2.5 rounded-xl font-['Space_Mono'] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border active:scale-95 ${
                  showDirectorLens
                    ? 'bg-[#1f1f28] border-[#82deff] text-[#82deff] shadow-[0_0_12px_rgba(130,222,255,0.15)]'
                    : 'bg-[#1f1f28] border-[#34343e] text-[#e4e1ee] hover:bg-[#34343e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#82deff]">
                  tune
                </span>
                <span>Director Lens</span>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Cast & Prop Manifest (Visible only below lg) */}
          <div className="lg:hidden flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-['Space_Mono'] text-[11px] uppercase tracking-widest text-[#d7c3ae] font-bold">
                Cast & Prop Manifest
              </span>
              <span className="font-['Space_Mono'] text-[11px] text-[#ffc880] font-bold">
                {isolatedActor ? `Focusing: ${isolatedActor} (Tap to reset)` : 'Tap to focus'}
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-3 px-3 sm:-mx-6 sm:px-6">
              {script.characters.map((char) => {
                const isIsolated = isolatedActor === char.name;
                return (
                  <div
                    key={char.id}
                    onClick={() => toggleActorFocus(char.name)}
                    className={`flex-shrink-0 w-64 p-3.5 rounded-xl cursor-pointer transition-all duration-200 border active:scale-98 ${
                      isIsolated
                        ? 'bg-[#34343e] border-[#f5a623] shadow-lg scale-[1.01]'
                        : 'bg-[#1f1f28] border-[#34343e]/50 hover:bg-[#292933]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: char.color }}
                        ></span>
                        <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] text-[#e4e1ee]">
                          {char.name}
                        </span>
                      </div>
                      <span className="font-['Space_Mono'] text-[10px] px-1.5 py-0.5 rounded bg-[#34343e] text-[#d7c3ae] font-bold">
                        {char.roleTag}
                      </span>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#d7c3ae] leading-relaxed mb-2 line-clamp-2">
                      {char.description}
                    </p>
                    <div className="flex items-center gap-3 font-['Space_Mono'] text-[11px] text-[#ffc880] font-bold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          chat_bubble
                        </span>
                        {char.linesCount} lines
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          pan_tool
                        </span>
                        {char.propsCount} props
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theatrical Script Stream Container */}
          <div className="flex flex-col gap-4 w-full bg-[#0d0d16] rounded-2xl p-4 sm:p-6 shadow-inner relative border border-[#34343e]/50">
            {/* Scene Telemetry */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-[#1f1f28]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623] animate-pulse"></span>
                  <span className="font-['Space_Mono'] text-[11px] sm:text-xs text-[#ffc880] uppercase font-extrabold tracking-widest">
                    {script.actScene}
                  </span>
                </div>
                <span className="font-['Space_Mono'] text-[11px] px-2.5 py-0.5 rounded-full bg-[#1f1f28] text-[#d7c3ae] flex items-center gap-1 border border-[#34343e]/40">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  {script.timeStamp}
                </span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#e4e1ee] tracking-tight">
                {script.sceneTitle}
              </h2>

              {/* Stage Atmosphere Visualizer Cue */}
              <div className="rounded-xl p-3.5 bg-[#1f1f28] text-[#d7c3ae] font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] leading-relaxed mt-1 border border-[#34343e]/40 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#ffc880] text-[20px] flex-shrink-0 mt-0.5">
                    wb_twilight
                  </span>
                  <span className="italic text-[#e4e1ee] leading-relaxed">
                    {script.atmosphere}
                  </span>
                </div>
              </div>
            </div>

            {/* Script Items Stream with Smooth Transitions */}
            <div className="flex flex-col gap-3.5" id="script-flow">
              {script.scriptFlow.map((item) => {
                if (item.type === 'cue' && item.cueData) {
                  const themeColor =
                    item.cueData.colorTheme === 'tertiary'
                      ? 'bg-[#45c4eb]/15 text-[#82deff] border-[#45c4eb]/30'
                      : item.cueData.colorTheme === 'secondary'
                      ? 'bg-[#ad0224]/20 text-[#ffb3b1] border-[#ad0224]/40'
                      : 'bg-[#f5a623]/15 text-[#ffc880] border-[#f5a623]/30';

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 self-start py-1.5 px-3.5 rounded-full ${themeColor} font-['Space_Mono'] text-xs font-bold shadow-sm border`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {item.cueData.icon}
                      </span>
                      <span>{item.cueData.text}</span>
                    </div>
                  );
                }

                if (item.type === 'dialogue' && item.dialogueData) {
                  const d = item.dialogueData;
                  const isMatch =
                    !isolatedActor || isolatedActor.toUpperCase() === d.actor.toUpperCase();
                  const isLead = d.actor.toUpperCase() === 'PRIYA';
                  const isDev = d.actor.toUpperCase() === 'DEV';
                  const actorColor = isLead ? '#ffc880' : isDev ? '#ffb3b1' : '#82deff';

                  return (
                    <div
                      key={item.id}
                      data-actor={d.actor.toUpperCase()}
                      style={{
                        opacity: isMatch ? 1 : 0.3,
                        transform: isMatch ? 'scale(1)' : 'scale(0.99)',
                      }}
                      className={`flex flex-col p-3.5 sm:p-4 rounded-xl transition-all duration-300 gap-1.5 relative overflow-hidden border ${
                        d.isActiveCue
                          ? 'bg-[#292933] border-[#f5a623]/50 shadow-md'
                          : 'bg-[#1f1f28] border-transparent hover:bg-[#292933]/70'
                      }`}
                    >
                      {/* Left Active Amber Bar if active cue */}
                      {d.isActiveCue && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f5a623]"></div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] sm:text-base tracking-widest"
                            style={{ color: actorColor }}
                          >
                            {d.actor}
                          </span>
                          {d.isActiveCue && (
                            <span className="px-2 py-0.5 rounded-full bg-[#f5a623]/20 text-[#ffc880] font-['Space_Mono'] text-[10px] uppercase font-bold tracking-wider">
                              Active Cue
                            </span>
                          )}
                        </div>

                        <span className="font-['Space_Mono'] text-xs text-[#d7c3ae] flex items-center gap-1 font-bold">
                          <span
                            className="material-symbols-outlined text-[13px]"
                            style={{ color: actorColor }}
                          >
                            pin_drop
                          </span>
                          {d.blocking}
                        </span>
                      </div>

                      {d.subtext && (
                        <p className="font-['Space_Mono'] text-xs text-[#9f8e7a] italic pl-2 sm:pl-3">
                          {d.subtext}
                        </p>
                      )}

                      <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-[17px] text-[#e4e1ee] pl-2 sm:pl-3 leading-relaxed">
                        {d.dialogue}
                      </p>

                      {/* Director Lens Details if toggled */}
                      {showDirectorLens && d.directorNotes && (
                        <div className="mt-2 ml-2 sm:ml-3 p-2.5 rounded-xl bg-[#0d0d16] border border-[#82deff]/30 text-xs font-['Space_Mono'] text-[#82deff] flex items-start gap-2 animate-in fade-in duration-200">
                          <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#82deff] shrink-0">
                            visibility
                          </span>
                          <span>Director Lens: {d.directorNotes}</span>
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Script Page End Marker */}
            <div className="flex items-center justify-center gap-2 py-4 text-[#d7c3ae] font-['Space_Mono'] text-xs opacity-60">
              <span className="w-10 h-px bg-[#34343e]"></span>
              <span>END OF EXCERPT · SCENE CONTINUES</span>
              <span className="w-10 h-px bg-[#34343e]"></span>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar for Desktop (lg:col-span-4) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-4 sticky top-20">
          {/* Cast & Prop Manifest Desktop Card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-[#1f1f28] p-4 sm:p-5 border border-[#34343e]/50 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#d7c3ae] font-bold">
                Cast & Prop Manifest
              </span>
              <span className="font-['Space_Mono'] text-[11px] text-[#ffc880] font-bold">
                {isolatedActor ? `Focused: ${isolatedActor}` : 'Click to isolate'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {script.characters.map((char) => {
                const isIsolated = isolatedActor === char.name;
                return (
                  <div
                    key={char.id}
                    onClick={() => toggleActorFocus(char.name)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isIsolated
                        ? 'bg-[#34343e] border-[#f5a623] shadow-md scale-[1.01]'
                        : 'bg-[#1b1b24] border-[#34343e]/40 hover:bg-[#292933]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: char.color }}
                        ></span>
                        <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] text-[#e4e1ee]">
                          {char.name}
                        </span>
                      </div>
                      <span className="font-['Space_Mono'] text-[10px] px-2 py-0.5 rounded bg-[#34343e] text-[#d7c3ae] font-bold">
                        {char.roleTag}
                      </span>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#d7c3ae] leading-relaxed mb-2">
                      {char.description}
                    </p>
                    <div className="flex items-center gap-3 font-['Space_Mono'] text-[11px] text-[#ffc880] font-bold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          chat_bubble
                        </span>
                        {char.linesCount} lines
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          pan_tool
                        </span>
                        {char.propsCount} props
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rehearsal Callout Card on Desktop */}
          <div className="w-full rounded-2xl bg-[#292933] p-4 sm:p-5 shadow-xl flex flex-col gap-3 border border-[#34343e]/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5a623] text-[#452b00] flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[24px]">theater_comedy</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#e4e1ee] leading-snug">
                  Ready to rehearse?
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#d7c3ae] leading-relaxed mt-0.5">
                  Isolate your cues, dim other actors' lines to 30%, and rehearse with live stage audio prompts.
                </p>
              </div>
            </div>

            {/* Actor Pill Selection Trigger */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {script.characters.map((char) => {
                const isSelected = (isolatedActor || selectedActor) === char.name;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      setIsolatedActor(char.name);
                      onSelectActor(char.name);
                    }}
                    className={`py-2 px-1 rounded-xl font-['Plus_Jakarta_Sans'] font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffc880] text-[#452b00] shadow-md font-black'
                        : 'bg-[#1f1f28] text-[#e4e1ee] hover:bg-[#34343e]'
                    }`}
                  >
                    <span>{char.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleIsolateCuesClick}
              className="w-full py-3 px-4 rounded-xl bg-[#f5a623] hover:bg-[#ffb955] text-[#452b00] font-['Plus_Jakarta_Sans'] text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <span>Isolate Performer Cues</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Rehearsal Box (Visible only below lg) */}
        <div className="lg:hidden w-full rounded-2xl bg-[#292933] p-4 shadow-xl flex flex-col gap-3 mb-4 border border-[#34343e]/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5a623] text-[#452b00] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[22px]">theater_comedy</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#e4e1ee] leading-snug">
                Ready to rehearse?
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#d7c3ae] leading-relaxed">
                Isolate your cues, dim other actors' lines to 30%, and rehearse with live stage audio prompts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {script.characters.map((char) => {
              const isSelected = (isolatedActor || selectedActor) === char.name;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    setIsolatedActor(char.name);
                    onSelectActor(char.name);
                  }}
                  className={`py-2 px-2 rounded-xl font-['Plus_Jakarta_Sans'] font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ffc880] text-[#452b00] shadow'
                      : 'bg-[#1f1f28] text-[#e4e1ee] hover:bg-[#34343e]'
                  }`}
                >
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleIsolateCuesClick}
            className="w-full py-2.5 px-4 rounded-xl bg-[#f5a623] hover:bg-[#ffb955] text-[#452b00] font-['Plus_Jakarta_Sans'] text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Isolate Performer Cues</span>
          </button>
        </div>
      </div>

      <ExportModal
        script={script}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};
