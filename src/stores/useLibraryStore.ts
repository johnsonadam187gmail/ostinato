import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ostinato, Beat } from '../types';
import { DEFAULT_OSTINATOS } from '../lib/defaultOstinatos';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

interface LibraryState {
  ostinatos: Ostinato[];
  beats: Beat[];
  addOstinato: (ostinato: Omit<Ostinato, 'id' | 'createdAt' | 'isDefault'>) => Ostinato;
  updateOstinato: (id: string, updates: Partial<Ostinato>) => void;
  deleteOstinato: (id: string) => boolean;
  getOstinatoById: (id: string) => Ostinato | undefined;
  getOstinatosByInstrument: (instrumentId: string) => Ostinato[];
  addBeat: (beat: Omit<Beat, 'id'>) => Beat;
  updateBeat: (id: string, updates: Partial<Beat>) => void;
  deleteBeat: (id: string) => boolean;
  getBeatById: (id: string) => Beat | undefined;
  importOstinato: (ostinato: Ostinato) => void;
  importBeat: (beat: Beat) => void;
  clearUserLibrary: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      ostinatos: [...DEFAULT_OSTINATOS],
      beats: [],

      addOstinato: (ostinatoData) => {
        const newOstinato: Ostinato = {
          ...ostinatoData,
          id: generateId(),
          createdAt: Date.now(),
          isDefault: false,
        };
        set((state) => ({
          ostinatos: [...state.ostinatos, newOstinato],
        }));
        return newOstinato;
      },

      updateOstinato: (id, updates) => {
        set((state) => ({
          ostinatos: state.ostinatos.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        }));
      },

      deleteOstinato: (id) => {
        const ostinato = get().ostinatos.find((o) => o.id === id);
        if (ostinato?.isDefault) return false;
        set((state) => ({
          ostinatos: state.ostinatos.filter((o) => o.id !== id),
          beats: state.beats.map((b) => ({
            ...b,
            trackAssignments: Object.fromEntries(
              Object.entries(b.trackAssignments).filter(([, v]) => v !== id)
            ),
          })),
        }));
        return true;
      },

      getOstinatoById: (id) => {
        return get().ostinatos.find((o) => o.id === id);
      },

      getOstinatosByInstrument: (instrumentId) => {
        return get().ostinatos.filter((o) => o.instrumentId === instrumentId);
      },

      addBeat: (beatData) => {
        const newBeat: Beat = {
          ...beatData,
          id: generateId(),
        };
        set((state) => ({
          beats: [...state.beats, newBeat],
        }));
        return newBeat;
      },

      updateBeat: (id, updates) => {
        set((state) => ({
          beats: state.beats.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteBeat: (id) => {
        set((state) => ({
          beats: state.beats.filter((b) => b.id !== id),
        }));
        return true;
      },

      getBeatById: (id) => {
        return get().beats.find((b) => b.id === id);
      },

      importOstinato: (ostinato) => {
        const newOstinato: Ostinato = {
          ...ostinato,
          id: generateId(),
          createdAt: Date.now(),
          isDefault: false,
        };
        set((state) => ({
          ostinatos: [...state.ostinatos, newOstinato],
        }));
      },

      importBeat: (beat) => {
        const newBeat: Beat = {
          ...beat,
          id: generateId(),
        };
        set((state) => ({
          beats: [...state.beats, newBeat],
        }));
      },

      clearUserLibrary: () => {
        set({
          ostinatos: [...DEFAULT_OSTINATOS],
          beats: [],
        });
      },
    }),
    {
      name: 'ostinato-library',
    }
  )
);