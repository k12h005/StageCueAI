import { ScriptData, Character, ScriptItem, PerformerCue } from '../types';
import { defaultScript } from '../data/defaultScript';

export async function generateScript(params: {
  premise: string;
  castSize: number;
  duration: string;
  genre: string;
}): Promise<ScriptData> {
  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.title && data.characters && data.scriptFlow) {
        return data as ScriptData;
      }
    }
  } catch (error) {
    console.warn('Backend generation API not reachable, falling back to local synthesizer:', error);
  }

  // Local fallback synthesizer if API is offline or returns an error
  return synthesizeScriptLocally(params);
}

export function synthesizeScriptLocally(params: {
  premise: string;
  castSize: number;
  duration: string;
  genre: string;
}): ScriptData {
  const { premise, castSize, duration, genre } = params;

  // If the user entered the default premise, return the authentic script from the mockups
  if (premise.toLowerCase().includes('10 minutes') || premise.toLowerCase().includes('due in 10')) {
    return {
      ...defaultScript,
      castSize,
      duration,
      genre,
      premise,
    };
  }

  // Synthesize dynamic characters based on premise keywords
  const titleWords = premise
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 4)
    .map((w) => w.toUpperCase());
  const scriptTitle = titleWords.length > 0 ? titleWords.join(' ') : 'THE UNEXPECTED RUSH';

  const namesPool = [
    { name: 'ALEX', role: 'Lead' as const, trait: 'The perfectionist pacing against the clock.', color: '#f5a623' },
    { name: 'JORDAN', role: 'Key' as const, trait: 'The caffeinated tactician seeking a solution.', color: '#ffb3b1' },
    { name: 'SAM', role: 'Comic' as const, trait: 'The oblivious friend bringing chaotic cheer.', color: '#82deff' },
    { name: 'MORGAN', role: 'Support' as const, trait: 'The observant neutral voice in the storm.', color: '#ffddb4' },
    { name: 'TAYLOR', role: 'Support' as const, trait: 'The deadline enforcer waiting in the wings.', color: '#b7eaff' },
  ];

  const selectedNames = namesPool.slice(0, Math.min(castSize, namesPool.length));

  const characters: Character[] = selectedNames.map((c, i) => ({
    id: c.name.toLowerCase(),
    name: c.name,
    roleTag: c.role,
    description: c.trait,
    linesCount: 10 + i * 2,
    propsCount: 2,
    propsList: ['Clipboard', 'Stopwatch', 'Folder'],
    color: c.color,
    badgeBg: i === 0 ? 'bg-primary-container' : i === 1 ? 'bg-secondary-container' : 'bg-tertiary-container',
    avatarLetter: c.name[0],
    stats: {
      lines: 10 + i * 2,
      actions: 3 + i,
      props: 2,
      entries: 1,
    },
  }));

  const mainChar = characters[0].name;
  const secondChar = characters[1]?.name || 'JORDAN';
  const thirdChar = characters[2]?.name || 'SAM';

  const scriptFlow: ScriptItem[] = [
    {
      id: 'f-1',
      type: 'cue',
      cueData: {
        cueType: 'ENTRY',
        text: `ENTRY: ${thirdChar} enters Door Left carrying an unexpected prop`,
        icon: 'login',
        colorTheme: 'tertiary',
      },
    },
    {
      id: 'f-2',
      type: 'dialogue',
      dialogueData: {
        actor: thirdChar,
        blocking: 'DL [Door Left]',
        subtext: '(Breezing in casually)',
        dialogue: `“Hey team, did anyone check the status board? I think we might have an issue.”`,
        stageVector: 'Door Left',
        directorNotes: 'Deliver with serene detachment from the chaos.',
      },
    },
    {
      id: 'f-3',
      type: 'cue',
      cueData: {
        cueType: 'ACTION & PROP',
        text: `ACTION & PROP: ${mainChar} turns sharply with emergency clipboard`,
        icon: 'front_hand',
        colorTheme: 'primary',
      },
    },
    {
      id: 'f-4',
      type: 'dialogue',
      dialogueData: {
        actor: mainChar,
        blocking: 'CS [Center Stage]',
        subtext: '(Voice crackling with tension)',
        dialogue: `“An issue? ${premise.slice(0, 60)}! We have exactly seconds left!”`,
        isActiveCue: true,
        actionBadge: `ACTION: Wave clipboard toward ${secondChar}`,
        propBadge: 'PROP: Production Clipboard',
        blockingBadge: 'Center Stage [CS]',
        handoffTo: `${secondChar}: "Hold on, look at the screen..."`,
      },
    },
    {
      id: 'f-5',
      type: 'dialogue',
      dialogueData: {
        actor: secondChar,
        blocking: 'DSC [Downstage Center]',
        subtext: '(Staring wide-eyed at controls)',
        dialogue: `“Guys... look at the indicator. The whole system just froze!”`,
        actionBadge: 'ACTION: Frantically tap screen with both hands',
        blockingBadge: 'Downstage Center [DSC]',
        handoffTo: `${thirdChar}: "What do you mean frozen?!"`,
      },
    },
    {
      id: 'f-6',
      type: 'dialogue',
      dialogueData: {
        actor: thirdChar,
        blocking: 'DL → CS',
        subtext: '(Dropping the casual act)',
        dialogue: `“What do you mean frozen?! We cannot afford to miss this!”`,
      },
    },
    {
      id: 'f-7',
      type: 'dialogue',
      dialogueData: {
        actor: mainChar,
        blocking: 'CS',
        subtext: '(Slams hand on table with commanding presence)',
        dialogue: `“Then stop lamenting and start troubleshooting! Everyone on position now!”`,
        actionBadge: 'ACTION: Slam flat palm down on study desk',
        blockingBadge: 'Center Stage [CS]',
      },
    },
    {
      id: 'f-8',
      type: 'cue',
      cueData: {
        cueType: 'ACTION',
        text: `ACTION: ${thirdChar} dives toward ${secondChar} as sirens flicker in the background`,
        icon: 'sports_martial_arts',
        colorTheme: 'secondary',
      },
    },
    {
      id: 'f-9',
      type: 'dialogue',
      dialogueData: {
        actor: secondChar,
        blocking: 'DSC',
        subtext: '(Typing with breakneck speed)',
        dialogue: `“Override protocol initiated! Three, two, one... executed!”`,
      },
    },
    {
      id: 'f-10',
      type: 'dialogue',
      dialogueData: {
        actor: mainChar,
        blocking: 'CS → DSC',
        subtext: '(Exhaling deeply as green lights glow)',
        dialogue: `“Confirm locked in. Scene saved. We made it by half a breath!”`,
      },
    },
  ];

  const performerCues: Record<string, PerformerCue[]> = {};

  characters.forEach((char) => {
    performerCues[char.name] = [
      {
        id: `${char.name.toLowerCase()}-cue-1`,
        cueIndex: 1,
        actor: char.name,
        incomingCue: {
          speaker: secondChar,
          dialogue: `“...We have seconds left on the clock!”`,
          cueNumber: '#01',
          timestamp: '00:02:15',
          visualAction: 'Timer flashes amber on stage wall.',
        },
        activeLine: {
          delivery: '(Eyes focused, posture rigid)',
          dialogue: `“Stay calm! We stick to the drill and execute without hesitation!”`,
          tag: 'Commanding',
        },
        actionsAndProps: {
          actionText: `Lunge forward to Center Stage, establish visual dominance.`,
          propText: 'Timer Stopwatch',
          blockingText: 'Center Stage [CS]',
          vectorText: 'EXPEDITE FLOW',
        },
        nextHandoff: `${secondChar} triggers stage beacon.`,
      },
      {
        id: `${char.name.toLowerCase()}-cue-2`,
        cueIndex: 2,
        actor: char.name,
        incomingCue: {
          speaker: thirdChar,
          dialogue: `“The portal is locking!”`,
          cueNumber: '#02',
          timestamp: '00:04:30',
          visualAction: 'Stage lights shift to warning amber.',
        },
        activeLine: {
          delivery: '(Explosive authority)',
          dialogue: `“Then stop talking and start typing!”`,
          tag: 'High Intensity',
        },
        actionsAndProps: {
          actionText: 'Slam right palm on center desk, lean forward into space.',
          blockingText: 'Target: Downstage Center [DSC]',
          vectorText: 'SPUR MOMENTUM',
        },
        nextHandoff: 'Lights flicker as code transmits.',
        isUrgent: true,
      },
    ];
  });

  return {
    id: `script-${Date.now()}`,
    title: scriptTitle,
    draftBadge: 'Draft #1 Generated',
    isValidated: true,
    formatSubtitle: `A One-Act Skit · ${castSize} Characters · ~${duration} · ${genre}`,
    actScene: 'Act I · Scene 1',
    timeStamp: '11:50 PM',
    sceneTitle: `SCENE 1: ${scriptTitle}`,
    atmosphere: `[AT RISE: The stage is charged with electric urgency. ${mainChar} paces with focused determination, while ${secondChar} and ${thirdChar} scramble through equipment. The room hums with high stakes.]`,
    castSize,
    duration,
    genre,
    premise,
    characters,
    scriptFlow,
    performerCues,
  };
}
