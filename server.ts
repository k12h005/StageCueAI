import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for script generation
  app.post('/api/generate-script', async (req, res) => {
    try {
      const { premise, castSize, duration, genre } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({ error: 'NO_API_KEY', fallback: true });
      }

      const ai = new GoogleGenAI();
      const prompt = `You are an expert theatrical playwright and script supervisor.
Create a complete, hilarious, and action-packed one-act stage script based on the following input:
Premise: "${premise}"
Cast Size: ${castSize} characters
Target Duration: ${duration}
Genre: ${genre}

Return ONLY a valid JSON object matching this exact schema:
{
  "id": "generated-script",
  "title": "A short, punchy, uppercase theatrical title like 'THE 10-MINUTE DEADLINE'",
  "draftBadge": "Draft #1 Generated",
  "isValidated": true,
  "formatSubtitle": "A One-Act Skit · ${castSize} Characters · ~${duration} · ${genre}",
  "actScene": "Act I · Scene 1",
  "timeStamp": "11:50 PM",
  "sceneTitle": "SCENE 1: (LOCATION NAME)",
  "atmosphere": "[AT RISE: Describe the opening stage visual, character positions, props, and ambient lighting in brackets.]",
  "castSize": ${castSize},
  "duration": "${duration}",
  "genre": "${genre}",
  "premise": "${premise}",
  "characters": [
    {
      "id": "char_id",
      "name": "CHARACTER NAME (UPPERCASE)",
      "roleTag": "Lead" or "Key" or "Comic",
      "description": "Short vivid character description",
      "linesCount": 14,
      "propsCount": 3,
      "propsList": ["prop1", "prop2"],
      "color": "#f5a623",
      "badgeBg": "bg-primary-container",
      "avatarLetter": "Initial",
      "stats": { "lines": 14, "actions": 4, "props": 3, "entries": 1 }
    }
  ],
  "scriptFlow": [
    {
      "id": "flow-1",
      "type": "cue",
      "cueData": {
        "cueType": "ENTRY" or "ACTION & PROP" or "ACTION",
        "text": "Detailed theatrical cue description",
        "icon": "login" or "front_hand" or "sports_martial_arts",
        "colorTheme": "tertiary" or "primary" or "secondary"
      }
    },
    {
      "id": "flow-2",
      "type": "dialogue",
      "dialogueData": {
        "actor": "CHARACTER NAME",
        "blocking": "DL [Door Left]" or "CS [Center Stage]" or "DSC [Downstage Center]",
        "subtext": "(acting delivery instructions)",
        "dialogue": "Spoken dialogue enclosed in quotation marks",
        "isActiveCue": false,
        "directorNotes": "Directorial advice"
      }
    }
  ],
  "performerCues": {
    "CHARACTER NAME": [
      {
        "id": "cue-1",
        "cueIndex": 1,
        "actor": "CHARACTER NAME",
        "incomingCue": {
          "speaker": "Other Actor",
          "dialogue": "Line spoken by other actor to listen for",
          "cueNumber": "#01",
          "timestamp": "00:03:12",
          "visualAction": "Physical trigger"
        },
        "activeLine": {
          "dialogue": "The line the actor speaks",
          "delivery": "(Physical direction)",
          "tag": "Speaking Lead"
        },
        "actionsAndProps": {
          "actionText": "Physical beat",
          "propText": "Prop name",
          "blockingText": "Stage position"
        },
        "nextHandoff": "Who speaks or reacts next",
        "isUrgent": false
      }
    ]
  }
}
Provide at least 8 to 12 vivid dialogue blocks and at least 3 performer cues per character. Ensure standard Samuel French style stage directions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const parsedData = JSON.parse(responseText);
      return res.json(parsedData);
    } catch (err: any) {
      console.error('Error generating script with Gemini:', err);
      return res.status(500).json({ error: 'Failed to generate script', fallback: true });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StageCue AI Server running on port ${PORT}`);
  });
}

startServer();
