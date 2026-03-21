import { useCallback, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { audioEngine } from './useAudioEngine';
import { usePatternStore } from '../stores/usePatternStore';
import { INSTRUMENTS } from '../lib/instruments';

export function usePlayback() {
  const {
    bpm,
    isPlaying,
    setIsPlaying,
    tracks,
    mutedTracks,
    subdivision,
    bars,
    setCurrentStep,
  } = usePatternStore();
  
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const isInitializedRef = useRef(false);
  
  const initializeAudio = useCallback(async () => {
    if (isInitializedRef.current) return true;
    
    try {
      await audioEngine.initialize();
      isInitializedRef.current = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }, []);
  
  useEffect(() => {
    audioEngine.setBpm(bpm);
  }, [bpm]);
  
  const buildSequence = useCallback(() => {
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    
    const totalSteps = bars * subdivision;
    const subdivisionPerBeat = subdivision / 4;
    
    const sequence = new Tone.Sequence(
      (time, step) => {
        const isFirstBeat = step % subdivisionPerBeat === 0;
        
        audioEngine.playMetronomeClick(isFirstBeat);
        
        INSTRUMENTS.forEach((instrument) => {
          if (mutedTracks.has(instrument.id)) return;
          
          const track = tracks[instrument.id];
          if (track && track[step]) {
            audioEngine.playNote(instrument.id);
          }
        });
        
        Tone.getDraw().schedule(() => {
          setCurrentStep(step);
        }, time);
      },
      Array.from({ length: totalSteps }, (_, i) => i),
      '16n'
    );
    
    sequenceRef.current = sequence;
    return sequence;
  }, [tracks, mutedTracks, subdivision, bars, setCurrentStep]);
  
  useEffect(() => {
    if (!isPlaying) {
      if (sequenceRef.current) {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      }
      setCurrentStep(-1);
      return;
    }
    
    const sequence = buildSequence();
    sequence.start(0);
    Tone.getTransport().start();
    
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop();
      }
      Tone.getTransport().stop();
    };
  }, [isPlaying, buildSequence, setCurrentStep]);
  
  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
      Tone.getTransport().stop();
    };
  }, []);
  
  const start = useCallback(async () => {
    const initialized = await initializeAudio();
    if (initialized) {
      setIsPlaying(true);
    }
  }, [initializeAudio, setIsPlaying]);
  
  const stop = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);
  
  const toggle = useCallback(async () => {
    if (isPlaying) {
      stop();
    } else {
      await start();
    }
  }, [isPlaying, start, stop]);
  
  return {
    start,
    stop,
    toggle,
    initializeAudio,
    isInitialized: isInitializedRef.current,
  };
}
