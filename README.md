# Ostinato - Drum Independence Trainer

A web-based Progressive Web Application (PWA) for drummers to practice limb independence by creating, saving, and combining reusable ostinato patterns into beats.

## Concept

### Hierarchy

- **Ostinato**: A simple sequence of note on/off states across a time period. Can be assigned to any drum. Reusable and combinable.
- **Beat**: Multiple stacked ostinatos running simultaneously across a cyclic time period. Can be named and saved.

## Features

- **Ostinato Library**: Pre-populated with 30+ default patterns (hi-hat, snare, kick patterns)
- **Beat Builder**: Assign different ostinatos to different drums to create unique beats
- **Save Ostinatos**: Click the save icon on any instrument row to save that track as a new ostinato
- **Save Beats**: Save the current combination of ostinatos as a beat
- **Export/Import**: Share ostinatos and beats as JSON files
- **Presets**: Built-in presets (Basic Rock, Jazz Swing, etc.) that reference default ostinatos

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Tone.js 15 (audio engine)
- Zustand 5 (state management)
- Tailwind CSS 3
- Vite Plugin PWA + Workbox

## Development Workflow

### Branch Naming
Create a new branch for each feature:
```bash
git checkout -b feature/feature-name
```

### Standard Process for Accepted Improvements
After testing/improving functionality:

1. **Stage all changes**
   ```bash
   git add -A
   ```

2. **Commit with descriptive message**
   ```bash
   git commit -m "feat: description of changes"
   ```

3. **Push to remote**
   ```bash
   git push -u origin feature/feature-name
   ```

### Commit Message Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `chore:` - Maintenance tasks

## Project Structure

```
src/
├── components/
│   ├── PianoRoll/           # Grid-based step sequencer
│   ├── Instruments/         # Instrument rows with ostinato selection
│   ├── Controls/            # Transport, Beat controls
│   ├── Metronome/           # Metronome toggle
│   └── Library/             # Ostinato & Beat library browser
├── stores/
│   ├── usePatternStore.ts   # Current beat state
│   └── useLibraryStore.ts   # Library state (ostinatos & beats)
├── lib/
│   ├── instruments.ts       # Instrument definitions
│   ├── defaultOstinatos.ts # Pre-populated default patterns
│   └── presets.ts           # Built-in beat presets
├── hooks/
│   ├── useAudioEngine.ts    # Tone.js audio context
│   └── usePlayback.ts       # Playback control
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.tsx                  # Main application
└── main.tsx                 # Entry point
```