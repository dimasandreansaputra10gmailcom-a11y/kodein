import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Settings2 } from 'lucide-react';
import { useAudioStore, bgmManager } from '../store/useAudioStore';
import { useTheme } from './ThemeProvider';
import { synth } from '../lib/synth';

export function AudioController() {
  const { isMuted, volume, toggleMute, setVolume } = useAudioStore();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  // Sync BGM with Theme
  useEffect(() => {
    const resolvedTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    // Only init and play after first user interaction to bypass autoplay restrictions
    const handleFirstInteraction = () => {
      bgmManager.init();
      bgmManager.playTheme(resolvedTheme);
      synth.init();
      setIsFirstInteraction(false);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    if (isFirstInteraction) {
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
    } else {
      bgmManager.playTheme(resolvedTheme);
    }

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [theme, isFirstInteraction]);

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-[120%] right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border 
                       border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col gap-4 w-60 z-50 origin-top-right"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Volume</span>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-slate-400" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) toggleMute();
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-accent"
                />
                <Volume2 className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Audio BGM & Efek
              </span>
              <button 
                onClick={() => {
                  toggleMute();
                  synth.playClick();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isMuted 
                    ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    : 'bg-primary-accent text-white shadow-md shadow-primary-accent/30'
                }`}
              >
                {isMuted ? 'OFF' : 'ON'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          synth.playClick();
        }}
        className={`relative p-1.5 sm:p-2.5 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center min-w-[36px] sm:min-w-[40px] focus:outline-none ${
          isMuted 
            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            : 'bg-primary-accent text-white hover:bg-primary-accent/90 shadow-primary-accent/30'
        }`}
        title="Pengaturan Audio"
      >
        {!isMuted && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary-accent pointer-events-none" />
        )}
        
        {isMuted ? (
          <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>
    </div>
  );
}
