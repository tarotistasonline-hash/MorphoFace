/**
 * Audio feedback utility using the Web Audio API.
 * Synthesizes soft, calming, and harmonious pentatonic tones
 * on user click of facial hotspots.
 */

let audioCtx: AudioContext | null = null;

// A beautiful, serene Zen pentatonic scale (Major Pentatonic in C/G) for ear-safe harmonies
const PENTATONIC_SCALE = [
  523.25, // C5 (Calming root)
  587.33, // D5 (Warm transit)
  659.25, // E5 (Bright major third)
  783.99, // G5 (Perfect fifth, serene resonance)
  880.00, // A5 (Soothing sixth)
  1046.50, // C6 (High clear chime)
  1174.66, // D6 (Airy breeze)
  1318.51  // E6 (Celestial sparkle)
];

/**
 * Triggers a soft, calming sine and triangle wave synth chime.
 * Uses index to map to different notes of a harmonious pentatonic scale,
 * so successive clicks feel like creating an ambient, relaxing melody.
 */
export function playHotspotTone(index: number = 2) {
  try {
    // 1. Lazy-init AudioContext, abiding strictly by browser user-interaction autoplay policies
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // 2. Resume context if suspended
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Pick a pentatonic frequency based on the given index
    const frequency = PENTATONIC_SCALE[index % PENTATONIC_SCALE.length];

    // Create primary warm oscillator (Triangle)
    const osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(frequency, now);
    
    // Create secondary high chime oscillator (Sine) for the "celestial sparkle" tone
    const osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    // Sparkle has a delicate frequency over the fifth or octave
    osc2.frequency.setValueAtTime(frequency * 1.5, now);

    // Main Gain node for warm sound envelope (extremely clean sound, no clicking)
    const gainNode = audioCtx.createGain();
    
    // Low, soothing, ear-safe volume levels
    const maxPrimaryVol = 0.03;
    const maxSparkleVol = 0.015;

    // 3. Apply soft envelope for primary warm sound (Osc1)
    // Fast but smooth attack, long exponential decay/release
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxPrimaryVol, now + 0.03); // 30ms attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.55); // 550ms release

    // 4. Connect everything
    osc1.connect(gainNode);
    
    // Create independent subtle gain node for the high sparkle to let it fade slightly quicker
    const sparkleGainNode = audioCtx.createGain();
    sparkleGainNode.gain.setValueAtTime(0, now);
    sparkleGainNode.gain.linearRampToValueAtTime(maxSparkleVol, now + 0.02);
    sparkleGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35); // 350ms release
    
    osc2.connect(sparkleGainNode);

    // Connect both gains to the hardware output destination
    gainNode.connect(audioCtx.destination);
    sparkleGainNode.connect(audioCtx.destination);

    // 5. Start and Schedule Stops
    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.6);
    osc2.stop(now + 0.4);
  } catch (error) {
    // Fail silently in sandboxed environments, iframe limits, or devices lacking audio output
    console.debug("Web Audio API not supported or blocked by user policy:", error);
  }
}

// Module-level trackers for the continuous face scanning audio feedback
let scanOscillator: OscillatorNode | null = null;
let scanLfo: OscillatorNode | null = null;
let scanGainNode: GainNode | null = null;
let scanInterval: any = null;

/**
 * Starts a subtle, futuristic scanning hum with recurring sonar-like chimes.
 */
