import { useCallback } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { INSTRUMENTS, LIMB_LABELS } from '../../lib/instruments';
import { Limb } from '../../types';

interface InstrumentRowProps {
  instrumentId: string;
}

export function InstrumentRow({ instrumentId }: InstrumentRowProps) {
  const instrument = INSTRUMENTS.find((i) => i.id === instrumentId);
  const {
    tracks,
    toggleNote,
    currentStep,
    subdivision,
    bars,
    mutedTracks,
    toggleMute,
    limbAssignments,
    setLimbAssignment,
    isPlaying,
  } = usePatternStore();
  
  const track = tracks[instrumentId] || [];
  const isMuted = mutedTracks.has(instrumentId);
  const totalSteps = bars * subdivision;
  const subdivisionPerBeat = subdivision / 4;
  
  const handleToggle = useCallback((step: number) => {
    toggleNote(instrumentId, step);
  }, [instrumentId, toggleNote]);
  
  const handleLimbChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimbAssignment(instrumentId, e.target.value as Limb);
  }, [instrumentId, setLimbAssignment]);
  
  if (!instrument) return null;
  
  return (
    <div className={`flex items-center gap-2 ${isMuted ? 'opacity-50' : ''}`}>
      <div
        className="w-24 md:w-32 flex-shrink-0 flex items-center gap-2 px-2 py-1 rounded-lg"
        style={{ backgroundColor: `${instrument.color}20` }}
      >
        <button
          onClick={() => toggleMute(instrumentId)}
          className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
            isMuted ? 'bg-accent text-textMuted' : 'bg-surfaceLight text-text'
          }`}
        >
          M
        </button>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold truncate" style={{ color: instrument.color }}>
            {instrument.shortName}
          </span>
          <span className="text-[10px] text-textMuted truncate hidden md:block">
            {instrument.name}
          </span>
        </div>
      </div>
      
      <select
        value={limbAssignments[instrumentId] || 'none'}
        onChange={handleLimbChange}
        className="hidden md:block w-24 flex-shrink-0 bg-surfaceLight rounded-lg px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {Object.entries(LIMB_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-px min-w-max">
          {Array.from({ length: totalSteps }).map((_, step) => {
            const isBeat = step % subdivisionPerBeat === 0;
            const isCurrent = isPlaying && step === currentStep;
            
            return (
              <button
                key={step}
                onClick={() => handleToggle(step)}
                className={`
                  w-4 h-8 md:w-5 md:h-10 rounded-sm transition-all
                  ${track[step] 
                    ? 'shadow-md' 
                    : isBeat 
                      ? 'bg-surfaceLight' 
                      : 'bg-accent'
                  }
                  ${isCurrent 
                    ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' 
                    : ''
                  }
                  hover:brightness-125 active:scale-95
                `}
                style={{
                  backgroundColor: track[step] ? instrument.color : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
