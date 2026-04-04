import { Ostinato } from '../types';

function createRepeatingSteps(pattern: number[], totalSteps: number = 32): boolean[] {
  const steps: boolean[] = [];
  for (let i = 0; i < totalSteps; i++) {
    steps.push(pattern[i % pattern.length] === 1);
  }
  return steps;
}

export const DEFAULT_OSTINATOS: Ostinato[] = [
  // Hi-Hat Patterns
  {
    id: 'hh-8ths',
    name: '8th Notes',
    steps: createRepeatingSteps([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hh-quarters',
    name: 'Quarter Notes',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hh-offbeat',
    name: 'Offbeat Hats',
    steps: createRepeatingSteps([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hh-shuffle',
    name: 'Shuffle',
    steps: createRepeatingSteps([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hh-disco',
    name: 'Disco',
    steps: createRepeatingSteps([1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hh-crash- accents',
    name: 'Crash Accents',
    steps: createRepeatingSteps([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hh-ghost',
    name: 'Ghost Notes',
    steps: createRepeatingSteps([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
    instrumentId: 'hihat',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },

  // Snare Patterns
  {
    id: 'snare-backbeat',
    name: 'Backbeat',
    steps: createRepeatingSteps([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'snare',
    limb: 'LH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'snare-rocks',
    name: 'Double Rocks',
    steps: createRepeatingSteps([0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0]),
    instrumentId: 'snare',
    limb: 'LH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'snare-ghost',
    name: 'Ghost Notes',
    steps: createRepeatingSteps([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
    instrumentId: 'snare',
    limb: 'LH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'snare-woodblock',
    name: 'Woodblock',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'snare',
    limb: 'LH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'snare-fill-starter',
    name: 'Fill Starter',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]),
    instrumentId: 'snare',
    limb: 'LH',
    createdAt: 0,
    isDefault: true,
  },

  // Kick Patterns
  {
    id: 'kick-4-on-floor',
    name: 'Four on Floor',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'kick',
    limb: 'RF',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'kick-basic-rock',
    name: 'Basic Rock',
    steps: createRepeatingSteps([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]),
    instrumentId: 'kick',
    limb: 'RF',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'kick-double',
    name: 'Double Kick',
    steps: createRepeatingSteps([1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]),
    instrumentId: 'kick',
    limb: 'RF',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'kick-latin',
    name: 'Latin Kick',
    steps: createRepeatingSteps([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'kick',
    limb: 'RF',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'kick-disco',
    name: 'Disco Kick',
    steps: createRepeatingSteps([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'kick',
    limb: 'RF',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'kick-pulse',
    name: 'Kick Pulse',
    steps: createRepeatingSteps([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]),
    instrumentId: 'kick',
    limb: 'RF',
    createdAt: 0,
    isDefault: true,
  },

  // Hi-Hat Pedal Patterns
  {
    id: 'hhp-quarters',
    name: 'Quarter Foot',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'hihatPedal',
    limb: 'LF',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'hhp-alternating',
    name: 'Alternating',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'hihatPedal',
    limb: 'LF',
    createdAt: 0,
    isDefault: true,
  },

  // Tom 1 Patterns
  {
    id: 'tom1-basic',
    name: 'Basic Tom',
    steps: createRepeatingSteps([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]),
    instrumentId: 'tom1',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'tom1-fill',
    name: 'Fill Pattern',
    steps: createRepeatingSteps([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
    instrumentId: 'tom1',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },

  // Tom 2 Patterns
  {
    id: 'tom2-basic',
    name: 'Basic Tom',
    steps: createRepeatingSteps([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'tom2',
    limb: 'LH',
    createdAt: 0,
    isDefault: true,
  },

  // Floor Tom Patterns
  {
    id: 'floor-tom-basic',
    name: 'Basic Floor',
    steps: createRepeatingSteps([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]),
    instrumentId: 'floorTom',
    limb: 'LF',
    createdAt: 0,
    isDefault: true,
  },

  // Ride Patterns
  {
    id: 'ride-8ths',
    name: '8th Notes',
    steps: createRepeatingSteps([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
    instrumentId: 'ride',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
  {
    id: 'ride-bell',
    name: 'Bell Pattern',
    steps: createRepeatingSteps([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    instrumentId: 'ride',
    limb: 'RH',
    createdAt: 0,
    isDefault: true,
  },
];

export function getDefaultOstinatoById(id: string): Ostinato | undefined {
  return DEFAULT_OSTINATOS.find(o => o.id === id);
}

export function getOstinatosByInstrument(instrumentId: string): Ostinato[] {
  return DEFAULT_OSTINATOS.filter(o => o.instrumentId === instrumentId);
}