export function startScanningSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // 1. Low-frequency deep biomechanical scanning hum
    scanOscillator = audioCtx.createOscillator();
    scanOscillator.type = "sine";
    scanOscillator.frequency.setValueAtTime(110, now); // Warm base A2 (110 Hz)
    
    // Low pass filter to keep it extremely subtle and rumble-free
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, now);

    // Cozy, non-intrusive volume
    scanGainNode = audioCtx.createGain();
    scanGainNode.gain.setValueAtTime(0, now);
    scanGainNode.gain.linearRampToValueAtTime(0.02, now + 0.25); // Smooth fade in

    // 2. Modulate base hum with an LFO for rotating radar feel
    scanLfo = audioCtx.createOscillator();
    scanLfo.type = "sine";
    scanLfo.frequency.setValueAtTime(1.4, now); // Sweep rate in Hz

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(30, now); // Range +/- 30Hz

    scanLfo.connect(lfoGain);
    lfoGain.connect(scanOscillator.frequency);

    scanOscillator.connect(filter);
    filter.connect(scanGainNode);
    scanGainNode.connect(audioCtx.destination);

    scanOscillator.start(now);
    scanLfo.start(now);

    // 3. Ambient digital radar sonar pulses every 750ms
    let pulseCount = 0;
    scanInterval = setInterval(() => {
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      
      const pulseOsc = audioCtx.createOscillator();
      pulseOsc.type = "triangle";
      
      // Step up the digital search sound
      const basePulseFreq = 783.99 + (pulseCount % 4) * 110; 
      pulseOsc.frequency.setValueAtTime(basePulseFreq, t);
      pulseOsc.frequency.exponentialRampToValueAtTime(150, t + 0.18); // Fast drop sweep

      const pulseGain = audioCtx.createGain();
      pulseGain.gain.setValueAtTime(0, t);
      pulseGain.gain.linearRampToValueAtTime(0.007, t + 0.015);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(audioCtx.destination);

      pulseOsc.start(t);
      pulseOsc.stop(t + 0.18);
      pulseCount++;
    }, 750);

  } catch (error) {
    console.debug("Error starting scan sound feedback:", error);
  }
}

/**
 * Fades out the continuous scanning hum and plays a delightful confirmation chime.
 */
export function stopScanningSound() {
  try {
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
    
    const now = audioCtx ? audioCtx.currentTime : 0;
    if (scanGainNode && audioCtx) {
      scanGainNode.gain.cancelScheduledValues(now);
      scanGainNode.gain.setValueAtTime(scanGainNode.gain.value, now);
      scanGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    }
    
    setTimeout(() => {
      if (scanOscillator) {
        try { scanOscillator.stop(); } catch (_) {}
        scanOscillator = null;
      }
      if (scanLfo) {
        try { scanLfo.stop(); } catch (_) {}
        scanLfo = null;
      }
      scanGainNode = null;
    }, 250);

    // Play scan validation/success chime
    playSuccessChime();
  } catch (error) {
    console.debug("Error stopping scan sound feedback:", error);
  }
}

/**
 * Triggers a beautiful soft digital confirmation chime signifying biometric digitization success.
 */
export function playSuccessChime() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Elegant, celestial chord chime
    const chordFreqs = [523.25, 659.25, 783.99, 1046.50]; // Beautiful C major triad
    chordFreqs.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.05); // Staggered arpeggio

      const gainNode = audioCtx!.createGain();
      gainNode.gain.setValueAtTime(0, now + i * 0.05);
      gainNode.gain.linearRampToValueAtTime(0.008, now + i * 0.05 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.45);

      osc.connect(gainNode);
      gainNode.connect(audioCtx!.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.5);
    });
  } catch (_) {}
}

/**
 * Synthesizes a pleasant time-warp sweep representing slider/hourglass aging adjustments.
 */
export function playAgingSliderChangeSound(value: number) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Harmonic map representing stages of time (higher frequencies symbolize the celestial timeline)
    const freqMap: Record<number, number> = {
      0: 329.63,   // E4 (Foundation/Original)
      15: 440.00,  // A4 (Timeline shifting)
      30: 523.25,  // C5 (Generational midpoint)
      45: 659.25,  // E5 (Wisdom threshold)
      60: 783.99   // G5 (Celestial legacy)
    };

    const targetFreq = freqMap[value] || 440.00;

    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    
    // Nice exponential pitch shift to sound tactile and physical
    osc.frequency.setValueAtTime(targetFreq * 0.94, now);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.12);

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.015, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch (_) {}
}

// Trackers for procedural ambient background music
let ambientNodes: {
  padOsc1: OscillatorNode;
  padOsc2: OscillatorNode;
  padGain1: GainNode;
  padGain2: GainNode;
  filter: BiquadFilterNode;
} | null = null;

let ambientInterv: any = null;
let isMusicActive = false;

/**
 * Procedurally starts a soft, safe, beautiful deep drone and crystalline twinkling bell cycle.
 */
