import { useCallback, useState } from 'react';
import { ChannelSettings } from '../../stores/useChannelStore';
import { INSTRUMENTS } from '../../lib/instruments';

interface EQModalProps {
  channelId: string;
  title: string;
  settings: ChannelSettings;
  onVolumeChange: (volume: number) => void;
  onEQChange: (low: number, mid: number, high: number) => void;
  onClose: () => void;
}

export function EQModal({
  channelId,
  title,
  settings,
  onVolumeChange,
  onEQChange,
  onClose,
}: EQModalProps) {
  const [localSettings, setLocalSettings] = useState<ChannelSettings>({ ...settings });

  const handleVolumeChange = useCallback((value: number) => {
    setLocalSettings((prev) => ({ ...prev, volume: value }));
    onVolumeChange(value);
  }, [onVolumeChange]);

  const handleLowChange = useCallback((value: number) => {
    setLocalSettings((prev) => ({ ...prev, eqLow: value }));
    onEQChange(value, localSettings.eqMid, localSettings.eqHigh);
  }, [localSettings.eqMid, localSettings.eqHigh, onEQChange]);

  const handleMidChange = useCallback((value: number) => {
    setLocalSettings((prev) => ({ ...prev, eqMid: value }));
    onEQChange(localSettings.eqLow, value, localSettings.eqHigh);
  }, [localSettings.eqLow, localSettings.eqHigh, onEQChange]);

  const handleHighChange = useCallback((value: number) => {
    setLocalSettings((prev) => ({ ...prev, eqHigh: value }));
    onEQChange(localSettings.eqLow, localSettings.eqMid, value);
  }, [localSettings.eqLow, localSettings.eqMid, onEQChange]);

  const isMetronome = channelId === 'metronome';
  const instrument = isMetronome ? null : INSTRUMENTS.find((i) => i.id === channelId);
  const color = instrument?.color || '#3b82f6';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-lg font-semibold text-text">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-textMuted hover:text-text"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-3">
              Volume
            </label>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M6 8l8 4-8 4V8z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={localSettings.volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${color} 0%, ${color} ${localSettings.volume}%, #2d3748 ${localSettings.volume}%, #2d3748 100%)`,
                }}
              />
              <span className="text-sm text-text w-10 text-right">{localSettings.volume}%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-3">
              Equalizer
            </label>
            <div className="flex justify-between gap-4">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-textMuted mb-2">Low</span>
                <span className="text-xs text-textMuted mb-1">100Hz</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={localSettings.eqLow}
                  onChange={(e) => handleLowChange(parseInt(e.target.value))}
                  className="w-full h-32 vertical-slider"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    background: `linear-gradient(to top, #ef4444 0%, #ef4444 ${((localSettings.eqLow + 12) / 24) * 100}%, #2d3748 ${((localSettings.eqLow + 12) / 24) * 100}%, #2d3748 100%)`,
                  }}
                />
                <span className="text-xs text-text mt-1">
                  {localSettings.eqLow > 0 ? `+${localSettings.eqLow}` : localSettings.eqLow}dB
                </span>
              </div>

              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-textMuted mb-2">Mid</span>
                <span className="text-xs text-textMuted mb-1">1kHz</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={localSettings.eqMid}
                  onChange={(e) => handleMidChange(parseInt(e.target.value))}
                  className="w-full h-32 vertical-slider"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    background: `linear-gradient(to top, #22c55e 0%, #22c55e ${((localSettings.eqMid + 12) / 24) * 100}%, #2d3748 ${((localSettings.eqMid + 12) / 24) * 100}%, #2d3748 100%)`,
                  }}
                />
                <span className="text-xs text-text mt-1">
                  {localSettings.eqMid > 0 ? `+${localSettings.eqMid}` : localSettings.eqMid}dB
                </span>
              </div>

              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-textMuted mb-2">High</span>
                <span className="text-xs text-textMuted mb-1">8kHz</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={localSettings.eqHigh}
                  onChange={(e) => handleHighChange(parseInt(e.target.value))}
                  className="w-full h-32 vertical-slider"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    background: `linear-gradient(to top, #3b82f6 0%, #3b82f6 ${((localSettings.eqHigh + 12) / 24) * 100}%, #2d3748 ${((localSettings.eqHigh + 12) / 24) * 100}%, #2d3748 100%)`,
                  }}
                />
                <span className="text-xs text-text mt-1">
                  {localSettings.eqHigh > 0 ? `+${localSettings.eqHigh}` : localSettings.eqHigh}dB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary hover:bg-primaryHover rounded-lg text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}