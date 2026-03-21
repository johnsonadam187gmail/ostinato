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

export interface Pattern {
  id: string;
  name: string;
  bars: number;
  subdivision: 16 | 32;
  tracks: Record<string, boolean[]>;
}

export interface LimbAssignment {
  [instrumentId: string]: Limb;
}

export interface MetronomeSettings {
  bpm: number;
  accentFirst: boolean;
  volume: number;
}

export interface PatternPreset {
  id: string;
  name: string;
  description: string;
  tracks: Record<string, boolean[]>;
  limbAssignments: LimbAssignment;
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
