import { Instrument, Limb } from '../types';

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'hihat',
    name: 'Hi-Hat',
    shortName: 'HH',
    defaultLimb: 'RH',
    synthType: 'noise',
    color: '#f59e0b',
  },
  {
    id: 'snare',
    name: 'Snare Drum',
    shortName: 'SN',
    defaultLimb: 'LH',
    synthType: 'noise',
    color: '#ef4444',
  },
  {
    id: 'kick',
    name: 'Kick Drum',
    shortName: 'K',
    defaultLimb: 'RF',
    synthType: 'membrane',
    color: '#8b5cf6',
  },
  {
    id: 'hihatPedal',
    name: 'Hi-Hat Pedal',
    shortName: 'HP',
    defaultLimb: 'LF',
    synthType: 'noise',
    color: '#f97316',
  },
  {
    id: 'tom1',
    name: 'Tom 1',
    shortName: 'T1',
    defaultLimb: 'RH',
    synthType: 'membrane',
    color: '#06b6d4',
  },
  {
    id: 'tom2',
    name: 'Tom 2',
    shortName: 'T2',
    defaultLimb: 'LH',
    synthType: 'membrane',
    color: '#14b8a6',
  },
  {
    id: 'floorTom',
    name: 'Floor Tom',
    shortName: 'FT',
    defaultLimb: 'LF',
    synthType: 'membrane',
    color: '#22c55e',
  },
  {
    id: 'ride',
    name: 'Ride Cymbal',
    shortName: 'RD',
    defaultLimb: 'RH',
    synthType: 'metal',
    color: '#3b82f6',
  },
];

export const LIMB_LABELS: Record<string, string> = {
  RH: 'Right Hand',
  LH: 'Left Hand',
  RF: 'Right Foot',
  LF: 'Left Foot',
  none: 'None',
};

export function createEmptyPattern(bars: number, subdivision: 16 | 32): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  const steps = bars * subdivision;
  
  INSTRUMENTS.forEach((instrument) => {
    tracks[instrument.id] = new Array(steps).fill(false);
  });
  
  return tracks;
}

export function createDefaultLimbAssignments(): Record<string, Limb> {
  const assignments: Record<string, Limb> = {};
  INSTRUMENTS.forEach((instrument) => {
    assignments[instrument.id] = instrument.defaultLimb;
  });
  return assignments;
}
