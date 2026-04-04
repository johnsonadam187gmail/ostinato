import { useState } from 'react';
import { Metronome } from './components/Metronome';
import { Transport, PatternControls } from './components/Controls';
import { PianoRoll } from './components/PianoRoll';
import { LibraryPanel } from './components/Library/LibraryPanel';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleStart = async () => {
    setInitialized(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
              Ostinato
            </h1>
            <p className="text-textMuted text-sm md:text-base">
              Drum Independence Trainer
            </p>
          </div>
          {initialized && (
            <button
              onClick={() => setShowLibrary(true)}
              className="px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-surfaceHover transition-colors text-sm"
            >
              Library
            </button>
          )}
        </header>

        {!initialized && (
          <div className="bg-surface rounded-xl p-8 text-center mb-6">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <h2 className="text-xl font-semibold text-text mb-2">
                Welcome to Ostinato
              </h2>
              <p className="text-textMuted max-w-md mx-auto">
                Practice drum limb independence with customizable ostinatos. 
                Click the button below to start the audio engine.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-primary hover:bg-primaryHover rounded-xl text-white font-semibold transition-colors"
            >
              Start Practice
            </button>
          </div>
        )}

        {initialized && (
          <div className="space-y-4 md:space-y-6">
            <PatternControls />
            
            <Metronome />
            
            <div className="flex justify-center py-4">
              <Transport />
            </div>
            
            <PianoRoll />
            
            <footer className="text-center text-textMuted text-xs mt-8 pb-4">
              <p>Create patterns for each drum, then hit play to practice with the metronome.</p>
            </footer>
          </div>
        )}
      </div>

      {showLibrary && (
        <LibraryPanel onClose={() => setShowLibrary(false)} />
      )}
    </div>
  );
}

export default App;