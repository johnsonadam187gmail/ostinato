import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INSTRUMENTS } from '../lib/instruments';

export interface ChannelSettings {
  volume: number;
  eqLow: number;
  eqMid: number;
  eqHigh: number;
}

const DEFAULT_CHANNEL: ChannelSettings = {
  volume: 80,
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
};

const createDefaultChannels = (): Record<string, ChannelSettings> => {
  const channels: Record<string, ChannelSettings> = {};
  INSTRUMENTS.forEach((inst) => {
    channels[inst.id] = { ...DEFAULT_CHANNEL };
  });
  return channels;
};

interface ChannelStore {
  channels: Record<string, ChannelSettings>;
  metronome: ChannelSettings;
  setChannelVolume: (instrumentId: string, volume: number) => void;
  setChannelEQ: (instrumentId: string, low: number, mid: number, high: number) => void;
  setMetronomeVolume: (volume: number) => void;
  setMetronomeEQ: (low: number, mid: number, high: number) => void;
  getChannel: (instrumentId: string) => ChannelSettings;
  resetChannel: (instrumentId: string) => void;
  resetAll: () => void;
}

export const useChannelStore = create<ChannelStore>()(
  persist(
    (set, get) => ({
      channels: createDefaultChannels(),
      metronome: { ...DEFAULT_CHANNEL },

      setChannelVolume: (instrumentId, volume) => {
        set((state) => ({
          channels: {
            ...state.channels,
            [instrumentId]: {
              ...state.channels[instrumentId],
              volume,
            },
          },
        }));
      },

      setChannelEQ: (instrumentId, low, mid, high) => {
        set((state) => ({
          channels: {
            ...state.channels,
            [instrumentId]: {
              ...state.channels[instrumentId],
              eqLow: low,
              eqMid: mid,
              eqHigh: high,
            },
          },
        }));
      },

      setMetronomeVolume: (volume) => {
        set((state) => ({
          metronome: {
            ...state.metronome,
            volume,
          },
        }));
      },

      setMetronomeEQ: (low, mid, high) => {
        set((state) => ({
          metronome: {
            ...state.metronome,
            eqLow: low,
            eqMid: mid,
            eqHigh: high,
          },
        }));
      },

      getChannel: (instrumentId) => {
        return get().channels[instrumentId] || { ...DEFAULT_CHANNEL };
      },

      resetChannel: (instrumentId) => {
        set((state) => ({
          channels: {
            ...state.channels,
            [instrumentId]: { ...DEFAULT_CHANNEL },
          },
        }));
      },

      resetAll: () => {
        set({
          channels: createDefaultChannels(),
          metronome: { ...DEFAULT_CHANNEL },
        });
      },
    }),
    {
      name: 'ostinato-channel-settings',
    }
  )
);