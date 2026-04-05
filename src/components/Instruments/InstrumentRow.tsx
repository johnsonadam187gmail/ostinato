import { useCallback, useState, useEffect } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { useLibraryStore } from '../../stores/useLibraryStore';
import { useChannelStore } from '../../stores/useChannelStore';
import { INSTRUMENTS } from '../../lib/instruments';
import { audioEngine } from '../../hooks/useAudioEngine';
import { EQModal } from '../EQModal';

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
    isPlaying,
    trackAssignments,
    assignOstinato,
    clearAssignment,
    limbAssignments,
  } = usePatternStore();
  
  const getOstinatosByInstrument = useLibraryStore((s) => s.getOstinatosByInstrument);
  const getOstinatoById = useLibraryStore((s) => s.getOstinatoById);
  const addOstinato = useLibraryStore((s) => s.addOstinato);
  
  const { setChannelVolume, setChannelEQ, getChannel } = useChannelStore();
  const channelSettings = getChannel(instrumentId);
  
  const [showOstinatoSelect, setShowOstinatoSelect] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEQModal, setShowEQModal] = useState(false);
  const [ostinatoName, setOstinatoName] = useState('');
  
  const track = tracks[instrumentId] || [];
  const isMuted = mutedTracks.has(instrumentId);
  const totalSteps = bars * subdivision;
  const subdivisionPerBeat = subdivision / 4;
  
  const assignedOstinatoId = trackAssignments[instrumentId];
  const assignedOstinato = assignedOstinatoId ? getOstinatoById(assignedOstinatoId) : null;
  const availableOstinatos = getOstinatosByInstrument(instrumentId);
  
  useEffect(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.setChannelVolume(instrumentId, channelSettings.volume / 100);
      audioEngine.setChannelEQ(instrumentId, channelSettings.eqLow, channelSettings.eqMid, channelSettings.eqHigh);
    }
  }, [channelSettings.volume, channelSettings.eqLow, channelSettings.eqMid, channelSettings.eqHigh, instrumentId]);

  const handleToggle = useCallback((step: number) => {
    toggleNote(instrumentId, step);
  }, [instrumentId, toggleNote]);
  
  const handleOstinatoSelect = useCallback((ostinatoId: string) => {
    assignOstinato(instrumentId, ostinatoId);
    setShowOstinatoSelect(false);
  }, [instrumentId, assignOstinato]);
  
  const handleClearAssignment = useCallback(() => {
    clearAssignment(instrumentId);
  }, [instrumentId, clearAssignment]);
  
  const handleSaveOstinato = useCallback(() => {
    if (!ostinatoName.trim() || !instrument) return;
    
    addOstinato({
      name: ostinatoName.trim(),
      steps: [...track],
      instrumentId: instrumentId,
      limb: limbAssignments[instrumentId] || instrument.defaultLimb,
    });
    
    setOstinatoName('');
    setShowSaveModal(false);
  }, [ostinatoName, track, instrumentId, instrument, limbAssignments, addOstinato]);

  const handleVolumeChange = useCallback((volume: number) => {
    setChannelVolume(instrumentId, volume);
    if (audioEngine.isInitialized()) {
      audioEngine.setChannelVolume(instrumentId, volume / 100);
    }
  }, [instrumentId, setChannelVolume]);

  const handleEQChange = useCallback((low: number, mid: number, high: number) => {
    setChannelEQ(instrumentId, low, mid, high);
    if (audioEngine.isInitialized()) {
      audioEngine.setChannelEQ(instrumentId, low, mid, high);
    }
  }, [instrumentId, setChannelEQ]);
  
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
      
      <div className="flex-1 flex items-center gap-1 relative">
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
        
        <button
          onClick={() => setShowSaveModal(true)}
          className="p-1 text-textMuted hover:text-primary"
          title="Save as ostinato"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>

        <div className="flex items-center gap-1 px-1">
          <input
            type="range"
            min="0"
            max="100"
            value={channelSettings.volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-16 h-1.5 rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${instrument.color} 0%, ${instrument.color} ${channelSettings.volume}%, #2d3748 ${channelSettings.volume}%, #2d3748 100%)`,
            }}
            title={`Volume: ${channelSettings.volume}%`}
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
        
        {showOstinatoSelect && (
          <div className="absolute z-10 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-40 top-full left-0">
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
        
        {showSaveModal && (
          <div className="absolute z-20 top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg p-3 w-64">
            <input
              type="text"
              value={ostinatoName}
              onChange={(e) => setOstinatoName(e.target.value)}
              placeholder="Ostinato name..."
              className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-text mb-2"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveOstinato()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveOstinato}
                disabled={!ostinatoName.trim()}
                className="flex-1 px-2 py-1 bg-primary text-white rounded text-xs disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-2 py-1 bg-surfaceLight text-text rounded text-xs"
              >
                Cancel
              </button>
            </div>
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

      {showEQModal && (
        <EQModal
          channelId={instrumentId}
          title={instrument.name}
          settings={channelSettings}
          onVolumeChange={handleVolumeChange}
          onEQChange={handleEQChange}
          onClose={() => setShowEQModal(false)}
        />
      )}
    </div>
  );
}