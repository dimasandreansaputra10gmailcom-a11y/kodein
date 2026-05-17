import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl, Howler } from 'howler';
import { synth } from '../lib/synth';

interface AudioState {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.5,
      toggleMute: () => {
        const { isMuted, volume } = get();
        const nextMute = !isMuted;
        set({ isMuted: nextMute });
        
        // Update Howler & Synth
        Howler.mute(nextMute);
        synth.setMute(nextMute);
        
        // Also initialize audio on first unmute if user hasn't interacted
        if (!nextMute) {
          synth.init();
        }
      },
      setVolume: (v: number) => {
        set({ volume: v });
        Howler.volume(v);
        synth.setVolume(v);
      },
    }),
    {
      name: 'app-audio-settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          Howler.mute(state.isMuted);
          Howler.volume(state.volume);
          synth.setMute(state.isMuted);
          synth.setVolume(state.volume);
        }
      },
    }
  )
);

// We'll manage the BGM instances outside Zustand to avoid complex serialization and reactivity mapping
class BGMManager {
  private lightBgm: Howl | null = null;
  private darkBgm: Howl | null = null;
  private currentTheme: 'light' | 'dark' = 'light';
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.lightBgm = new Howl({
      src: ['/audio/Sunbeam_Metronome.mp3'], // Cheerful, upbeat
      loop: true,
      volume: 0,
      html5: true, // Force HTML5 Audio to avoid large array buffer downloads
      preload: true
    });

    this.darkBgm = new Howl({
      src: ['/audio/Porch_Light.mp3'], // Ambient / Night / Lo-fi vibe
      loop: true,
      volume: 0,
      html5: true,
      preload: true
    });

    this.initialized = true;
    
    // Start playback but muted
    if (this.lightBgm.state() === 'loaded') {
      this.playTheme(this.currentTheme);
    } else {
      this.lightBgm.once('load', () => this.playTheme(this.currentTheme));
    }
  }

  playTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    if (!this.initialized) return;

    if (theme === 'light') {
      if (this.darkBgm?.playing()) {
        this.darkBgm.fade(this.darkBgm.volume(), 0, 1500);
        setTimeout(() => this.darkBgm?.pause(), 1500);
      }
      if (!this.lightBgm?.playing()) {
        this.lightBgm?.play();
      }
      this.lightBgm?.fade(0, 0.4, 2000); // Max BGM vol is 0.4
    } else {
      if (this.lightBgm?.playing()) {
        this.lightBgm.fade(this.lightBgm.volume(), 0, 1500);
        setTimeout(() => this.lightBgm?.pause(), 1500);
      }
      if (!this.darkBgm?.playing()) {
        this.darkBgm?.play();
      }
      this.darkBgm?.fade(0, 0.3, 2000); // Ambient is slightly softer
    }
  }

  suspend() {
    this.lightBgm?.pause();
    this.darkBgm?.pause();
  }
}

export const bgmManager = new BGMManager();
