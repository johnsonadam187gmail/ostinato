import { usePlayback } from '../../hooks/usePlayback';
import { usePatternStore } from '../../stores/usePatternStore';

export function Transport() {
  const { toggle, initializeAudio } = usePlayback();
  const isPlaying = usePatternStore((state) => state.isPlaying);
  
  const handlePlayClick = async () => {
    await initializeAudio();
    toggle();
  };
  
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={handlePlayClick}
        className={`
          w-16 h-16 rounded-full transition-all transform hover:scale-105 active:scale-95
          ${isPlaying 
            ? 'bg-primaryHover shadow-lg shadow-primary/30' 
            : 'bg-primary shadow-lg shadow-primary/30 hover:bg-primaryHover'
          }
        `}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-8 h-8 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-8 h-8 mx-auto text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </div>
  );
}
