import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INSTRUMENTS, createEmptyPattern, createDefaultLimbAssignments } from '../lib/instruments';
import { PRESETS } from '../lib/presets';
import { Limb, ExportedPattern } from '../types';

interface PatternStore {
  bpm: number;
  setBpm: (bpm: number) => void;
  
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  bars: number;
  setBars: (bars: number) => void;
  
  subdivision: 16 | 32;
  setSubdivision: (sub: 16 | 32) => void;
  
  tracks: Record<string, boolean[]>;
  toggleNote: (instrumentId: string, step: number) => void;
  setTrack: (instrumentId: string, steps: boolean[]) => void;
  
  limbAssignments: Record<string, Limb>;
  setLimbAssignment: (instrumentId: string, limb: Limb) => void;
  
  mutedTracks: Set<string>;
  toggleMute: (instrumentId: string) => void;
  
  patternName: string;
  setPatternName: (name: string) => void;
  
  patternId: string;
  setPatternId: (id: string) => void;
  
  loadPreset: (presetId: string) => void;
  resetPattern: () => void;
  
  exportPattern: () => ExportedPattern;
  importPattern: (data: ExportedPattern) => void;
  
  getTotalSteps: () => number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const usePatternStore = create<PatternStore>()(
  persist(
    (set, get) => ({
      bpm: 100,
      setBpm: (bpm) => set({ bpm: Math.max(40, Math.min(240, bpm)) }),
      
      isPlaying: false,
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      
      bars: 1,
      setBars: (bars) => {
        const newBars = Math.max(1, Math.min(8, bars));
        const currentSubdivision = get().subdivision;
        const newSteps = newBars * currentSubdivision;
        
        const newTracks: Record<string, boolean[]> = {};
        INSTRUMENTS.forEach((inst) => {
          const currentTrack = get().tracks[inst.id] || [];
          if (currentTrack.length < newSteps) {
            newTracks[inst.id] = [...currentTrack, ...new Array(newSteps - currentTrack.length).fill(false)];
          } else {
            newTracks[inst.id] = currentTrack.slice(0, newSteps);
          }
        });
        
        set({ bars: newBars, tracks: newTracks });
      },
      
      subdivision: 16,
      setSubdivision: (subdivision) => {
        const currentBars = get().bars;
        const newSteps = currentBars * subdivision;
        
        const newTracks: Record<string, boolean[]> = {};
        INSTRUMENTS.forEach((inst) => {
          const currentTrack = get().tracks[inst.id] || [];
          if (currentTrack.length < newSteps) {
            newTracks[inst.id] = [...currentTrack, ...new Array(newSteps - currentTrack.length).fill(false)];
          } else {
            newTracks[inst.id] = currentTrack.slice(0, newSteps);
          }
        });
        
        set({ subdivision, tracks: newTracks });
      },
      
      tracks: createEmptyPattern(1, 16),
      toggleNote: (instrumentId, step) => {
        const tracks = { ...get().tracks };
        const track = [...tracks[instrumentId]];
        track[step] = !track[step];
        tracks[instrumentId] = track;
        set({ tracks });
      },
      setTrack: (instrumentId, steps) => {
        const tracks = { ...get().tracks };
        tracks[instrumentId] = steps;
        set({ tracks });
      },
      
      limbAssignments: createDefaultLimbAssignments(),
      setLimbAssignment: (instrumentId, limb) => {
        const assignments = { ...get().limbAssignments };
        assignments[instrumentId] = limb;
        set({ limbAssignments: assignments });
      },
      
      mutedTracks: new Set<string>(),
      toggleMute: (instrumentId) => {
        const muted = new Set(get().mutedTracks);
        if (muted.has(instrumentId)) {
          muted.delete(instrumentId);
        } else {
          muted.add(instrumentId);
        }
        set({ mutedTracks: muted });
      },
      
      patternName: 'New Pattern',
      setPatternName: (name) => set({ patternName: name }),
      
      patternId: generateId(),
      setPatternId: (id) => set({ patternId: id }),
      
      loadPreset: (presetId) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (preset) {
          set({
            tracks: { ...preset.tracks },
            limbAssignments: { ...preset.limbAssignments },
            patternName: preset.name,
            patternId: generateId(),
          });
        }
      },
      
      resetPattern: () => {
        const bars = get().bars;
        const subdivision = get().subdivision;
        set({
          tracks: createEmptyPattern(bars, subdivision),
          limbAssignments: createDefaultLimbAssignments(),
          patternName: 'New Pattern',
          patternId: generateId(),
          mutedTracks: new Set(),
        });
      },
      
      exportPattern: () => {
        const state = get();
        return {
          version: '1.0',
          name: state.patternName,
          bars: state.bars,
          subdivision: state.subdivision,
          tracks: state.tracks,
          limbAssignments: state.limbAssignments,
        };
      },
      
      importPattern: (data: ExportedPattern) => {
        const totalSteps = data.bars * data.subdivision;
        const tracks: Record<string, boolean[]> = {};
        
        INSTRUMENTS.forEach((inst) => {
          if (data.tracks[inst.id]) {
            const imported = data.tracks[inst.id];
            if (imported.length < totalSteps) {
              tracks[inst.id] = [...imported, ...new Array(totalSteps - imported.length).fill(false)];
            } else {
              tracks[inst.id] = imported.slice(0, totalSteps);
            }
          } else {
            tracks[inst.id] = new Array(totalSteps).fill(false);
          }
        });
        
        set({
          tracks,
          limbAssignments: data.limbAssignments,
          patternName: data.name,
          patternId: generateId(),
          bars: data.bars,
          subdivision: data.subdivision,
        });
      },
      
      getTotalSteps: () => {
        const state = get();
        return state.bars * state.subdivision;
      },
    }),
    {
      name: 'ostinato-storage',
      partialize: (state) => ({
        bpm: state.bpm,
        bars: state.bars,
        subdivision: state.subdivision,
        tracks: state.tracks,
        limbAssignments: state.limbAssignments,
        mutedTracks: Array.from(state.mutedTracks),
        patternName: state.patternName,
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<PatternStore> & { mutedTracks?: string[] };
        return {
          ...current,
          ...p,
          mutedTracks: new Set(p.mutedTracks || []),
        };
      },
    }
  )
);
