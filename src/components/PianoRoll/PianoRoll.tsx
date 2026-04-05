import { useCallback, useMemo, useState, useEffect } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { useLibraryStore } from '../../stores/useLibraryStore';
import { useChannelStore } from '../../stores/useChannelStore';
import { INSTRUMENTS } from '../../lib/instruments';
import { audioEngine } from '../../hooks/useAudioEngine';
import { EQModal } from '../EQModal';

export function PianoRoll() {
  const { subdivision, bars, isPlaying, currentStep, tracks, toggleNote, mutedTracks, toggleMute, trackAssignments, assignOstinato, clearAssignment, limbAssignments } = usePatternStore();
  const getOstinatosByInstrument = useLibraryStore((s) => s.getOstinatosByInstrument);
  const getOstinatoById = useLibraryStore((s) => s.getOstinatoById);
  const addOstinato = useLibraryStore((s) => s.addOstinato);
  const { setChannelVolume, setChannelEQ, getChannel } = useChannelStore();
  
  const subdivisionPerBeat = subdivision / 4;
  const totalSteps = bars * subdivision;
  const beats = bars * 4;
  
  const controlsWidth = useMemo(() => {
    let maxWidth = 240;
    INSTRUMENTS.forEach((inst) => {
      const assignedId = trackAssignments[inst.id];
      if (assignedId) {
        const ost = getOstinatoById(assignedId);
        if (ost) {
          const btnWidth = ost.name.length * 8 + 160;
          if (btnWidth > maxWidth) maxWidth = btnWidth;
        }
      }
    });
    return maxWidth;
  }, [trackAssignments, getOstinatoById]);
  
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
          <div className="flex-1 relative h-4 overflow-visible">
            {Array.from({ length: beats }).map((_, i) => {
              const stepPosition = i * subdivisionPerBeat * 4;
              const barPosition = (stepPosition + 1) / totalSteps * 100;
              return (
                <span 
                  key={i} 
                  className="absolute text-xs text-textMuted"
                  style={{ left: `${barPosition}%` }}
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
        </div>
        
        <div className="relative">
          {renderBeatMarkers()}
          
          {INSTRUMENTS.map((instrument) => (
            <ChannelRow 
              key={instrument.id}
              instrument={instrument}
              tracks={tracks}
              toggleNote={toggleNote}
              currentStep={currentStep}
              subdivision={subdivision}
              bars={bars}
              isPlaying={isPlaying}
              mutedTracks={mutedTracks}
              toggleMute={toggleMute}
              trackAssignments={trackAssignments}
              assignOstinato={assignOstinato}
              clearAssignment={clearAssignment}
              limbAssignments={limbAssignments}
              getOstinatosByInstrument={getOstinatosByInstrument}
              getOstinatoById={getOstinatoById}
              addOstinato={addOstinato}
              getChannel={getChannel}
              setChannelVolume={setChannelVolume}
              setChannelEQ={setChannelEQ}
              controlsWidth={controlsWidth}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChannelRowProps {
  instrument: typeof INSTRUMENTS[0];
  tracks: Record<string, boolean[]>;
  toggleNote: (instrumentId: string, step: number) => void;
  currentStep: number;
  subdivision: number;
  bars: number;
  isPlaying: boolean;
  mutedTracks: Set<string>;
  toggleMute: (instrumentId: string) => void;
  trackAssignments: Record<string, string>;
  assignOstinato: (instrumentId: string, ostinatoId: string) => void;
  clearAssignment: (instrumentId: string) => void;
  limbAssignments: Record<string, string>;
  getOstinatosByInstrument: (instrumentId: string) => any[];
  getOstinatoById: (id: string) => any;
  addOstinato: (ostinato: any) => void;
  getChannel: (instrumentId: string) => { volume: number; eqLow: number; eqMid: number; eqHigh: number };
  setChannelVolume: (instrumentId: string, volume: number) => void;
  setChannelEQ: (instrumentId: string, low: number, mid: number, high: number) => void;
  controlsWidth: number;
}

function ChannelRow({ 
  instrument, 
  tracks, 
  toggleNote, 
  currentStep, 
  subdivision, 
  bars, 
  isPlaying, 
  mutedTracks, 
  toggleMute, 
  trackAssignments,
  assignOstinato,
  clearAssignment,
  limbAssignments,
  getOstinatosByInstrument,
  getOstinatoById,
  addOstinato,
  getChannel,
  setChannelVolume,
  setChannelEQ,
  controlsWidth,
}: ChannelRowProps) {
  const [showOstinatoSelect, setShowOstinatoSelect] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEQModal, setShowEQModal] = useState(false);
  const [ostinatoName, setOstinatoName] = useState('');
  
  const track = tracks[instrument.id] || [];
  const isMuted = mutedTracks.has(instrument.id);
  const totalSteps = bars * subdivision;
  const subdivisionPerBeat = subdivision / 4;
  
  const assignedOstinatoId = trackAssignments[instrument.id];
  const assignedOstinato = assignedOstinatoId ? getOstinatoById(assignedOstinatoId) : null;
  const availableOstinatos = getOstinatosByInstrument(instrument.id);
  const channelSettings = getChannel(instrument.id);
  
  useEffect(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.setChannelVolume(instrument.id, channelSettings.volume / 100);
      audioEngine.setChannelEQ(instrument.id, channelSettings.eqLow, channelSettings.eqMid, channelSettings.eqHigh);
    }
  }, [channelSettings, instrument.id]);

  const handleToggle = (step: number) => toggleNote(instrument.id, step);
  const handleOstinatoSelect = (ostinatoId: string) => { assignOstinato(instrument.id, ostinatoId); setShowOstinatoSelect(false); };
  const handleClearAssignment = () => clearAssignment(instrument.id);
  
  const handleSaveOstinato = () => {
    if (!ostinatoName.trim()) return;
    addOstinato({ name: ostinatoName.trim(), steps: [...track], instrumentId: instrument.id, limb: limbAssignments[instrument.id] || instrument.defaultLimb });
    setOstinatoName('');
    setShowSaveModal(false);
  };
  
  const handleVolumeChange = (volume: number) => {
    setChannelVolume(instrument.id, volume);
    if (audioEngine.isInitialized()) audioEngine.setChannelVolume(instrument.id, volume / 100);
  };
  
  const handleEQChange = (low: number, mid: number, high: number) => {
    setChannelEQ(instrument.id, low, mid, high);
    if (audioEngine.isInitialized()) audioEngine.setChannelEQ(instrument.id, low, mid, high);
  };

  return (
    <div className={`flex items-center gap-2 ${isMuted ? 'opacity-50' : ''}`}>
      <div className="w-24 md:w-32 flex-shrink-0 flex items-center gap-2 px-2 py-1 rounded-lg" style={{ backgroundColor: `${instrument.color}20` }}>
        <button onClick={() => toggleMute(instrument.id)} className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${isMuted ? 'bg-accent text-textMuted' : 'bg-surfaceLight text-text'}`}>M</button>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold truncate" style={{ color: instrument.color }}>{instrument.shortName}</span>
          <span className="text-[10px] text-textMuted truncate hidden md:block">{instrument.name}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1" style={{ width: controlsWidth }}>
        <button onClick={() => setShowOstinatoSelect(!showOstinatoSelect)} className={`px-2 py-1 rounded text-xs flex-shrink-0 transition-colors ${assignedOstinato ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surfaceLight text-textMuted hover:text-text'}`}>
          {assignedOstinato ? assignedOstinato.name : 'Select'}
        </button>
        
        {assignedOstinato && (
          <button onClick={handleClearAssignment} className="p-1 text-textMuted hover:text-red-500 flex-shrink-0" title="Clear assignment">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        
        <button onClick={() => setShowSaveModal(true)} className="p-1 text-textMuted hover:text-primary flex-shrink-0" title="Save as ostinato">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
        </button>

        <div className="flex-shrink-0">
          <input type="range" min="0" max="100" value={channelSettings.volume} onChange={(e) => handleVolumeChange(parseInt(e.target.value))} className="w-16 h-1.5 rounded-full cursor-pointer" style={{ background: `linear-gradient(to right, ${instrument.color} 0%, ${instrument.color} ${channelSettings.volume}%, #2d3748 ${channelSettings.volume}%, #2d3748 100%)` }} title={`Volume: ${channelSettings.volume}%`} />
        </div>
        
        <button onClick={() => setShowEQModal(true)} className="p-1 text-textMuted hover:text-primary flex-shrink-0" title="EQ Settings">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        </button>
        
        {showOstinatoSelect && (
          <div className="absolute z-10 mt-8 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-40">
            {availableOstinatos.length === 0 ? <div className="px-3 py-2 text-textMuted text-xs">No ostinatos</div> : availableOstinatos.map((ostinato: any) => (
              <button key={ostinato.id} onClick={() => handleOstinatoSelect(ostinato.id)} className={`w-full px-3 py-2 text-left text-xs hover:bg-surfaceLight ${assignedOstinatoId === ostinato.id ? 'bg-primary/20 text-primary' : 'text-text'}`}>
                {ostinato.name}{ostinato.isDefault && <span className="text-textMuted ml-1">(default)</span>}
              </button>
            ))}
          </div>
        )}
        
        {showSaveModal && (
          <div className="absolute z-20 mt-8 bg-surface border border-border rounded-lg shadow-lg p-3 w-64">
            <input type="text" value={ostinatoName} onChange={(e) => setOstinatoName(e.target.value)} placeholder="Ostinato name..." className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-text mb-2" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveOstinato()} />
            <div className="flex gap-2">
              <button onClick={handleSaveOstinato} disabled={!ostinatoName.trim()} className="flex-1 px-2 py-1 bg-primary text-white rounded text-xs disabled:opacity-50">Save</button>
              <button onClick={() => setShowSaveModal(false)} className="px-2 py-1 bg-surfaceLight text-text rounded text-xs">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-px min-w-max">
          {Array.from({ length: totalSteps }).map((_, step) => {
            const isBeat = step % subdivisionPerBeat === 0;
            const isCurrent = isPlaying && step === currentStep;
            return (
              <button key={step} onClick={() => handleToggle(step)} className={`w-4 h-8 md:w-5 md:h-10 rounded-sm transition-all ${track[step] ? 'shadow-md' : isBeat ? 'bg-surfaceLight' : 'bg-accent'} ${isCurrent ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''} hover:brightness-125 active:scale-95`} style={{ backgroundColor: track[step] ? instrument.color : undefined }} />
            );
          })}
        </div>
      </div>

      {showEQModal && <EQModal channelId={instrument.id} title={instrument.name} settings={channelSettings} onVolumeChange={handleVolumeChange} onEQChange={handleEQChange} onClose={() => setShowEQModal(false)} />}
    </div>
  );
}