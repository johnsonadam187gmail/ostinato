export type Limb = 'RH' | 'LH' | 'RF' | 'LF' | 'none';

export type SynthType = 'membrane' | 'noise' | 'metal';

export interface Instrument {
  id: string;
  name: string;
  shortName: string;
  defaultLimb: Limb;
  synthType: SynthType;
  color: string;
}

export interface Ostinato {
  id: string;
  name: string;
  steps: boolean[];
  instrumentId: string;
  limb: Limb;
  createdAt: number;
  isDefault: boolean;
}

export interface Beat {
  id: string;
  name: string;
  bars: number;
  subdivision: 16 | 32;
  trackAssignments: Record<string, string>;
}

export interface LimbAssignment {
  [instrumentId: string]: Limb;
}

export interface MetronomeSettings {
  bpm: number;
  accentFirst: boolean;
  volume: number;
}

export interface BeatPreset {
  id: string;
  name: string;
  description: string;
  trackAssignments: Record<string, string>;
  limbAssignments: LimbAssignment;
}

export interface MetronomeSettings {
  bpm: number;
  accentFirst: boolean;
  volume: number;
}

export interface AppState {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  bars: number;
  subdivision: 16 | 32;
  tracks: Record<string, boolean[]>;
  limbAssignments: LimbAssignment;
  mutedTracks: Set<string>;
  beatName: string;
  beatId: string;
  trackAssignments: Record<string, string>;
}

export interface ExportedBeat {
  version: string;
  name: string;
  bars: number;
  subdivision: 16 | 32;
  trackAssignments: Record<string, string>;
  limbAssignments: LimbAssignment;
  tracks: Record<string, boolean[]>;
}

export interface ExportedOstinato {
  version: string;
  name: string;
  instrumentId: string;
  limb: Limb;
  steps: boolean[];
}

export interface ExportedLibrary {
  version: string;
  exportedAt: number;
  ostinatos: ExportedOstinato[];
  beats: ExportedBeat[];
}

export interface AppState {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  bars: number;
  subdivision: 16 | 32;
  tracks: Record<string, boolean[]>;
  limbAssignments: LimbAssignment;
  mutedTracks: Set<string>;
  patternName: string;
  patternId: string;
}

export interface ExportedPattern {
  version: string;
  name: string;
  bars: number;
  subdivision: 16 | 32;
  tracks: Record<string, boolean[]>;
  limbAssignments: LimbAssignment;
}
