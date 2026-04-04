import { useCallback } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { INSTRUMENTS } from '../../lib/instruments';
import { InstrumentRow } from '../Instruments';

export function PianoRoll() {
  const { subdivision, bars, isPlaying, currentStep } = usePatternStore();
  
  const subdivisionPerBeat = subdivision / 4;
  const totalSteps = bars * subdivision;
  const beats = bars * 4;
  
  const renderBeatMarkers = useCallback(() => {
    const markers = [];
    
    for (let bar = 0; bar < bars; bar++) {
      for (let beat = 0; beat < 4; beat++) {
        const step = bar * subdivisionPerBeat * 4 + beat * subdivisionPerBeat;
        const isFirstBeat = beat === 0;
        const isCurrentBeat = isPlaying && 
          Math.floor(currentStep / subdivisionPerBeat) === (bar * 4 + beat);
        
        markers.push(
          <div
            key={`marker-${bar}-${beat}`}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(step / totalSteps) * 100}%`,
              backgroundColor: isFirstBeat ? '#4a5568' : '#2d3748',
            }}
          />
        );
        
        if (isCurrentBeat) {
          markers.push(
            <div
              key={`playhead-beat-${bar}-${beat}`}
              className="absolute top-0 bottom-0 bg-primary/20"
              style={{
                left: `${(step / totalSteps) * 100}%`,
                width: `${(subdivisionPerBeat / totalSteps) * 100}%`,
              }}
            />
          );
        }
      }
    }
    
    return markers;
  }, [bars, subdivisionPerBeat, totalSteps, isPlaying, currentStep]);
  
  return (
    <div className="bg-surface rounded-xl p-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-24 md:w-32 flex-shrink-0 px-2">
            <span className="text-xs text-textMuted font-medium">Instrument</span>
          </div>
          <div className="flex-1 relative">
            <div className="flex justify-between text-xs text-textMuted px-1 mb-1">
              {Array.from({ length: beats }).map((_, i) => (
                <span key={i} className="w-5 text-center">{i + 1}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative">
          {renderBeatMarkers()}
          
          {INSTRUMENTS.map((instrument) => (
            <div key={instrument.id} className="relative">
            <InstrumentRow 
              instrumentId={instrument.id} 
            />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}