export class Synthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.5;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }

  setVolume(vol: number) {
    this.sfxVolume = vol;
  }

  init() {
    this.getCtx();
  }

  playClick() {
    if (this.isMuted) return;
    try {
      // Short UI click (0.1s), bright, airy, friendly, soft "tick/pop". freq ~600-900 Hz.
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      const now = ctx.currentTime;
      
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5 * this.sfxVolume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch(e){}
  }

  playLoginSuccess() {
    if (this.isMuted) return;
    try {
      // Friendly, cheerful two-note ascending chime: C5 (523.25) -> E5 (659.25)
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const vol = 0.4 * this.sfxVolume;

      const playNote = (freq: number, startOffset: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine'; // soft synth / marimba feel
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + startOffset);
        gain.gain.linearRampToValueAtTime(vol, now + startOffset + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
        
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      playNote(523.25, 0, 0.3);
      playNote(659.25, 0.15, 0.4);
    } catch(e){}
  }

  playCorrect() {
    if (this.isMuted) return;
    try {
      // Ascending arpeggio C5-E5-G5-C6 (523.25, 659.25, 783.99, 1046.50)
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      const vol = 0.3 * this.sfxVolume;

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle'; // Bright, happy, xylophone-like
        osc.frequency.value = f;
        
        const startOffset = i * 0.1;
        const duration = i === freqs.length - 1 ? 0.6 : 0.2; // last note rings out (sparkle tail)
        
        gain.gain.setValueAtTime(0, now + startOffset);
        gain.gain.linearRampToValueAtTime(vol, now + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
        
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      });
    } catch(e){}
  }

  playWrong() {
    if (this.isMuted) return;
    try {
      // Soft descending two-note G4 (392.00) -> D4 (293.66)
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const vol = 0.3 * this.sfxVolume;

      const playNote = (freq: number, startOffset: number, duration: number, slideTo?: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine'; // rounded, not sharp
        
        osc.frequency.setValueAtTime(freq, now + startOffset);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(slideTo, now + startOffset + duration);
        }
        
        gain.gain.setValueAtTime(0, now + startOffset);
        gain.gain.linearRampToValueAtTime(vol, now + startOffset + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
        
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      playNote(392.00, 0, 0.25, 370); // G4 slight bend down
      playNote(293.66, 0.2, 0.3, 277);  // D4 slight bend down
    } catch(e){}
  }

  playLevelUp() {
    if (this.isMuted) return;
    try {
      // Rising sparkle sweep ending on high C6 (1046.50) or higher
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const vol = 0.3 * this.sfxVolume;
      
      // Sweep
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweepOsc.type = 'sine';
      
      sweepOsc.frequency.setValueAtTime(440, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);
      
      sweepGain.gain.setValueAtTime(0, now);
      sweepGain.gain.linearRampToValueAtTime(vol * 0.5, now + 0.15);
      sweepGain.gain.linearRampToValueAtTime(0, now + 0.3);
      
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.3);

      // Chime hit at peak C6 (1046.50) & E6 (1318.51)
      const hitFreqs = [1046.50, 1318.51];
      hitFreqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.value = f;
        
        gain.gain.setValueAtTime(0, now + 0.3);
        gain.gain.linearRampToValueAtTime(vol, now + 0.32);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.start(now + 0.3);
        osc.stop(now + 0.8);
      });
    } catch(e){}
  }
}

export const synth = new Synthesizer();
