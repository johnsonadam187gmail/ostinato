import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INSTRUMENTS, createEmptyPattern, createDefaultLimbAssignments } from '../lib/instruments';
import { PRESETS } from '../lib/presets';
import { Limb, Beat, ExportedBeat, ExportedOstinato } from '../types';
import { useLibraryStore } from './useLibraryStore';

interface BeatStore {
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
  
  beatName: string;
  setBeatName: (name: string) => void;
  
  beatId: string;
  setBeatId: (id: string) => void;
  
  trackAssignments: Record<string, string>;
  assignOstinato: (instrumentId: string, ostinatoId: string) => void;
  clearAssignment: (instrumentId: string) => void;
  
  loadPreset: (presetId: string) => void;
  resetBeat: () => void;
  
  exportBeat: () => ExportedBeat;
  importBeat: (data: ExportedBeat) => void;
  exportOstinato: (instrumentId: string) => ExportedOstinato | null;
  importOstinato: (data: ExportedOstinato) => void;
  
  saveBeat: () => void;
  loadBeatFromLibrary: (beatId: string) => void;
  loadBeat: (beat: Beat) => void;
  
  getTrackSteps: (instrumentId: string) => boolean[];
  
  getTotalSteps: () => number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useBeatStore = create<BeatStore>()(
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
      
      beatName: 'New Beat',
      setBeatName: (name) => set({ beatName: name }),
      
      beatId: generateId(),
      setBeatId: (id) => set({ beatId: id }),
      
      trackAssignments: {},
      assignOstinato: (instrumentId, ostinatoId) => {
        const assignments = { ...get().trackAssignments };
        assignments[instrumentId] = ostinatoId;
        
        const ostinato = useLibraryStore.getState().getOstinatoById(ostinatoId);
        if (ostinato) {
          const totalSteps = get().getTotalSteps();
          const paddedSteps = [...ostinato.steps];
          while (paddedSteps.length < totalSteps) {
            paddedSteps.push(...ostinato.steps);
          }
          const tracks = { ...get().tracks };
          tracks[instrumentId] = paddedSteps.slice(0, totalSteps);
          set({ trackAssignments: assignments, tracks });
        } else {
          set({ trackAssignments: assignments });
        }
      },
      clearAssignment: (instrumentId) => {
        const assignments = { ...get().trackAssignments };
        delete assignments[instrumentId];
        set({ trackAssignments: assignments });
      },
      
      loadPreset: (presetId) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (preset) {
          const newAssignments: Record<string, string> = {};
          const tracks = createEmptyPattern(get().bars, get().subdivision);
          const totalSteps = get().getTotalSteps();
          
          Object.entries(preset.trackAssignments).forEach(([instrumentId, ostinatoId]) => {
            newAssignments[instrumentId] = ostinatoId;
            const ostinato = useLibraryStore.getState().getOstinatoById(ostinatoId);
            if (ostinato) {
              let paddedSteps = [...ostinato.steps];
              while (paddedSteps.length < totalSteps) {
                paddedSteps.push(...ostinato.steps);
              }
              tracks[instrumentId] = paddedSteps.slice(0, totalSteps);
            }
          });
          
          set({
            trackAssignments: newAssignments,
            tracks,
            limbAssignments: { ...preset.limbAssignments },
            beatName: preset.name,
            beatId: generateId(),
          });
        }
      },
      
      resetBeat: () => {
        const bars = get().bars;
        const subdivision = get().subdivision;
        set({
          tracks: createEmptyPattern(bars, subdivision),
          limbAssignments: createDefaultLimbAssignments(),
          beatName: 'New Beat',
          beatId: generateId(),
          mutedTracks: new Set(),
          trackAssignments: {},
        });
      },
      
      exportBeat: () => {
        const state = get();
        return {
          version: '1.0',
          name: state.beatName,
          bars: state.bars,
          subdivision: state.subdivision,
          trackAssignments: state.trackAssignments,
          limbAssignments: state.limbAssignments,
          tracks: state.tracks,
        };
      },
      
      importBeat: (data: ExportedBeat) => {
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
          trackAssignments: data.trackAssignments || {},
          limbAssignments: data.limbAssignments,
          beatName: data.name,
          beatId: generateId(),
          bars: data.bars,
          subdivision: data.subdivision,
        });
      },
      
      exportOstinato: (instrumentId) => {
        const state = get();
        const instrument = INSTRUMENTS.find(i => i.id === instrumentId);
        if (!instrument) return null;
        
        return {
          version: '1.0',
          name: `${state.beatName} - ${instrument.name}`,
          instrumentId: instrumentId,
          limb: state.limbAssignments[instrumentId] || instrument.defaultLimb,
          steps: state.tracks[instrumentId] || [],
        };
      },
      
      importOstinato: (data: ExportedOstinato) => {
        useLibraryStore.getState().addOstinato({
          name: data.name,
          instrumentId: data.instrumentId,
          limb: data.limb,
          steps: data.steps,
        });
      },
      
      saveBeat: () => {
        const state = get();
        useLibraryStore.getState().addBeat({
          name: state.beatName,
          bars: state.bars,
          subdivision: state.subdivision,
          trackAssignments: state.trackAssignments,
        });
      },
      
      loadBeatFromLibrary: (beatId) => {
        const beat = useLibraryStore.getState().getBeatById(beatId);
        if (beat) {
          get().loadBeat(beat);
        }
      },
      
      loadBeat: (beat) => {
        const totalSteps = beat.bars * beat.subdivision;
        const tracks = createEmptyPattern(beat.bars, beat.subdivision);
        const newAssignments: Record<string, string> = {};
        
        Object.entries(beat.trackAssignments).forEach(([instrumentId, ostinatoId]) => {
          newAssignments[instrumentId] = ostinatoId;
          const ostinato = useLibraryStore.getState().getOstinatoById(ostinatoId);
          if (ostinato) {
            let paddedSteps = [...ostinato.steps];
            while (paddedSteps.length < totalSteps) {
              paddedSteps.push(...ostinato.steps);
            }
            tracks[instrumentId] = paddedSteps.slice(0, totalSteps);
          }
        });
        
        set({
          beatId: beat.id,
          beatName: beat.name,
          bars: beat.bars,
          subdivision: beat.subdivision,
          trackAssignments: newAssignments,
          tracks,
        });
      },
      
      getTrackSteps: (instrumentId) => {
        const state = get();
        return state.tracks[instrumentId] || [];
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
        beatName: state.beatName,
        trackAssignments: state.trackAssignments,
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<BeatStore> & { mutedTracks?: string[] };
        return {
          ...current,
          ...p,
          mutedTracks: new Set(p.mutedTracks || []),
        };
      },
    }
  )
);

export const usePatternStore = useBeatStore;