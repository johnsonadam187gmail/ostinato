import { useCallback, useState } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { useLibraryStore } from '../../stores/useLibraryStore';
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
    trackAssignments,
    assignOstinato,
    clearAssignment,
  } = usePatternStore();
  
  const getOstinatosByInstrument = useLibraryStore((s) => s.getOstinatosByInstrument);
  const getOstinatoById = useLibraryStore((s) => s.getOstinatoById);
  
  const [showOstinatoSelect, setShowOstinatoSelect] = useState(false);
  
  const track = tracks[instrumentId] || [];
  const isMuted = mutedTracks.has(instrumentId);
  const totalSteps = bars * subdivision;
  const subdivisionPerBeat = subdivision / 4;
  
  const assignedOstinatoId = trackAssignments[instrumentId];
  const assignedOstinato = assignedOstinatoId ? getOstinatoById(assignedOstinatoId) : null;
  const availableOstinatos = getOstinatosByInstrument(instrumentId);
  
  const handleToggle = useCallback((step: number) => {
    toggleNote(instrumentId, step);
  }, [instrumentId, toggleNote]);
  
  const handleLimbChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimbAssignment(instrumentId, e.target.value as Limb);
  }, [instrumentId, setLimbAssignment]);
  
  const handleOstinatoSelect = useCallback((ostinatoId: string) => {
    assignOstinato(instrumentId, ostinatoId);
    setShowOstinatoSelect(false);
  }, [instrumentId, assignOstinato]);
  
  const handleClearAssignment = useCallback(() => {
    clearAssignment(instrumentId);
  }, [instrumentId, clearAssignment]);
  
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
      
      <div className="hidden md:block relative">
        <select
          value={limbAssignments[instrumentId] || 'none'}
          onChange={handleLimbChange}
          className="w-24 flex-shrink-0 bg-surfaceLight rounded-lg px-2 py-1 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {Object.entries(LIMB_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 flex items-center gap-1">
        <button
          onClick={() => setShowOstinatoSelect(!showOstinatoSelect)}
          className={`px-2 py-1 rounded text-xs flex-shrink-0 transition-colors ${
            assignedOstinato 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'bg-surfaceLight text-textMuted hover:text-text'
          }`}
          title="Select ostinato from library"
        >
          {assignedOstinato ? assignedOstinato.name : 'Select'}
        </button>
        
        {assignedOstinato && (
          <button
            onClick={handleClearAssignment}
            className="p-1 text-textMuted hover:text-red-500"
            title="Clear assignment"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {showOstinatoSelect && (
          <div className="absolute z-10 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-40">
            {availableOstinatos.length === 0 ? (
              <div className="px-3 py-2 text-textMuted text-xs">
                No ostinatos for this instrument
              </div>
            ) : (
              availableOstinatos.map((ostinato) => (
                <button
                  key={ostinato.id}
                  onClick={() => handleOstinatoSelect(ostinato.id)}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-surfaceLight ${
                    assignedOstinatoId === ostinato.id ? 'bg-primary/20 text-primary' : 'text-text'
                  }`}
                >
                  {ostinato.name}
                  {ostinato.isDefault && <span className="text-textMuted ml-1">(default)</span>}
                </button>
              ))
            )}
          </div>
        )}
        
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
    </div>
  );
}