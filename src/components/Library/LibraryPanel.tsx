import { useState } from 'react';
import { useLibraryStore } from '../../stores/useLibraryStore';
import { INSTRUMENTS } from '../../lib/instruments';

interface LibraryPanelProps {
  onClose: () => void;
}

type TabType = 'ostinatos' | 'beats';

export function LibraryPanel({ onClose }: LibraryPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ostinatos');
  const [filterInstrument, setFilterInstrument] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const ostinatos = useLibraryStore((s) => s.ostinatos);
  const beats = useLibraryStore((s) => s.beats);
  const deleteOstinato = useLibraryStore((s) => s.deleteOstinato);
  const deleteBeat = useLibraryStore((s) => s.deleteBeat);

  const filteredOstinatos = ostinatos.filter((o) => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstrument = filterInstrument === 'all' || o.instrumentId === filterInstrument;
    return matchesSearch && matchesInstrument;
  });

  const filteredBeats = beats.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInstrumentName = (id: string) => {
    const inst = INSTRUMENTS.find((i) => i.id === id);
    return inst?.name || id;
  };

  const exportOstinato = (ostinato: typeof ostinatos[0]) => {
    const data = JSON.stringify(ostinato, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ostinato.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBeat = (beat: typeof beats[0]) => {
    const data = JSON.stringify(beat, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${beat.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.steps && data.instrumentId) {
          useLibraryStore.getState().importOstinato(data);
        } else if (data.trackAssignments) {
          useLibraryStore.getState().importBeat(data);
        }
      } catch (err) {
        console.error('Failed to import:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text">Library</h2>
          <button
            onClick={onClose}
            className="text-textMuted hover:text-text"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('ostinatos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ostinatos'
                  ? 'bg-primary text-white'
                  : 'bg-background text-textMuted hover:text-text'
              }`}
            >
              Ostinatos
            </button>
            <button
              onClick={() => setActiveTab('beats')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'beats'
                  ? 'bg-primary text-white'
                  : 'bg-background text-textMuted hover:text-text'
              }`}
            >
              Beats
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-text text-sm"
            />
            {activeTab === 'ostinatos' && (
              <select
                value={filterInstrument}
                onChange={(e) => setFilterInstrument(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-text text-sm"
              >
                <option value="all">All Drums</option>
                {INSTRUMENTS.map((inst) => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            )}
            <label className="px-3 py-2 bg-background border border-border rounded-lg text-text text-sm cursor-pointer hover:bg-surfaceHover">
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'ostinatos' && (
            <div className="space-y-2">
              {filteredOstinatos.length === 0 ? (
                <p className="text-textMuted text-center py-8">No ostinatos found</p>
              ) : (
                filteredOstinatos.map((ostinato) => {
                  const instrument = INSTRUMENTS.find((i) => i.id === ostinato.instrumentId);
                  return (
                    <div
                      key={ostinato.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: instrument?.color }}
                        />
                        <div>
                          <p className="text-text font-medium text-sm">{ostinato.name}</p>
                          <p className="text-textMuted text-xs">
                            {getInstrumentName(ostinato.instrumentId)} · {ostinato.limb}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportOstinato(ostinato)}
                          className="p-2 text-textMuted hover:text-text"
                          title="Export"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                        {!ostinato.isDefault && (
                          <button
                            onClick={() => deleteOstinato(ostinato.id)}
                            className="p-2 text-textMuted hover:text-red-500"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'beats' && (
            <div className="space-y-2">
              {filteredBeats.length === 0 ? (
                <p className="text-textMuted text-center py-8">
                  No beats saved yet. Create a beat and save it to see it here.
                </p>
              ) : (
                filteredBeats.map((beat) => {
                  const assignedCount = Object.keys(beat.trackAssignments).length;
                  return (
                    <div
                      key={beat.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg"
                    >
                      <div>
                        <p className="text-text font-medium text-sm">{beat.name}</p>
                        <p className="text-textMuted text-xs">
                          {assignedCount} track{assignedCount !== 1 ? 's' : ''} · {beat.bars} bar{beat.bars !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportBeat(beat)}
                          className="p-2 text-textMuted hover:text-text"
                          title="Export"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteBeat(beat.id)}
                          className="p-2 text-textMuted hover:text-red-500"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}