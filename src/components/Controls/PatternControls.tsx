import { useCallback, useRef } from 'react';
import { usePatternStore } from '../../stores/usePatternStore';
import { PRESETS } from '../../lib/presets';
import { ExportedBeat } from '../../types';

export function PatternControls() {
  const {
    beatName,
    setBeatName,
    loadPreset,
    resetBeat,
    exportBeat,
    importBeat,
    saveBeat,
    bars,
    setBars,
    subdivision,
    setSubdivision,
  } = usePatternStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = useCallback(() => {
    const data = exportBeat();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${beatName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportBeat, beatName]);
  
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExportedBeat;
        if (data.version && data.tracks) {
          importBeat(data);
        } else {
          alert('Invalid beat file format');
        }
      } catch {
        alert('Failed to parse beat file');
      }
    };
    reader.readAsText(file);
    
    e.target.value = '';
  }, [importBeat]);

  const handleSaveBeat = useCallback(() => {
    saveBeat();
    alert('Beat saved to library!');
  }, [saveBeat]);
  
  return (
    <div className="bg-surface rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex-1 w-full md:w-auto">
        <input
          type="text"
          value={beatName}
          onChange={(e) => setBeatName(e.target.value)}
          className="w-full bg-surfaceLight rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Beat name"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <select
          onChange={(e) => loadPreset(e.target.value)}
          value=""
          className="bg-surfaceLight rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>Load Preset</option>
          {PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        
        <select
          value={bars}
          onChange={(e) => setBars(parseInt(e.target.value))}
          className="bg-surfaceLight rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {[1, 2, 4, 8].map((b) => (
            <option key={b} value={b}>{b} bar{b > 1 ? 's' : ''}</option>
          ))}
        </select>
        
        <select
          value={subdivision}
          onChange={(e) => setSubdivision(parseInt(e.target.value) as 16 | 32)}
          className="bg-surfaceLight rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value={16}>16th notes</option>
          <option value={32}>32nd notes</option>
        </select>

        <button
          onClick={handleSaveBeat}
          className="px-3 py-2 bg-primary hover:bg-primaryHover rounded-lg text-white transition-colors"
          title="Save Beat"
        >
          Save Beat
        </button>
        
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-surfaceLight hover:bg-accent rounded-lg text-text transition-colors"
          title="Export Beat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>
        
        <button
          onClick={handleImportClick}
          className="px-3 py-2 bg-surfaceLight hover:bg-accent rounded-lg text-text transition-colors"
          title="Import Beat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        
        <button
          onClick={resetBeat}
          className="px-3 py-2 bg-surfaceLight hover:bg-accent rounded-lg text-text transition-colors"
          title="Clear Beat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </div>
  );
}