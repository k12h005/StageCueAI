import React, { useState } from 'react';
import { ScriptData, Character, PerformerCue } from '../types';
import { speakCue, stopSpeaking } from '../utils/speech';
import { motion, AnimatePresence } from 'motion/react';

interface PerformerScreenProps {
  script: ScriptData;
  selectedActor: string;
  onSelectActor: (actor: string) => void;
  onNavigateToCueCards: () => void;
}

export const PerformerScreen: React.FC<PerformerScreenProps> = ({
  script,
  selectedActor,
  onSelectActor,
  onNavigateToCueCards,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const currentChar: Character =
    script.characters.find(
      (c) => c.name.toUpperCase() === selectedActor.toUpperCase()
    ) || script.characters[0];

  const cues: PerformerCue[] =
    script.performerCues[currentChar.name.toUpperCase()] ||
    script.performerCues[currentChar.name] ||
    script.performerCues['PRIYA'] ||
    [];

  const otherActors = script.characters
    .filter((c) => c.name.toUpperCase() !== currentChar.name.toUpperCase())
    .map((c) => c.name)
    .join(' & ');

  const handlePlayAudio = (id: string, text: string) => {
    if (playingAudioId === id) {
      stopSpeaking();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      speakCue(text, () => setPlayingAudioId(null));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-4 space-y-4">
      {/* Active Character Switcher Section */}
      <section className="flex flex-col gap-3">
        {/* Character Dropdown / Pill Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#1b1b24] shadow-md border border-[#34343e]/50 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#f5a623] text-[#452b00] flex items-center justify-center shrink-0 shadow-md">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                face_6
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Mono'] text-[11px] text-[#ffc880] tracking-wider uppercase font-bold">
                Acting As
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl sm:text-2xl text-[#e4e1ee] truncate">
                  {currentChar.name}
                </span>
                <span className="text-[#d7c3ae] font-['Plus_Jakarta_Sans'] text-xs sm:text-sm truncate">
                  ({currentChar.roleTag})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#292933] p-1.5 rounded-full border border-[#34343e]/60 self-start sm:self-auto">
            {script.characters.map((c) => {
              const active = c.name.toUpperCase() === currentChar.name.toUpperCase();
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectActor(c.name)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-extrabold transition-all cursor-pointer active:scale-95 ${
                    active
                      ? 'bg-[#f5a623] text-[#452b00] shadow-md scale-102'
                      : 'text-[#d7c3ae] hover:text-[#e4e1ee]'
                  }`}
                  type="button"
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Production Metrics Mosaic with smooth stats presentation */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[#1f1f28] text-center border border-[#34343e]/40 shadow-sm">
            <span className="font-['Space_Mono'] text-base sm:text-xl text-[#ffc880] font-bold">
              {currentChar.stats.lines}
            </span>
            <span className="font-['Space_Mono'] text-[10px] sm:text-xs text-[#d7c3ae] tracking-tight">
              Lines
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[#1f1f28] text-center border border-[#34343e]/40 shadow-sm">
            <span className="font-['Space_Mono'] text-base sm:text-xl text-[#82deff] font-bold">
              {currentChar.stats.actions}
            </span>
            <span className="font-['Space_Mono'] text-[10px] sm:text-xs text-[#d7c3ae] tracking-tight">
              Actions
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[#1f1f28] text-center border border-[#34343e]/40 shadow-sm">
            <span className="font-['Space_Mono'] text-base sm:text-xl text-[#ffddb4] font-bold">
              {currentChar.stats.props}
            </span>
            <span className="font-['Space_Mono'] text-[10px] sm:text-xs text-[#d7c3ae] tracking-tight">
              Props
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[#1f1f28] text-center border border-[#34343e]/40 shadow-sm">
            <span className="font-['Space_Mono'] text-base sm:text-xl text-[#ffb3b1] font-bold">
              {currentChar.stats.entries}
            </span>
            <span className="font-['Space_Mono'] text-[10px] sm:text-xs text-[#d7c3ae] tracking-tight">
              Entry
            </span>
          </div>
        </div>
      </section>

      {/* Rehearsal Ambient Filter Banner */}
      <aside className="flex items-center gap-3 p-3.5 rounded-xl bg-[#292933]/70 backdrop-blur-sm border border-[#34343e]/50">
        <div className="w-9 h-9 rounded-full bg-[#34343e] flex items-center justify-center shrink-0 text-[#ffc880] shadow-sm">
          <span className="material-symbols-outlined text-[20px]">theater_comedy</span>
        </div>
        <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] text-[#d7c3ae] leading-relaxed">
          <strong className="text-[#e4e1ee] font-semibold">Performer Solo Focus:</strong>{' '}
          {otherActors || 'Other'} cues are dimmed. Your spoken lines and physical beats are spotlighted.
        </p>
      </aside>

      {/* Chronological Lines Stream with Animated Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChar.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col space-y-4"
        >
          {cues.map((cue) => {
            const isPlaying = playingAudioId === cue.id;
            return (
              <article
                key={cue.id}
                className="flex flex-col rounded-2xl bg-[#1b1b24] p-4 sm:p-5 space-y-3 shadow-md border border-[#34343e]/50 relative overflow-hidden transition-all hover:border-[#34343e]"
              >
                {/* Ambient Cue Accent Strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f5a623]"></div>

                {/* Trigger Section (Incoming Audio Cue) */}
                <div className="flex flex-col space-y-1.5 pl-2 sm:pl-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          cue.isUrgent ? 'text-[#ffb4ab]' : 'text-[#82deff]'
                        }`}
                      >
                        {cue.isUrgent ? 'campaign' : 'graphic_eq'}
                      </span>
                      <span
                        className={`font-['Space_Mono'] text-[11px] sm:text-xs uppercase tracking-wider font-extrabold ${
                          cue.isUrgent ? 'text-[#ffb4ab]' : 'text-[#82deff]'
                        }`}
                      >
                        {cue.isUrgent ? 'Urgent Cue' : 'Incoming Audio Cue'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-['Space_Mono'] text-xs text-[#d7c3ae]/80 font-bold">
                        {cue.incomingCue.cueNumber} · {cue.incomingCue.timestamp}
                      </span>
                      <button
                        onClick={() =>
                          handlePlayAudio(
                            cue.id,
                            `${cue.incomingCue.speaker} says ${cue.incomingCue.dialogue}`
                          )
                        }
                        title="Play simulated audio prompt"
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-['Space_Mono'] font-bold transition-all cursor-pointer border ${
                          isPlaying
                            ? 'bg-[#f5a623] text-[#452b00] border-[#ffc880] animate-pulse'
                            : 'bg-[#292933] text-[#ffc880] border-[#34343e] hover:bg-[#34343e]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isPlaying ? 'volume_off' : 'volume_up'}
                        </span>
                        <span className="hidden sm:inline">
                          {isPlaying ? 'Speaking...' : 'Play Prompt'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1f1f28]/70 border border-[#34343e]/40">
                    <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#d7c3ae] block mb-0.5">
                      {cue.incomingCue.speaker}
                    </span>
                    <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#d7c3ae] italic">
                      {cue.incomingCue.dialogue}
                    </p>
                  </div>
                </div>

                {/* Active Line (Hero spotlight) */}
                <div className="flex flex-col p-3.5 sm:p-4 rounded-xl bg-[#34343e] shadow-inner space-y-2 ml-2 sm:ml-3 border border-[#f5a623]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffc880] animate-pulse"></span>
                      <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs sm:text-sm text-[#ffc880] uppercase tracking-wider">
                        You ({currentChar.name})
                      </span>
                    </div>
                    <span className="font-['Space_Mono'] text-[11px] px-2.5 py-0.5 rounded-full bg-[#f5a623]/20 text-[#ffc880] font-extrabold">
                      {cue.activeLine.tag || 'Speaking Lead'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[#ffc880] italic font-normal text-xs sm:text-sm font-['Plus_Jakarta_Sans']">
                      {cue.activeLine.delivery}
                    </p>
                    <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#e4e1ee] font-semibold leading-relaxed">
                      {cue.activeLine.dialogue}
                    </p>
                  </div>
                </div>

                {/* Required Blocking & Prop Badge Array */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pl-2 sm:pl-3">
                  {cue.actionsAndProps.actionText && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ad0224]/20 text-[#ffb3b1] font-['Space_Mono'] text-xs font-bold border border-[#ad0224]/30">
                      <span className="material-symbols-outlined text-[15px]">
                        pan_tool
                      </span>
                      <span>{cue.actionsAndProps.actionText}</span>
                    </div>
                  )}

                  {cue.actionsAndProps.propText && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5a623]/20 text-[#ffc880] font-['Space_Mono'] text-xs font-bold border border-[#f5a623]/30">
                      <span className="material-symbols-outlined text-[15px]">
                        fastfood
                      </span>
                      <span>{cue.actionsAndProps.propText}</span>
                    </div>
                  )}

                  {cue.actionsAndProps.blockingText && (
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1f1f28] text-[#82deff] font-['Space_Mono'] text-xs border border-[#34343e]/40">
                      <span className="material-symbols-outlined text-[14px]">
                        place
                      </span>
                      <span>{cue.actionsAndProps.blockingText}</span>
                    </div>
                  )}

                  {cue.actionsAndProps.vectorText && (
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1f1f28] text-[#82deff] font-['Space_Mono'] text-xs border border-[#34343e]/40">
                      <span className="material-symbols-outlined text-[14px]">
                        near_me
                      </span>
                      <span>{cue.actionsAndProps.vectorText}</span>
                    </div>
                  )}
                </div>

                {/* Next Actor Handoff */}
                <div className="flex items-center justify-between pt-1 pl-2 sm:pl-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[16px] text-[#d7c3ae]">
                      arrow_forward
                    </span>
                    <span className="font-['Space_Mono'] text-xs text-[#d7c3ae] truncate">
                      {cue.nextHandoff}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Rehearsal Milestone Card */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1b1b24] shadow-sm border border-[#34343e]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#292933] flex items-center justify-center text-[#ffc880] shadow-sm">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm sm:text-base text-[#e4e1ee] leading-tight">
              Act 1 Cues Synced
            </span>
            <span className="font-['Space_Mono'] text-xs text-[#d7c3ae]">
              Ready for physical walk-through
            </span>
          </div>
        </div>
        <span className="font-['Space_Mono'] text-sm sm:text-base text-[#ffc880] font-bold">
          {cues.length}/{currentChar.stats.lines} Live
        </span>
      </div>

      {/* Bottom Sticky Rehearsal Deck Trigger Bar */}
      <div className="sticky bottom-2 z-20 pt-2 pb-2">
        <button
          onClick={onNavigateToCueCards}
          className="w-full flex items-center justify-between px-6 py-4 rounded-2xl sm:rounded-full bg-[#f5a623] hover:bg-[#ffb955] text-[#452b00] font-['Plus_Jakarta_Sans'] font-extrabold text-sm sm:text-base shadow-2xl active:scale-[0.98] transition-all cursor-pointer border border-[#ffddb4]/40"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              style
            </span>
            <span>Open Rehearsal Cue Cards ({currentChar.name})</span>
          </div>
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
