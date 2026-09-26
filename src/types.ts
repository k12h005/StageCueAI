export interface Character {
  id: string;
  name: string;
  roleTag: 'Lead' | 'Key' | 'Comic' | 'Support';
  description: string;
  linesCount: number;
  propsCount: number;
  propsList: string[];
  color: string;
  badgeBg: string;
  avatarLetter: string;
  stats: {
    lines: number;
    actions: number;
    props: number;
    entries: number;
  };
}

export type CueType = 'ENTRY' | 'ACTION & PROP' | 'ACTION' | 'AUDIO FX';

export interface ScriptItem {
  id: string;
  type: 'cue' | 'dialogue';
  cueData?: {
    cueType: CueType;
    text: string;
    icon: string;
    colorTheme: 'tertiary' | 'primary' | 'secondary';
  };
  dialogueData?: {
    actor: string;
    blocking: string;
    subtext?: string;
    dialogue: string;
    isActiveCue?: boolean;
    directorNotes?: string;
    stageVector?: string;
    actionBadge?: string;
    propBadge?: string;
    blockingBadge?: string;
    handoffTo?: string;
  };
}

export interface PerformerCue {
  id: string;
  cueIndex: number;
  actor: string;
  incomingCue: {
    speaker: string;
    dialogue: string;
    cueNumber: string;
    timestamp: string;
    visualAction?: string;
  };
  activeLine: {
    dialogue: string;
    delivery: string;
    tag: string;
  };
  actionsAndProps: {
    actionText?: string;
    propText?: string;
    blockingText?: string;
    vectorText?: string;
  };
  nextHandoff: string;
  isUrgent?: boolean;
  isMastered?: boolean;
  audioFxNote?: string;
}

export interface ScriptData {
  id: string;
  title: string;
  draftBadge: string;
  isValidated: boolean;
  formatSubtitle: string;
  actScene: string;
  timeStamp: string;
  sceneTitle: string;
  atmosphere: string;
  castSize: number;
  duration: string;
  genre: string;
  premise: string;
  characters: Character[];
  scriptFlow: ScriptItem[];
  performerCues: Record<string, PerformerCue[]>;
}
