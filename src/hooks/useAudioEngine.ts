import * as Tone from 'tone';
import { INSTRUMENTS } from '../lib/instruments';

class AudioEngine {
  private synths: Map<string, Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth> = new Map();
  private metronomeSynth: Tone.Synth | null = null;
  private metronomeAccentSynth: Tone.Synth | null = null;
  private masterGain: Tone.Gain | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await Tone.start();
    
    this.masterGain = new Tone.Gain(0.8).toDestination();
    
    this.metronomeSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).connect(this.masterGain);
    this.metronomeSynth.volume.value = -10;
    
    this.metronomeAccentSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
    }).connect(this.masterGain);
    this.metronomeAccentSynth.volume.value = -5;
    
    INSTRUMENTS.forEach((instrument) => {
      let synth: Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth;
      const destination = this.masterGain!;
      
      switch (instrument.synthType) {
        case 'membrane':
          synth = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: 'sine' },
            envelope: {
              attack: 0.001,
              decay: 0.3,
              sustain: 0,
              release: 0.1,
            },
          }).connect(destination);
          break;
        case 'noise':
          synth = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: {
              attack: 0.001,
              decay: 0.2,
              sustain: 0,
              release: 0.1,
            },
          }).connect(destination);
          break;
        case 'metal':
          synth = new Tone.MetalSynth({
            envelope: {
              attack: 0.001,
              decay: 0.1,
              release: 0.01,
            },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
          }).connect(destination);
          synth.frequency.value = 250;
          break;
      }
      
      this.synths.set(instrument.id, synth);
    });
    
    this.initialized = true;
  }

  playNote(instrumentId: string): void {
    if (!this.initialized) return;
    
    const synth = this.synths.get(instrumentId);
    if (!synth) return;
    
    const now = Tone.now();
    
    if (synth instanceof Tone.MembraneSynth) {
      synth.triggerAttackRelease('C1', '8n', now);
    } else if (synth instanceof Tone.NoiseSynth) {
      synth.triggerAttackRelease('16n', now);
    } else if (synth instanceof Tone.MetalSynth) {
      synth.triggerAttackRelease('C4', '32n', now);
    }
  }

  playMetronomeClick(isAccent: boolean = false): void {
    if (!this.initialized) return;
    
    const synth = isAccent ? this.metronomeAccentSynth : this.metronomeSynth;
    if (!synth) return;
    
    synth.triggerAttackRelease(isAccent ? 'C5' : 'C4', '32n');
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  dispose(): void {
    this.synths.forEach((synth) => synth.dispose());
    this.synths.clear();
    this.metronomeSynth?.dispose();
    this.metronomeAccentSynth?.dispose();
    this.masterGain?.dispose();
    this.initialized = false;
  }
}

export const audioEngine = new AudioEngine();
