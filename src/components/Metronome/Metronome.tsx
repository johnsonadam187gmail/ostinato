import { useCallback, useState, useEffect } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { useChannelStore } from '../../stores/useChannelStore';
import { audioEngine } from '../../hooks/useAudioEngine';
import { EQModal } from '../EQModal';

export function Metronome() {
  const { bpm, setBpm } = usePatternStore();
  const { currentStep, subdivision, bars } = usePatternStore();
  const { isPlaying } = usePatternStore();
  
  const { setMetronomeVolume, setMetronomeEQ, metronome } = useChannelStore();
  const [showEQModal, setShowEQModal] = useState(false);
  
  const subdivisionPerBeat = subdivision / 4;
  const totalBeats = bars * 4;
  
  useEffect(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.setMetronomeVolume(metronome.volume / 100);
      audioEngine.setMetronomeEQ(metronome.eqLow, metronome.eqMid, metronome.eqHigh);
    }
  }, [metronome.volume, metronome.eqLow, metronome.eqMid, metronome.eqHigh]);
  
  const handleBpmChange = useCallback((delta: number) => {
    setBpm(bpm + delta);
  }, [bpm, setBpm]);
  
  const handleBpmInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBpm(value);
    }
  }, [setBpm]);
  
  const handleVolumeChange = useCallback((volume: number) => {
    setMetronomeVolume(volume);
    if (audioEngine.isInitialized()) {
      audioEngine.setMetronomeVolume(volume / 100);
    }
  }, [setMetronomeVolume]);
  
  const handleEQChange = useCallback((low: number, mid: number, high: number) => {
    setMetronomeEQ(low, mid, high);
    if (audioEngine.isInitialized()) {
      audioEngine.setMetronomeEQ(low, mid, high);
    }
  }, [setMetronomeEQ]);
  
  const getBeatClass = (beatIndex: number) => {
    if (!isPlaying) return 'bg-accent';
    
    if (currentStep < 0) return 'bg-accent';
    
    const currentBeatGlobal = Math.floor(currentStep / subdivisionPerBeat);
    
    if (beatIndex === currentBeatGlobal) {
      return beatIndex === 0 ? 'bg-primary animate-pulse' : 'bg-primary';
    }
    
    return 'bg-accent';
  };
  
  return (
    <div className="bg-surface rounded-xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <span className="text-textMuted text-sm font-medium">BPM</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBpmChange(-5)}
              className="w-8 h-8 rounded-lg bg-surfaceLight hover:bg-accent text-text font-bold transition-colors"
            >
              -5
            </button>
            <input
              type="number"
              value={bpm}
              onChange={handleBpmInput}
              min={40}
              max={240}
              className="w-16 h-10 bg-surfaceLight rounded-lg text-center text-2xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => handleBpmChange(5)}
              className="w-8 h-8 rounded-lg bg-surfaceLight hover:bg-accent text-text font-bold transition-colors"
            >
              +5
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBpmChange(-1)}
            className="w-8 h-8 rounded-lg bg-surfaceLight hover:bg-accent text-text transition-colors"
          >
            -
          </button>
          <button
            onClick={() => handleBpmChange(1)}
            className="w-8 h-8 rounded-lg bg-surfaceLight hover:bg-accent text-text transition-colors"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M6 8l8 4-8 4V8z" />
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={metronome.volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-20 h-1.5 rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${metronome.volume}%, #2d3748 ${metronome.volume}%, #2d3748 100%)`,
            }}
            title={`Metronome Volume: ${metronome.volume}%`}
          />
          <button
            onClick={() => setShowEQModal(true)}
            className="p-1 text-textMuted hover:text-primary"
            title="EQ Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          {Array.from({ length: totalBeats }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${getBeatClass(i)}`}
            />
          ))}
        </div>
      </div>

      {showEQModal && (
        <EQModal
          channelId="metronome"
          title="Metronome"
          settings={metronome}
          onVolumeChange={handleVolumeChange}
          onEQChange={handleEQChange}
          onClose={() => setShowEQModal(false)}
        />
      )}
    </div>
  );
}