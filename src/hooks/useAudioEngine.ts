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

interface ChannelSettings {
  volume: number;
  eqLow: number;
  eqMid: number;
  eqHigh: number;
}

const DEFAULT_CHANNEL_SETTINGS: ChannelSettings = {
  volume: 0.8,
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
};

class AudioEngine {
  private samplers: Map<string, Tone.Sampler> = new Map();
  private synths: Map<string, Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth> = new Map();
  private channelEQs: Map<string, Tone.EQ3> = new Map();
  private channelGains: Map<string, Tone.Gain> = new Map();
  private metronomeSynth: Tone.Synth | null = null;
  private metronomeAccentSynth: Tone.Synth | null = null;
  private metronomeGain: Tone.Gain | null = null;
  private metronomeEQ: Tone.EQ3 | null = null;
  private masterGain: Tone.Gain | null = null;
  private initialized = false;
  private loadedCount = 0;
  private totalSamples = 0;
  private channelSettings: Map<string, ChannelSettings> = new Map();
  private metronomeSettings: ChannelSettings = { ...DEFAULT_CHANNEL_SETTINGS };

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await Tone.start();
    
    this.masterGain = new Tone.Gain(0.8).toDestination();
    
    this.metronomeGain = new Tone.Gain(0.8).toDestination();
    this.metronomeEQ = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: 0,
    }).connect(this.metronomeGain);
    
    this.metronomeSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).connect(this.metronomeEQ);
    this.metronomeSynth.volume.value = -10;
    
    this.metronomeAccentSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
    }).connect(this.metronomeEQ);
    this.metronomeAccentSynth.volume.value = -5;

    const sampleInstruments = INSTRUMENTS.filter(i => SAMPLE_URLS[i.id]);
    const synthInstruments = INSTRUMENTS.filter(i => !SAMPLE_URLS[i.id]);
    
    this.totalSamples = sampleInstruments.length;

    sampleInstruments.forEach((instrument) => {
      const urls = SAMPLE_URLS[instrument.id];
      
      const eq = new Tone.EQ3({
        low: 0,
        mid: 0,
        high: 0,
      }).connect(this.masterGain!);
      this.channelEQs.set(instrument.id, eq);
      
      const gain = new Tone.Gain(0.8).connect(eq);
      this.channelGains.set(instrument.id, gain);
      this.channelSettings.set(instrument.id, { ...DEFAULT_CHANNEL_SETTINGS });
      
      const sampler = new Tone.Sampler({
        urls,
        onload: () => {
          this.loadedCount++;
          console.log(`Loaded ${instrument.name} (${this.loadedCount}/${this.totalSamples})`);
        },
      }).connect(gain);
      
      this.samplers.set(instrument.id, sampler);
    });

    synthInstruments.forEach((instrument) => {
      let synth: Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth;
      
      const eq = new Tone.EQ3({
        low: 0,
        mid: 0,
        high: 0,
      }).connect(this.masterGain!);
      this.channelEQs.set(instrument.id, eq);
      
      const gain = new Tone.Gain(0.8).connect(eq);
      this.channelGains.set(instrument.id, gain);
      this.channelSettings.set(instrument.id, { ...DEFAULT_CHANNEL_SETTINGS });
      
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
          }).connect(gain);
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
          }).connect(gain);
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
          }).connect(gain);
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

  setChannelVolume(instrumentId: string, volume: number): void {
    const gain = this.channelGains.get(instrumentId);
    if (gain) {
      gain.gain.value = volume;
      const settings = this.channelSettings.get(instrumentId);
      if (settings) {
        settings.volume = volume;
      }
    }
  }

  setChannelEQ(instrumentId: string, low: number, mid: number, high: number): void {
    const eq = this.channelEQs.get(instrumentId);
    if (eq) {
      eq.low.value = low;
      eq.mid.value = mid;
      eq.high.value = high;
      const settings = this.channelSettings.get(instrumentId);
      if (settings) {
        settings.eqLow = low;
        settings.eqMid = mid;
        settings.eqHigh = high;
      }
    }
  }

  getChannelSettings(instrumentId: string): ChannelSettings {
    return this.channelSettings.get(instrumentId) || { ...DEFAULT_CHANNEL_SETTINGS };
  }

  setMetronomeVolume(volume: number): void {
    if (this.metronomeGain) {
      this.metronomeGain.gain.value = volume;
      this.metronomeSettings.volume = volume;
    }
  }

  setMetronomeEQ(low: number, mid: number, high: number): void {
    if (this.metronomeEQ) {
      this.metronomeEQ.low.value = low;
      this.metronomeEQ.mid.value = mid;
      this.metronomeEQ.high.value = high;
      this.metronomeSettings.eqLow = low;
      this.metronomeSettings.eqMid = mid;
      this.metronomeSettings.eqHigh = high;
    }
  }

  getMetronomeSettings(): ChannelSettings {
    return { ...this.metronomeSettings };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  dispose(): void {
    this.samplers.forEach((sampler) => sampler.dispose());
    this.samplers.clear();
    this.synths.forEach((synth) => synth.dispose());
    this.synths.clear();
    this.channelEQs.forEach((eq) => eq.dispose());
    this.channelEQs.clear();
    this.channelGains.forEach((gain) => gain.dispose());
    this.channelGains.clear();
    this.metronomeSynth?.dispose();
    this.metronomeAccentSynth?.dispose();
    this.metronomeGain?.dispose();
    this.metronomeEQ?.dispose();
    this.masterGain?.dispose();
    this.initialized = false;
  }
}

export const audioEngine = new AudioEngine();