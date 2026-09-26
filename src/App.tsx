/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScriptData } from './types';
import { defaultScript } from './data/defaultScript';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { CreateScreen } from './components/CreateScreen';
import { ScriptScreen } from './components/ScriptScreen';
import { PerformerScreen } from './components/PerformerScreen';
import { CueCardsScreen } from './components/CueCardsScreen';
import { motion, AnimatePresence } from 'motion/react';
import { generateScript } from './services/scriptService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('script');
  const [script, setScript] = useState<ScriptData>(defaultScript);
  const [selectedActor, setSelectedActor] = useState<string>('PRIYA');
  const [rehearsalMode, setRehearsalMode] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleRehearsalMode = () => {
    const nextState = !rehearsalMode;
    setRehearsalMode(nextState);
    showToast(
      nextState
        ? 'Rehearsal Mode Active: Cues highlighted, live prompts armed'
        : 'Rehearsal Mode Paused: Standard theatrical script view'
    );
  };

  const handleGenerateScript = async (params: {
    premise: string;
    castSize: number;
    duration: string;
    genre: string;
  }) => {
    setIsGenerating(true);
    try {
      const newScript = await generateScript(params);
      setScript(newScript);
      if (newScript.characters.length > 0) {
        setSelectedActor(newScript.characters[0].name);
      }
      showToast(`Generated: ${newScript.title} with ${newScript.characters.length} onstage roles!`);
      setCurrentTab('script');
    } catch (err) {
      console.error('Failed to generate script:', err);
      showToast('Error generating script. Loaded standard fallback.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNavigateToPerformer = (actor?: string) => {
    if (actor) {
      setSelectedActor(actor);
    }
    setCurrentTab('performer');
  };

  const handleNavigateToCueCards = () => {
    setCurrentTab('cue-cards');
  };

  return (
    <div className="bg-[#13131b] min-h-screen text-[#e4e1ee] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#f5a623] selection:text-[#452b00] overflow-x-hidden">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        rehearsalMode={rehearsalMode}
        onToggleRehearsalMode={handleToggleRehearsalMode}
        selectedActor={selectedActor}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#f5a623] text-[#452b00] font-['Space_Mono'] text-xs font-black shadow-2xl flex items-center gap-2 border border-[#ffddb4]/50 pointer-events-none"
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Smooth Motion Tab Transitions */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          {currentTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full flex-1"
            >
              <CreateScreen
                onGenerate={handleGenerateScript}
                isGenerating={isGenerating}
                currentScript={script}
              />
            </motion.div>
          )}

          {currentTab === 'script' && (
            <motion.div
              key="script"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full flex-1"
            >
              <ScriptScreen
                script={script}
                selectedActor={selectedActor}
                onSelectActor={setSelectedActor}
                onNavigateToPerformer={handleNavigateToPerformer}
                rehearsalMode={rehearsalMode}
              />
            </motion.div>
          )}

          {currentTab === 'performer' && (
            <motion.div
              key="performer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full flex-1"
            >
              <PerformerScreen
                script={script}
                selectedActor={selectedActor}
                onSelectActor={setSelectedActor}
                onNavigateToCueCards={handleNavigateToCueCards}
              />
            </motion.div>
          )}

          {currentTab === 'cue-cards' && (
            <motion.div
              key="cue-cards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full flex-1"
            >
              <CueCardsScreen
                script={script}
                selectedActor={selectedActor}
                onSelectActor={setSelectedActor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
