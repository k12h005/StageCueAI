import React, { useState } from 'react';
import { ScriptData } from '../types';

interface ExportModalProps {
  script: ScriptData;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ script, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatePlainTextScript = () => {
    let output = `${script.title}\n`;
    output += `${script.formatSubtitle}\n\n`;
    output += `CAST OF CHARACTERS:\n`;
    script.characters.forEach((c) => {
      output += `- ${c.name} (${c.roleTag}): ${c.description} [${c.linesCount} lines, Props: ${c.propsList.join(', ')}]\n`;
    });
    output += `\n=========================================\n`;
    output += `${script.actScene} - ${script.timeStamp}\n`;
    output += `${script.sceneTitle}\n`;
    output += `${script.atmosphere}\n\n`;

    script.scriptFlow.forEach((item) => {
      if (item.type === 'cue' && item.cueData) {
        output += `[${item.cueData.cueType}: ${item.cueData.text}]\n\n`;
      } else if (item.type === 'dialogue' && item.dialogueData) {
        output += `${item.dialogueData.actor}  (${item.dialogueData.blocking})\n`;
        if (item.dialogueData.subtext) {
          output += `    ${item.dialogueData.subtext}\n`;
        }
        output += `    ${item.dialogueData.dialogue}\n\n`;
      }
    });

    return output;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlainTextScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generatePlainTextScript();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${script.title.toLowerCase().replace(/\s+/g, '-')}-stagecue.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#1f1f28] border border-[#34343e] rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc880] text-[22px]">
              download
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#e4e1ee]">
              Export Stage Script
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#d7c3ae] hover:text-[#e4e1ee] hover:bg-[#34343e]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-xs text-[#d7c3ae] font-['Space_Mono']">
          {script.title} · {script.formatSubtitle}
        </p>

        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl bg-[#292933] hover:bg-[#34343e] border border-[#34343e] text-[#e4e1ee] font-bold text-sm flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc880] text-[18px]">
                content_copy
              </span>
              <span>Copy Standard Stageplay Text</span>
            </div>
            {copied && (
              <span className="text-xs text-[#82deff] font-['Space_Mono']">Copied!</span>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-3 px-4 rounded-xl bg-[#f5a623] hover:bg-[#ffb955] text-[#452b00] font-bold text-sm flex items-center justify-between transition-colors cursor-pointer shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#452b00] text-[20px]">
                file_download
              </span>
              <span>Download (.txt / Stage Format)</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#34343e] flex items-center justify-center gap-1.5 text-[#9f8e7a]">
          <span className="material-symbols-outlined text-[14px]">theater_comedy</span>
          <span className="font-['Space_Mono'] text-[11px]">
            Compatible with Final Draft, Celtx & Samuel French standard
          </span>
        </div>
      </div>
    </div>
  );
};
