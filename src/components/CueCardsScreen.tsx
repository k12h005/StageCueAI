import React, { useState, useEffect, useRef } from 'react';
import { ScriptData, PerformerCue } from '../types';
import { speakCue, stopSpeaking } from '../utils/speech';
import { motion, AnimatePresence } from 'motion/react';

interface CueCardsScreenProps {
  script: ScriptData;
  selectedActor: string;
  onSelectActor: (actor: string) => void;
}

export const CueCardsScreen: React.FC<CueCardsScreenProps> = ({
  script,
  selectedActor,
  onSelectActor,
}) => {
  const [currentCueIndex, setCurrentCueIndex] = useState<number>(1);
  const [isLargeStageType, setIsLargeStageType] = useState<boolean>(false);
  const [masteredCues, setMasteredCues] = useState<Record<string, boolean>>({});
  const [isAutoAdvance, setIsAutoAdvance] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<number>(1); // 1 = next, -1 = prev

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentChar =
    script.characters.find(
      (c) => c.name.toUpperCase() === selectedActor.toUpperCase()
    ) || script.characters[0];

  const cues: PerformerCue[] =
    script.performerCues[currentChar.name.toUpperCase()] ||
    script.performerCues[currentChar.name] ||
    script.performerCues['PRIYA'] ||
    [];

  const safeIndex = Math.min(Math.max(0, currentCueIndex), cues.length - 1);
  const cue = cues[safeIndex] || cues[0];

  const totalCues = cues.length;
  const progressPercent = totalCues > 0 ? Math.round(((safeIndex + 1) / totalCues) * 100) : 0;
  const isCurrentMastered = !!masteredCues[cue?.id];

  const handleNextCue = () => {
    if (safeIndex < totalCues - 1) {
      setSlideDirection(1);
      setCurrentCueIndex(safeIndex + 1);
    }
  };

  const handlePrevCue = () => {
    if (safeIndex > 0) {
      setSlideDirection(-1);
      setCurrentCueIndex(safeIndex - 1);
    }
  };

  const jumpToCue = (index: number) => {
    setSlideDirection(index > safeIndex ? 1 : -1);
    setCurrentCueIndex(index);
  };

  const toggleMastered = () => {
    if (!cue) return;
    setMasteredCues((prev) => ({
      ...prev,
      [cue.id]: !prev[cue.id],
    }));
  };

  const handlePlayIncomingCue = () => {
    if (!cue) return;
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = `${cue.incomingCue.speaker} says: ${cue.incomingCue.dialogue}`;
      speakCue(text, () => {
        setIsPlayingAudio(false);
        if (isAutoAdvance) {
          setTimeout(() => {
            handleNextCue();
          }, 3200);
        }
      });
    }
  };

  // Keyboard navigation for rehearsal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextCue();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, totalCues]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextCue(); // Swiped left -> next
      } else {
        handlePrevCue(); // Swiped right -> prev
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!cue) {
    return (
      <div className="p-8 text-center text-[#d7c3ae] font-['Space_Mono']">
        No cue cards generated for {currentChar.name}.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4 select-none">
      {/* Responsive layout: 2 cols on lg screens (Cue Deck list on left, Focal Card on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Desktop Sidebar: All Cues Navigator in Scene */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-3 sticky top-20">
          <div className="flex flex-col gap-2 rounded-2xl bg-[#1b1b24] p-4 border border-[#34343e]/50 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-[#34343e]/40">
              <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#d7c3ae] font-bold">
                Cue Cards Deck ({cues.length})
              </span>
              <span className="font-['Space_Mono'] text-xs text-[#ffc880] font-bold">
                {currentChar.name}
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {cues.map((c, idx) => {
                const isActive = idx === safeIndex;
                const isMastered = masteredCues[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => jumpToCue(idx)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#292933] border-[#f5a623] shadow-md scale-[1.01]'
                        : 'bg-[#1f1f28] border-transparent hover:bg-[#292933]/60'
                    }`}
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className={`font-['Space_Mono'] text-xs font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#f5a623] text-[#452b00]'
                            : 'bg-[#34343e] text-[#d7c3ae]'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      {isMastered && (
                        <span className="material-symbols-outlined text-[14px] text-[#ffc880] mt-1">
                          check_circle
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Plus_Jakarta_Sans'] font-semibold text-xs text-[#e4e1ee] truncate">
                        {c.activeLine.dialogue}
                      </span>
                      <span className="font-['Space_Mono'] text-[10px] text-[#d7c3ae] truncate mt-0.5">
                        Listen: {c.incomingCue.speaker}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Focal Cue Card Container (lg:col-span-8) */}
        <div
          className="lg:col-span-8 flex flex-col gap-3.5"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress HUD & Rehearsal Toolbar */}
          <section className="flex flex-col gap-2 bg-[#1b1b24] p-3.5 sm:p-4 rounded-2xl shadow-md border border-[#34343e]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#ffc880] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  theater_comedy
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] sm:text-base text-[#e4e1ee]">
                  {currentChar.name} ({currentChar.roleTag})
                </span>
                <span className="text-[#9f8e7a] text-xs font-['Space_Mono']">·</span>
                <span className="font-['Space_Mono'] text-xs text-[#d7c3ae] uppercase font-bold">
                  Scene 1
                </span>
              </div>

              <button
                onClick={() => setIsLargeStageType(!isLargeStageType)}
                aria-label="Toggle Stage Type Magnification"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm cursor-pointer border ${
                  isLargeStageType
                    ? 'bg-[#f5a623] border-[#ffc880] text-[#452b00] shadow-[0_0_12px_rgba(245,166,35,0.2)]'
                    : 'bg-[#34343e] border-[#34343e] text-[#e4e1ee] hover:bg-[#393842]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isLargeStageType ? 'zoom_out' : 'zoom_in'}
                </span>
                <span className="font-['Space_Mono'] text-xs font-bold uppercase tracking-wider">
                  Large Stage Type
                </span>
              </button>
            </div>

            {/* Progress Tracker */}
            <div className="flex items-center justify-between mt-1">
              <span className="font-['Space_Mono'] text-xs text-[#d7c3ae] uppercase tracking-widest font-bold">
                Cue {safeIndex + 1} of {totalCues}
              </span>
              <span className="font-['Space_Mono'] text-xs text-[#ffc880] font-bold">
                {progressPercent}% Completed
              </span>
            </div>

            <div className="w-full h-2 bg-[#34343e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f5a623] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </section>

          {/* Central Focal Cue Card with Animated Slide Transitions */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.article
                key={cue.id}
                initial={{ opacity: 0, x: slideDirection * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -slideDirection * 40 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative flex flex-col gap-3.5 bg-[#1f1f28] p-4 sm:p-6 rounded-2xl shadow-2xl border border-[#34343e]/60 overflow-hidden"
              >
                {/* Amber Spotlight Aura Glow */}
                <div className="absolute -top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#f5a623] to-transparent opacity-90 blur-xs"></div>
                <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-b from-[#f5a623]/10 via-transparent to-transparent opacity-50"></div>

                {/* Card Header / Metas */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-[#f5a623] px-2.5 py-1 rounded-lg shadow-sm">
                      <span className="font-['Space_Mono'] text-xs text-[#452b00] font-black tracking-widest">
                        CUE {cue.incomingCue.cueNumber || `#0${safeIndex + 1}`}
                      </span>
                    </div>
                    <span className="font-['Space_Mono'] text-xs sm:text-sm text-[#d7c3ae] font-bold">
                      Beat {safeIndex + 2}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#ad0224]/20 px-3 py-1 rounded-full border border-[#ad0224]/30">
                    <span className="w-2 h-2 rounded-full bg-[#ad0224] animate-ping"></span>
                    <span className="font-['Space_Mono'] text-[11px] text-[#ffb3b1] font-bold tracking-wider uppercase">
                      {cue.isUrgent ? 'High Urgency' : 'Standard Cue'}
                    </span>
                  </div>
                </div>

                {/* Incoming Trigger / Cue To Listen For */}
                <section className="flex flex-col gap-1.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#82deff]">
                        hearing
                      </span>
                      <span className="font-['Space_Mono'] text-xs uppercase tracking-wider text-[#82deff] font-extrabold">
                        Listen For ({cue.incomingCue.speaker})
                      </span>
                    </div>

                    <button
                      onClick={handlePlayIncomingCue}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-['Space_Mono'] font-bold text-[#ffc880] hover:bg-[#292933] transition-all cursor-pointer"
                      title="Speak incoming line"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPlayingAudio ? 'volume_off' : 'volume_up'}
                      </span>
                      <span>{isPlayingAudio ? 'Speaking...' : 'Play Prompt'}</span>
                    </button>
                  </div>

                  <div className="bg-[#292933] p-3.5 rounded-xl flex flex-col gap-1.5 shadow-sm border border-[#34343e]/50">
                    <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#e4e1ee] font-semibold">
                      {cue.incomingCue.speaker}:{' '}
                      <span className="text-[#b7eaff] font-bold">
                        {cue.incomingCue.dialogue}
                      </span>
                    </p>
                    {cue.incomingCue.visualAction && (
                      <p className="font-['Space_Mono'] text-xs text-[#d7c3ae] italic flex items-center gap-1.5 pt-0.5">
                        <span className="material-symbols-outlined text-[15px] text-[#9f8e7a]">
                          visibility
                        </span>
                        {cue.incomingCue.visualAction}
                      </p>
                    )}
                  </div>
                </section>

                {/* YOUR LINE (Glanceable Spotlight Target) */}
                <section className="flex flex-col gap-1.5 relative z-10 bg-[#0d0d16] p-4 sm:p-5 rounded-2xl shadow-md border border-[#f5a623]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-[20px] text-[#ffc880]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        record_voice_over
                      </span>
                      <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#ffc880] font-black">
                        Your Spoken Line
                      </span>
                    </div>
                    <span className="font-['Space_Mono'] text-[11px] text-[#d7c3ae]">
                      Live Cue Focus
                    </span>
                  </div>

                  {/* Dialogue Typography with fluid transition */}
                  <blockquote
                    className={`font-['Plus_Jakarta_Sans'] font-black tracking-tight my-1 text-left leading-tight drop-shadow-md transition-all duration-300 ${
                      isLargeStageType
                        ? 'text-3xl sm:text-4xl text-[#ffc880] py-2'
                        : 'text-2xl sm:text-[26px] text-[#e4e1ee]'
                    }`}
                  >
                    {cue.activeLine.dialogue}
                  </blockquote>

                  {/* Actor Direction & Physical Energy Note */}
                  <div className="flex items-start gap-2 bg-[#292933]/70 px-3 py-2 rounded-xl border border-[#34343e]/50">
                    <span className="material-symbols-outlined text-[#ffc880] text-[18px] mt-0.5 shrink-0">
                      sports_martial_arts
                    </span>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#ffddb4] italic font-medium leading-relaxed">
                      {cue.activeLine.delivery}
                    </p>
                  </div>
                </section>

                {/* Physical Movement & Blocking Grid */}
                <section className="flex flex-col gap-1.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#5bd5fc]">
                        directions_walk
                      </span>
                      <span className="font-['Space_Mono'] text-xs uppercase tracking-wider text-[#5bd5fc] font-bold">
                        Action & Stage Position
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#b7eaff]/10 px-2.5 py-0.5 rounded-full border border-[#82deff]/30">
                      <span className="material-symbols-outlined text-[#82deff] text-[14px]">
                        pin_drop
                      </span>
                      <span className="font-['Space_Mono'] text-xs text-[#82deff] font-bold tracking-wider">
                        {cue.actionsAndProps.blockingText || 'DSC'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#1b1b24] p-3.5 rounded-xl flex flex-col gap-2.5 border border-[#34343e]/50">
                    <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#e4e1ee] leading-relaxed">
                      {cue.actionsAndProps.actionText ||
                        'Hold position firmly, maintain eye line with audience and scene partners.'}
                    </p>
                    <div className="flex items-center justify-between bg-[#34343e]/60 px-3 py-2 rounded-lg">
                      <span className="font-['Space_Mono'] text-xs text-[#d7c3ae] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-[#82deff]">
                          my_location
                        </span>
                        Target: {cue.actionsAndProps.blockingText || 'Center Stage [CS]'}
                      </span>
                      <span className="font-['Space_Mono'] text-[11px] text-[#ffc880] font-extrabold uppercase tracking-wider">
                        {cue.actionsAndProps.vectorText || 'Spur Momentum'}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Next Cue Handoff Indicator */}
                <section className="flex flex-col gap-1 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#d7c3ae]">
                      arrow_forward
                    </span>
                    <span className="font-['Space_Mono'] text-xs uppercase tracking-wider text-[#d7c3ae] font-bold">
                      Next Cue Handoff
                    </span>
                  </div>
                  <div className="bg-[#292933]/50 p-3 rounded-xl border border-[#34343e]/40">
                    <p className="font-['Space_Mono'] text-xs text-[#d7c3ae] leading-relaxed">
                      {cue.nextHandoff}
                    </p>
                  </div>
                </section>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Rehearsal Controls (Secondary Utilities) */}
          <section className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
            <button
              onClick={toggleMastered}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-sm cursor-pointer border ${
                isCurrentMastered
                  ? 'bg-[#292933] border-[#f5a623]/60'
                  : 'bg-[#1b1b24] border-[#34343e] hover:bg-[#292933]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  isCurrentMastered ? 'bg-[#f5a623]' : 'bg-[#34343e]'
                }`}
              >
                {isCurrentMastered && (
                  <span className="material-symbols-outlined text-[18px] text-[#452b00] font-bold">
                    check
                  </span>
                )}
              </div>
              <span className="font-['Space_Mono'] text-xs text-[#e4e1ee] font-bold tracking-wide">
                {isCurrentMastered ? 'Line Mastered' : 'Mark Mastered'}
              </span>
            </button>

            <button
              onClick={() => setIsAutoAdvance(!isAutoAdvance)}
              className="flex items-center justify-center gap-2.5 bg-[#1b1b24] hover:bg-[#292933] p-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-sm cursor-pointer border border-[#34343e]"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAutoAdvance ? 'bg-[#45c4eb] animate-pulse' : 'bg-[#9f8e7a]'
                }`}
              ></span>
              <span
                className={`font-['Space_Mono'] text-xs font-bold tracking-wide truncate ${
                  isAutoAdvance ? 'text-[#82deff]' : 'text-[#e4e1ee]'
                }`}
              >
                {isAutoAdvance ? 'Auto-Advance (On)' : 'Auto-Advance (Off)'}
              </span>
            </button>
          </section>

          {/* Large Tactile Performers Transport Controls */}
          <section className="grid grid-cols-5 gap-2.5 sm:gap-3 mb-2">
            {/* Prev Cue Button */}
            <button
              onClick={handlePrevCue}
              disabled={safeIndex === 0}
              className="col-span-2 flex items-center justify-center gap-1.5 bg-[#292933] hover:bg-[#393842] disabled:opacity-40 p-4 rounded-2xl text-[#e4e1ee] active:scale-95 transition-all shadow-md cursor-pointer border border-[#34343e]"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
              <span className="font-['Space_Mono'] text-xs sm:text-sm tracking-wider uppercase font-bold">
                Prev Cue
              </span>
            </button>

            {/* Next Cue CTA Button (Spotlight Gold) */}
            <button
              onClick={handleNextCue}
              disabled={safeIndex === totalCues - 1}
              className="col-span-3 flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#ffb955] disabled:opacity-40 text-[#452b00] p-4 rounded-2xl active:scale-95 transition-all shadow-xl font-extrabold cursor-pointer border border-[#ffddb4]/30"
            >
              <span className="font-['Space_Mono'] text-xs sm:text-sm tracking-wider uppercase font-black">
                Next Cue
              </span>
              <span className="material-symbols-outlined text-[24px] font-bold">
                chevron_right
              </span>
            </button>
          </section>

          {/* Keyboard & Swipe helper note */}
          <div className="flex items-center justify-center gap-2 text-center text-[#9f8e7a] text-[11px] font-['Space_Mono'] pb-4">
            <span className="material-symbols-outlined text-[14px]">swipe</span>
            <span>Swipe left/right on mobile or use Arrow keys on keyboard to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
