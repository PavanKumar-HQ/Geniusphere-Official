let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    // Check for compatibility
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioContext = new AudioContext();
    } else {
      console.error("Web Audio API is not supported in this browser.");
    }
  }
  return audioContext;
};

type SoundType = 'click' | 'alert' | 'success' | 'glitch' | 'dataflow' | 'shieldUp';

export const playSound = (type: SoundType) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if it's suspended (e.g., due to browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);

  switch (type) {
    case 'click':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      oscillator.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.1);
      break;

    case 'alert':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
      break;

    case 'success':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.4);
      }, 100);
      break;

    case 'glitch':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(100 + Math.random() * 200, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.setValueAtTime(0, ctx.currentTime + 0.05);
      break;
      
    case 'dataflow':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
      break;

    case 'shieldUp':
       oscillator.type = 'sine';
       oscillator.frequency.setValueAtTime(200, ctx.currentTime);
       gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
       gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
       oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
       break;
  }

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 1);
};
