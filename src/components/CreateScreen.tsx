import React, { useState, useEffect } from 'react';
import { samplePremises } from '../data/defaultScript';
import { ScriptData } from '../types';

interface CreateScreenProps {
  onGenerate: (params: {
    premise: string;
    castSize: number;
    duration: string;
    genre: string;
  }) => Promise<void>;
  isGenerating: boolean;
  currentScript: ScriptData;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({
  onGenerate,
  isGenerating,
  currentScript,
}) => {
  const [premise, setPremise] = useState(
    'Three college friends discover that their project is due in 10 minutes and frantically try to finish it before the portal locks.'
  );
  const [castSize, setCastSize] = useState<number>(3);
  const [duration, setDuration] = useState<string>('10 Mins');
  const [genre, setGenre] = useState<string>('Comedy / Satire');
  const [rolesExpanded, setRolesExpanded] = useState<boolean>(true);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [generationStep, setGenerationStep] = useState<string>('Analyzing Scene Dynamics...');

  const castOptions = [2, 3, 4, 5];
  const durationOptions = ['5 Mins', '10 Mins', '15 Mins'];
  const genreOptions = [
    { name: 'Comedy / Satire', icon: '⚡' },
    { name: 'Drama', icon: '🎭' },
    { name: 'Mystery', icon: '🔍' },
    { name: 'Absurdist', icon: '🎪' },
  ];

  // Cycling generation message for non-abrupt delightful loading
  useEffect(() => {
    if (!isGenerating) return;
    const steps = [
      'Analyzing dramatic conflict & pacing...',
      'Assigning stage blocking vectors & props (DL, CS, DSC)...',
      'Synthesizing Samuel French standard cues...',
      'Assembling rehearsal cue cards for cast...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setGenerationStep(steps[idx]);
    }, 900);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSelectPrompt = (index: number) => {
    const item = samplePremises[index];
    if (item) {
      setSelectedPromptIndex(index);
      setPremise(item.premise);
      setCastSize(item.castSize);
      setDuration(item.duration);
      setGenre(item.genre);
    }
  };

  const handleGenerateClick = async () => {
    await onGenerate({
      premise,
      castSize,
      duration,
      genre,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
      {/* Responsive Grid: 1 col on mobile, 2 cols on md+ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column (Main Story Input & Roles Breakdown) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Visual Spotlight Accent & Header Unit */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1f1f28] p-4 sm:p-5 shadow-lg border border-[#34343e]/50">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#f5a623]/15 blur-2xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f5a623] rounded-l-2xl"></div>
            <div className="relative flex flex-col space-y-1.5 pl-2">
              <div className="inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full bg-[#292933] text-[#ffc880] border border-[#f5a623]/25">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span className="font-['Space_Mono'] text-[11px] uppercase tracking-wider font-bold">
                  AI Theatrical Writer
                </span>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#e4e1ee] tracking-tight leading-tight">
                Turn Any Story Idea into a Stage Script
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#d7c3ae] leading-relaxed">
                From rough premise to ready-to-perform scenes and cue cards in seconds.
              </p>
            </div>
          </div>

          {/* Main Story Input Card */}
          <div className="flex flex-col rounded-2xl bg-[#1f1f28] p-4 sm:p-5 space-y-3 shadow-md border border-[#34343e]/50">
            <div className="flex items-center justify-between">
              <label
                className="font-['Plus_Jakarta_Sans'] font-extrabold text-[14px] sm:text-[15px] text-[#e4e1ee] flex items-center gap-1.5 tracking-wider"
                htmlFor="story-premise"
              >
                <span className="material-symbols-outlined text-[#ffc880] text-[20px]">
                  edit_note
                </span>
                THE PREMISE & CONFLICT
              </label>
              <span className="font-['Space_Mono'] text-[11px] text-[#d7c3ae] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#82deff] animate-pulse"></span>
                Auto-parsing active
              </span>
            </div>

            {/* Textarea Frame with smooth focus */}
            <div className="relative rounded-xl bg-[#0d0d16] border border-[#34343e] transition-all duration-300 focus-within:border-[#f5a623] focus-within:shadow-[0_0_15px_rgba(245,166,35,0.15)]">
              <textarea
                id="story-premise"
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                className="w-full bg-transparent p-3 sm:p-4 font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#e4e1ee] placeholder:text-[#9f8e7a] focus:outline-none resize-none rounded-xl leading-relaxed"
                placeholder="Describe characters, premise, key conflict, or setting..."
                rows={4}
              />
              <div className="flex items-center justify-between px-3 pb-2.5 pt-0">
                <span className="font-['Space_Mono'] text-[11px] text-[#d7c3ae] hidden sm:inline">
                  Describe characters, premise, key conflict, or setting.
                </span>
                <span className="font-['Space_Mono'] text-[11px] text-[#9f8e7a] ml-auto">
                  {premise.length} chars
                </span>
              </div>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-col space-y-2 pt-1">
              <span className="font-['Space_Mono'] text-[11px] text-[#d7c3ae] uppercase tracking-wider font-bold">
                Quick Prompts:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {samplePremises.map((item, idx) => {
                  const isSelected = selectedPromptIndex === idx;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleSelectPrompt(idx)}
                      className={`shrink-0 px-3 py-1.5 rounded-full transition-all duration-200 font-['Space_Mono'] text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#34343e] text-[#ffc880] border border-[#f5a623]/50 shadow-md font-bold'
                          : 'bg-[#292933] text-[#d7c3ae] hover:text-[#e4e1ee] hover:bg-[#34343e] border border-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detected Character Roles Accordion */}
          <div className="rounded-2xl bg-[#1b1b24] overflow-hidden shadow-sm border border-[#34343e]/50 transition-all">
            <button
              type="button"
              onClick={() => setRolesExpanded(!rolesExpanded)}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-[#1f1f28] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#82deff] shrink-0 animate-ping"></div>
                <span className="font-['Space_Mono'] text-[12px] sm:text-[13px] font-bold text-[#e4e1ee] truncate">
                  Detected {currentScript.characters.length} Cast Roles from Premise
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-[#d7c3ae]">
                <span className="font-['Space_Mono'] text-[11px]">Details</span>
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                    rolesExpanded ? 'rotate-0' : '-rotate-90'
                  }`}
                >
                  expand_more
                </span>
              </div>
            </button>

            {rolesExpanded && (
              <div className="px-3.5 sm:px-4 pb-4 space-y-2 animate-in fade-in duration-200">
                {currentScript.characters.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-[#0d0d16] border border-[#34343e]/40 transition-colors hover:border-[#34343e]"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm ${char.badgeBg}`}
                      style={{ color: '#0d0d16' }}
                    >
                      {char.avatarLetter}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-['Plus_Jakarta_Sans'] font-extrabold text-[13px] sm:text-sm tracking-wider"
                          style={{ color: char.color }}
                        >
                          {char.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-[#34343e] text-[#d7c3ae] text-[10px] font-['Space_Mono'] font-bold">
                          {char.roleTag}
                        </span>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] text-[#d7c3ae] leading-relaxed mt-0.5">
                        {char.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Production Parameters & Action Launchpad) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Visual Production Cue Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1b1b24] shadow-sm p-3.5 sm:p-4 flex items-center gap-3.5 border border-[#34343e]/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-[#34343e] relative shadow-md">
              <img
                className="w-full h-full object-cover"
                alt="Moody theatrical backstage rehearsal studio"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQVJOy1enGOZAswYlPoljT7DFXTW5jIw5RE2gRtSv2YuNbEz3jttA75yy8aXhxhDm0I-t8G02ZFrKbEvG6kg-yrEPSyxqjA3fhw2W3Ys5vE2rtNj7VhM8Kncn0eFCTVFPp_ti-jqdQZqhvr4K2eOkX1DGNeszrCkqwlQHu07LrMViEUHW-NDldT125UMXKfxkURlt0_5jnWoTjLFMEHB27tkRBhZv-miLngmsuyIDXMESiM-PJS4Hj"
              />
              <div className="absolute inset-0 bg-[#f5a623]/20 mix-blend-screen pointer-events-none"></div>
            </div>
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-[#45c4eb]/20 text-[#82deff] font-['Space_Mono'] text-[11px] font-bold">
                  SAMUEL FRENCH STD
                </span>
                <span className="font-['Space_Mono'] text-[11px] text-[#d7c3ae]">Live Parser</span>
              </div>
              <p className="font-['Space_Mono'] text-[12px] sm:text-[13px] text-[#e4e1ee] font-bold truncate mt-1">
                Pacing: High Stakes • Staging: Proscenium
              </p>
              <span className="font-['Space_Mono'] text-[11px] text-[#9f8e7a] truncate mt-0.5">
                Automatic character tagging & line attribution
              </span>
            </div>
          </div>

          {/* Staging & Configuration Card */}
          <div className="flex flex-col rounded-2xl bg-[#1f1f28] p-4 sm:p-5 space-y-4 shadow-md border border-[#34343e]/50">
            <div className="flex items-center justify-between">
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[14px] sm:text-[15px] text-[#e4e1ee] flex items-center gap-1.5 tracking-wider">
                <span className="material-symbols-outlined text-[#ffc880] text-[20px]">
                  tune
                </span>
                PRODUCTION PARAMETERS
              </h2>
              <span className="font-['Space_Mono'] text-[11px] sm:text-[12px] text-[#ffc880] font-bold">
                SCENE 1 FORMAT
              </span>
            </div>

            {/* 1. Cast Size */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-['Space_Mono'] text-[12px] text-[#e4e1ee] font-bold">
                  Cast Size (Characters)
                </span>
                <span className="font-['Space_Mono'] text-[11px] text-[#82deff] font-bold">
                  {castSize} Onstage Roles
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#0d0d16]">
                {castOptions.map((num) => {
                  const active = castSize === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCastSize(num)}
                      className={`py-2 text-center rounded-lg font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                        active
                          ? 'bg-[#f5a623] text-[#452b00] shadow-md font-extrabold'
                          : 'text-[#d7c3ae] hover:text-[#e4e1ee] hover:bg-[#1b1b24]'
                      }`}
                    >
                      {num === 5 ? '5+' : num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Target Stage Time */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-['Space_Mono'] text-[12px] text-[#e4e1ee] font-bold">
                  Target Stage Time
                </span>
                <span className="px-2 py-0.5 rounded bg-[#f5a623]/20 text-[#ffc880] font-['Space_Mono'] text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                  One-Act Skit
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0d0d16]">
                {durationOptions.map((time) => {
                  const active = duration === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDuration(time)}
                      className={`py-2 text-center rounded-lg font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                        active
                          ? 'bg-[#f5a623] text-[#452b00] shadow-md font-extrabold'
                          : 'text-[#d7c3ae] hover:text-[#e4e1ee] hover:bg-[#1b1b24]'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Genre & Dramatic Pitch */}
            <div className="flex flex-col space-y-1.5">
              <span className="font-['Space_Mono'] text-[12px] text-[#e4e1ee] font-bold">
                Genre & Dramatic Pitch
              </span>
              <div className="grid grid-cols-2 gap-2">
                {genreOptions.map((g) => {
                  const active = genre === g.name;
                  return (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => setGenre(g.name)}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer border active:scale-95 ${
                        active
                          ? 'bg-[#292933] border-[#f5a623]/60 text-[#ffc880] shadow-md'
                          : 'bg-[#0d0d16] border-transparent text-[#d7c3ae] hover:text-[#e4e1ee] hover:border-[#34343e]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{g.icon}</span>
                        <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] font-bold truncate">
                          {g.name}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[16px] shrink-0 ${
                          active ? 'text-[#ffc880]' : 'text-transparent'
                        }`}
                      >
                        check_circle
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Stage CTA Button with Non-Abrupt Loading State */}
          <div className="pt-1 pb-6 sm:pb-2 flex flex-col space-y-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateClick}
              className="w-full relative group overflow-hidden rounded-2xl bg-[#f5a623] hover:bg-[#ffb955] p-4 sm:p-5 shadow-xl text-left active:scale-[0.98] transition-all cursor-pointer disabled:opacity-85"
            >
              <div className="relative flex items-center justify-between">
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#452b00] font-bold text-[22px] sm:text-[24px]">
                      bolt
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm sm:text-base text-[#452b00] uppercase tracking-wider">
                      {isGenerating ? 'Synthesizing Production...' : 'Generate Complete Script'}
                    </span>
                  </div>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] text-[#644000] font-semibold leading-tight mt-1">
                    {isGenerating
                      ? generationStep
                      : 'Creates full dialogues, blocking, prop cues & role cue cards'}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#452b00]/15 flex items-center justify-center shrink-0 text-[#452b00] group-hover:translate-x-1 transition-transform shadow-inner">
                  {isGenerating ? (
                    <span className="w-6 h-6 border-3 border-[#452b00] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-[26px]">
                      arrow_forward
                    </span>
                  )}
                </div>
              </div>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[#d7c3ae] pt-1">
              <span className="material-symbols-outlined text-[14px] text-[#ffc880]">
                verified
              </span>
              <span className="font-['Space_Mono'] text-[11px] text-center">
                Follows standard Stageplay & Samuel French formatting.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
