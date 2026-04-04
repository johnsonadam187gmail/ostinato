# Ostinato - Drum Independence Trainer

A web-based PWA for drummers to practice limb independence by creating, saving, and combining reusable ostinato patterns into beats.

## Concept

### Hierarchy

- **Ostinato**: A simple sequence of note on/off states across a time period. Can be assigned to any drum. Reusable and combinable.
- **Beat**: Multiple stacked ostinatos running simultaneously across a cyclic time period. Can be named and saved.

Users create ostinatos, then combine them into beats to form complete drum patterns.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Audio Engine**: Tone.js 15
- **State Management**: Zustand 5
- **Styling**: Tailwind CSS 3
- **PWA**: Vite Plugin PWA + Workbox

## Project Structure

```
src/
├── components/
│   ├── PianoRoll/           # Grid-based step sequencer
│   ├── Instruments/         # Instrument rows with ostinato selection
│   ├── Controls/            # Transport, Beat controls
│   ├── Metronome/           # Metronome toggle
│   ├── Library/             # Ostinato & Beat library browser
│   └── OstinatoEditor/      # Modal for editing/creating ostinatos
├── stores/
│   ├── usePatternStore.ts   # Current beat state (tracks, assignments, etc.)
│   └── useLibraryStore.ts   # Library state (saved ostinatos & beats)
├── lib/
│   ├── instruments.ts       # Instrument definitions
│   ├── defaultOstinatos.ts # Pre-populated default ostinato patterns
│   └── presets.ts           # Built-in beat presets using default ostinatos
├── hooks/
│   ├── useAudioEngine.ts    # Tone.js audio context management
│   └── usePlayback.ts       # Playback control & scheduling
├── types/
│   └── index.ts             # TypeScript interfaces (Ostinato, Beat, etc.)
├── App.tsx                  # Main application
└── main.tsx                 # Entry point
```

## Data Model

### Types (src/types/index.ts)

```typescript
interface Ostinato {
  id: string;
  name: string;
  steps: boolean[];       // Pattern data (on/off per step)
  instrumentId: string;  // Which drum this was created for
  limb: Limb;             // Which body part plays it
  createdAt: number;
  isDefault: boolean;     // True for shipped defaults
}

interface Beat {
  id: string;
  name: string;
  bars: number;
  subdivision: 16 | 32;
  trackAssignments: Record<string, string>; // instrumentId -> ostinatoId
}
```

### Library Store (src/stores/useLibraryStore.ts)

Persisted Zustand store managing:
- All saved ostinatos (including 30+ defaults)
- All saved beats
- Import/export functionality

### Beat Store (src/stores/usePatternStore.ts)

Active beat state:
- Current track patterns (steps)
- Track assignments (which ostinato is assigned to each instrument)
- BPM, bars, subdivision
- Limb assignments

## Default Library

The app ships with 30+ pre-populated ostinatos organized by instrument:

- **Hi-Hat**: 8th Notes, Quarter Notes, Offbeat, Shuffle, Disco, Crash Accents, Ghost Notes
- **Snare**: Backbeat, Double Rocks, Ghost Notes, Woodblock, Fill Starter
- **Kick**: Four on Floor, Basic Rock, Double Kick, Latin Kick, Disco Kick, Kick Pulse
- **Pedal Hi-Hat**: Quarter Foot, Alternating
- **Toms**: Basic patterns, Fill patterns

Each built-in preset (Basic Rock, Jazz Swing, etc.) references these default ostinatos.

## Features

1. **Ostinato Selection**: Each instrument row has a dropdown to select an ostinato from the library
2. **Beat Building**: Assign different ostinatos to different drums to create unique beats
3. **Save Beats**: Save the current combination to the library
4. **Export/Import**: Export/import individual ostinatos or full beats as JSON files
5. **Preset Loading**: Load built-in presets that combine default ostinatos
6. **Manual Editing**: Toggle notes directly on the piano roll; changes don't auto-save

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## PWA Features

- Installable as standalone app
- Service worker for offline functionality
- Cached assets for fast loading