export function startAmbientMusic() {
  if (isMusicActive) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    isMusicActive = true;

    // 1. Create a warm resonant resonant filter for high safety
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, now);
    filter.Q.setValueAtTime(1.5, now);

    // 2. Continuous cozy warm low drone pad oscillators (Harmonious fifth)
    const padOsc1 = audioCtx.createOscillator();
    padOsc1.type = "sine";
    padOsc1.frequency.setValueAtTime(73.42, now); // D2 (Warm grounding tone)

    const padOsc2 = audioCtx.createOscillator();
    padOsc2.type = "sine";
    padOsc2.frequency.setValueAtTime(110.00, now); // A2 (Perfect fifth harmony)

    const padGain1 = audioCtx.createGain();
    padGain1.gain.setValueAtTime(0, now);
    // extremely low volume background pad
    padGain1.gain.linearRampToValueAtTime(0.012, now + 3.0); 

    const padGain2 = audioCtx.createGain();
    padGain2.gain.setValueAtTime(0, now);
    padGain2.gain.linearRampToValueAtTime(0.008, now + 4.0);

    // Route pads through resonant lowpass filter
    padOsc1.connect(padGain1);
    padGain1.connect(filter);

    padOsc2.connect(padGain2);
    padGain2.connect(filter);

    filter.connect(audioCtx.destination);

    padOsc1.start(now);
    padOsc2.start(now);

    ambientNodes = { padOsc1, padOsc2, padGain1, padGain2, filter };

    // 3. Periodic soft shimmering "starlight" chimes cycle every 4.5 seconds
    const chimeTones = [293.66, 329.63, 440.00, 587.33, 659.25, 783.99, 880.00]; // Pentatonic melody
    let lastChimeIdx = -1;

    ambientInterv = setInterval(() => {
      if (!audioCtx || !isMusicActive) return;
      
      const t = audioCtx.currentTime;
      let randIdx = Math.floor(Math.random() * chimeTones.length);
      if (randIdx === lastChimeIdx) {
        randIdx = (randIdx + 1) % chimeTones.length;
      }
      lastChimeIdx = randIdx;
      
      const chimeFreq = chimeTones[randIdx];

      // Twinkling organic sine wave
      const chimeOsc = audioCtx.createOscillator();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(chimeFreq, t);

      // Delicate dynamic volume envelope (extremely gentle pluck)
      const chimeGain = audioCtx.createGain();
      chimeGain.gain.setValueAtTime(0, t);
      chimeGain.gain.linearRampToValueAtTime(0.004, t + 1.2); // Slow safe attack
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8); // Soothing lingering release

      // Connect chime through highpass to filter out sub rumbling and make it sound ethereal
      const hpFilter = audioCtx.createBiquadFilter();
      hpFilter.type = "highpass";
      hpFilter.frequency.setValueAtTime(400, t);

      chimeOsc.connect(hpFilter);
      hpFilter.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);

      chimeOsc.start(t);
      chimeOsc.stop(t + 4.5);
    }, 4500);

  } catch (error) {
    console.debug("Error starting background music synthesizer:", error);
  }
}

/**
 * Gracefully fades out and stops the ambient background music loop.
 */
export function stopAmbientMusic() {
  if (!isMusicActive) return;
  try {
    isMusicActive = false;
    
    if (ambientInterv) {
      clearInterval(ambientInterv);
      ambientInterv = null;
    }

    const now = audioCtx ? audioCtx.currentTime : 0;
    if (ambientNodes && audioCtx) {
      const { padGain1, padGain2, padOsc1, padOsc2 } = ambientNodes;
      
      padGain1.gain.cancelScheduledValues(now);
      padGain1.gain.setValueAtTime(padGain1.gain.value, now);
      padGain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.5); // Warm gradual release

      padGain2.gain.cancelScheduledValues(now);
      padGain2.gain.setValueAtTime(padGain2.gain.value, now);
      padGain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      setTimeout(() => {
        try { padOsc1.stop(); } catch (_) {}
        try { padOsc2.stop(); } catch (_) {}
      }, 1800);
    }
    ambientNodes = null;
  } catch (error) {
    console.debug("Error stopping background music:", error);
  }
}

/**
 * Toggle the status of the ambient background music
 */
export function toggleAmbientMusic(): boolean {
  if (isMusicActive) {
    stopAmbientMusic();
    return false;
  } else {
    startAmbientMusic();
    return true;
  }
}

/**
 * Checks if the background music state is currently playing
 */
export function isAmbientMusicPlaying(): boolean {
  return isMusicActive;
}

