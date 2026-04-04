import * as Tone from 'tone';
import { INSTRUMENTS } from '../lib/instruments';

const SAMPLE_BASE_URL = 'https://raw.githubusercontent.com/Tonejs/audio/master/drum-samples/acoustic-kit';

const SAMPLE_URLS: Record<string, Record<string, string>> = {
  kick: { C3: `${SAMPLE_BASE_URL}/kick.mp3` },
  snare: { C3: `${SAMPLE_BASE_URL}/snare.mp3` },
  hihat: { C3: `${SAMPLE_BASE_URL}/hihat.mp3` },
  hihatPedal: { C3: `${SAMPLE_BASE_URL}/hihat.mp3` },
  tom1: { C3: `${SAMPLE_BASE_URL}/tom1.mp3` },
  tom2: { C3: `${SAMPLE_BASE_URL}/tom2.mp3` },
  floorTom: { C3: `${SAMPLE_BASE_URL}/tom3.mp3` },
  ride: { C3: `${SAMPLE_BASE_URL}/tom2.mp3` },
};

class AudioEngine {
  private samplers: Map<string, Tone.Sampler> = new Map();
  private synths: Map<string, Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth> = new Map();
  private metronomeSynth: Tone.Synth | null = null;
  private metronomeAccentSynth: Tone.Synth | null = null;
  private masterGain: Tone.Gain | null = null;
  private initialized = false;
  private loadedCount = 0;
  private totalSamples = 0;

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

    const sampleInstruments = INSTRUMENTS.filter(i => SAMPLE_URLS[i.id]);
    const synthInstruments = INSTRUMENTS.filter(i => !SAMPLE_URLS[i.id]);
    
    this.totalSamples = sampleInstruments.length;

    sampleInstruments.forEach((instrument) => {
      const urls = SAMPLE_URLS[instrument.id];
      
      const sampler = new Tone.Sampler({
        urls,
        onload: () => {
          this.loadedCount++;
          console.log(`Loaded ${instrument.name} (${this.loadedCount}/${this.totalSamples})`);
        },
      }).connect(this.masterGain!);
      
      this.samplers.set(instrument.id, sampler);
    });

    synthInstruments.forEach((instrument) => {
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
        default:
          return;
      }
      
      this.synths.set(instrument.id, synth);
    });

    const waitForSamples = () => new Promise<void>((resolve) => {
      const checkLoaded = () => {
        if (this.loadedCount >= this.totalSamples || this.totalSamples === 0) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });

    await waitForSamples();
    
    this.initialized = true;
    console.log('Audio engine initialized with samples');
  }

  playNote(instrumentId: string): void {
    if (!this.initialized) return;
    
    const sampler = this.samplers.get(instrumentId);
    const synth = this.synths.get(instrumentId);
    
    const now = Tone.now();
    
    if (sampler) {
      sampler.triggerAttackRelease('C3', '8n', now);
    } else if (synth) {
      if (synth instanceof Tone.MembraneSynth) {
        synth.triggerAttackRelease('C1', '8n', now);
      } else if (synth instanceof Tone.NoiseSynth) {
        synth.triggerAttackRelease('16n', now);
      } else if (synth instanceof Tone.MetalSynth) {
        synth.triggerAttackRelease('C4', '32n', now);
      }
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
    this.samplers.forEach((sampler) => sampler.dispose());
    this.samplers.clear();
    this.synths.forEach((synth) => synth.dispose());
    this.synths.clear();
    this.metronomeSynth?.dispose();
    this.metronomeAccentSynth?.dispose();
    this.masterGain?.dispose();
    this.initialized = false;
  }
}

export const audioEngine = new AudioEngine();