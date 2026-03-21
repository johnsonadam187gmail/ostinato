import { useCallback } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';

export function Metronome() {
  const { bpm, setBpm } = usePatternStore();
  const { currentStep, subdivision, bars } = usePatternStore();
  const { isPlaying } = usePatternStore();
  
  const subdivisionPerBeat = subdivision / 4;
  const totalBeats = bars * 4;
  
  const handleBpmChange = useCallback((delta: number) => {
    setBpm(bpm + delta);
  }, [bpm, setBpm]);
  
  const handleBpmInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBpm(value);
    }
  }, [setBpm]);
  
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
        
        <div className="flex items-center gap-2 ml-auto">
          {Array.from({ length: totalBeats }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${getBeatClass(i)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
