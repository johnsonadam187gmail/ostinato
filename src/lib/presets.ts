import { PatternPreset } from '../types';

function createRockGroove(): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  
  tracks['hihat'] = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
  tracks['snare'] = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
  tracks['kick'] = [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false];
  tracks['hihatPedal'] = new Array(16).fill(false);
  tracks['tom1'] = new Array(16).fill(false);
  tracks['tom2'] = new Array(16).fill(false);
  tracks['floorTom'] = new Array(16).fill(false);
  tracks['ride'] = new Array(16).fill(false);
  
  return tracks;
}

function createJazzSwing(): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  
  tracks['hihat'] = new Array(16).fill(false);
  tracks['snare'] = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
  tracks['kick'] = [true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true];
  tracks['hihatPedal'] = new Array(16).fill(false);
  tracks['tom1'] = new Array(16).fill(false);
  tracks['tom2'] = new Array(16).fill(false);
  tracks['floorTom'] = new Array(16).fill(false);
  tracks['ride'] = [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true];
  
  return tracks;
}

function createHalfTimeShuffle(): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  
  tracks['hihat'] = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
  tracks['snare'] = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
  tracks['kick'] = [false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false];
  tracks['hihatPedal'] = new Array(16).fill(false);
  tracks['tom1'] = new Array(16).fill(false);
  tracks['tom2'] = new Array(16).fill(false);
  tracks['floorTom'] = new Array(16).fill(false);
  tracks['ride'] = new Array(16).fill(false);
  
  return tracks;
}

function createFourOnFloor(): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  
  tracks['hihat'] = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
  tracks['snare'] = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
  tracks['kick'] = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
  tracks['hihatPedal'] = new Array(16).fill(false);
  tracks['tom1'] = new Array(16).fill(false);
  tracks['tom2'] = new Array(16).fill(false);
  tracks['floorTom'] = new Array(16).fill(false);
  tracks['ride'] = new Array(16).fill(false);
  
  return tracks;
}

function createPopPattern(): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  
  tracks['hihat'] = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
  tracks['snare'] = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
  tracks['kick'] = [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false];
  tracks['hihatPedal'] = new Array(16).fill(false);
  tracks['tom1'] = new Array(16).fill(false);
  tracks['tom2'] = new Array(16).fill(false);
  tracks['floorTom'] = new Array(16).fill(false);
  tracks['ride'] = new Array(16).fill(false);
  
  return tracks;
}

function createFunkPattern(): Record<string, boolean[]> {
  const tracks: Record<string, boolean[]> = {};
  
  tracks['hihat'] = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
  tracks['snare'] = [false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false];
  tracks['kick'] = [true, false, false, false, false, false, true, false, false, true, false, false, false, false, false, false];
  tracks['hihatPedal'] = new Array(16).fill(false);
  tracks['tom1'] = new Array(16).fill(false);
  tracks['tom2'] = new Array(16).fill(false);
  tracks['floorTom'] = new Array(16).fill(false);
  tracks['ride'] = new Array(16).fill(false);
  
  return tracks;
}

export const PRESETS: PatternPreset[] = [
  {
    id: 'basic-rock',
    name: 'Basic Rock',
    description: 'Classic rock groove with hi-hat on 8ths, snare on 2 and 4',
    tracks: createRockGroove(),
    limbAssignments: {
      hihat: 'RH',
      snare: 'LH',
      kick: 'RF',
      hihatPedal: 'LF',
      tom1: 'RH',
      tom2: 'LH',
      floorTom: 'LF',
      ride: 'RH',
    },
  },
  {
    id: 'jazz-swing',
    name: 'Jazz Swing',
    description: 'Swing feel with ride cymbal, jazz kick and snare pattern',
    tracks: createJazzSwing(),
    limbAssignments: {
      hihat: 'none',
      snare: 'LH',
      kick: 'RF',
      hihatPedal: 'LF',
      tom1: 'RH',
      tom2: 'LH',
      floorTom: 'LF',
      ride: 'RH',
    },
  },
  {
    id: 'half-time-shuffle',
    name: 'Half-Time Shuffle',
    description: 'Laid-back shuffle feel common in blues and ballads',
    tracks: createHalfTimeShuffle(),
    limbAssignments: {
      hihat: 'RH',
      snare: 'LH',
      kick: 'RF',
      hihatPedal: 'LF',
      tom1: 'RH',
      tom2: 'LH',
      floorTom: 'LF',
      ride: 'RH',
    },
  },
  {
    id: 'four-on-floor',
    name: 'Four on the Floor',
    description: 'Kick drum on every quarter note, disco/pop feel',
    tracks: createFourOnFloor(),
    limbAssignments: {
      hihat: 'RH',
      snare: 'LH',
      kick: 'RF',
      hihatPedal: 'LF',
      tom1: 'RH',
      tom2: 'LH',
      floorTom: 'LF',
      ride: 'RH',
    },
  },
  {
    id: 'pop',
    name: 'Pop Groove',
    description: 'Syncopated kick pattern with steady hi-hat',
    tracks: createPopPattern(),
    limbAssignments: {
      hihat: 'RH',
      snare: 'LH',
      kick: 'RF',
      hihatPedal: 'LF',
      tom1: 'RH',
      tom2: 'LH',
      floorTom: 'LF',
      ride: 'RH',
    },
  },
  {
    id: 'funk',
    name: 'Funk Groove',
    description: 'Syncopated snare ghost notes, driving kick',
    tracks: createFunkPattern(),
    limbAssignments: {
      hihat: 'RH',
      snare: 'LH',
      kick: 'RF',
      hihatPedal: 'LF',
      tom1: 'RH',
      tom2: 'LH',
      floorTom: 'LF',
      ride: 'RH',
    },
  },
];
