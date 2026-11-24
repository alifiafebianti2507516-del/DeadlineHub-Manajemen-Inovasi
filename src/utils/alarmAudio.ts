import { AlarmTone } from '../types';

let currentAudioContext: AudioContext | null = null;
let currentInterval: number | null = null;
let currentVibrationInterval: number | null = null;
let isSpeakingLoop = false;

function getAudioContext(): AudioContext {
  if (!currentAudioContext || currentAudioContext.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    currentAudioContext = new AudioContextClass();
  }
  if (currentAudioContext.state === 'suspended') {
    currentAudioContext.resume();
  }
  return currentAudioContext;
}

// Speak shocking voice reminders in Indonesian using SpeechSynthesis API
export function speakShockWarning(taskTitle: string = 'Tugas', courseName: string = 'Kuliah') {
  if (!('speechSynthesis' in window)) return;

  const messages = [
    `Woi bangun! Jangan menunda lagi! Tugas ${taskTitle} sudah mepet! Cepat buka laptop sekarang atau kamu ngulang semester depan!`,
    `Gawat! Deadline ${taskTitle} sudah di depan mata! Ayo bangun dan kumpulkan sebelum portal ditutup dosen!`,
    `Rebahan bisa ditunda, tugas kuliah tidak bisa! Buka portal kampus dan kerjakan sekarang!`,
    `Ingat uang kuliah mahal! Selesaikan tugas ${taskTitle} detik ini juga!`,
  ];

  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  const utterance = new SpeechSynthesisUtterance(randomMsg);
  utterance.lang = 'id-ID';
  utterance.rate = 1.25; // Urgent fast talking
  utterance.pitch = 1.2; // High alert pitch
  utterance.volume = 1.0;

  window.speechSynthesis.cancel(); // Stop any pending speech
  window.speechSynthesis.speak(utterance);
}

// Single pulse generator based on tone type
function playTonePulse(ctx: AudioContext, tone: AlarmTone, volume: number = 0.5) {
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(volume, 1.0)), now);
  masterGain.connect(ctx.destination);

  if (tone === 'airhorn') {
    // 💥 Loud Stadium Air Horn (Rich layered sawtooth chords at 165Hz & 220Hz)
    const freqs = [165, 220, 330, 440];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    });
  } else if (tone === 'shock-siren') {
    // 🚨 Nuclear / Emergency Panic Siren (Fast oscillating wail)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1800, now + 0.18);
    osc.frequency.linearRampToValueAtTime(800, now + 0.36);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  } else if (tone === 'voice-alert') {
    // Klakson warning ping + Voice alert
    const freqs = [550, 750];
    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  } else if (tone === 'digital') {
    // Classic Digital Clock Beep-Beep-Beep
    const freqs = [880, 880, 880, 880];
    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });
  } else if (tone === 'marimba') {
    // Gentle Marimba arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } else {
    // Urgent Radar Siren
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.25);
    osc.frequency.linearRampToValueAtTime(600, now + 0.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

/**
 * Preview sound once (for selecting tone in settings)
 */
export function previewAlarmTone(
  tone: AlarmTone,
  volume: number = 0.7,
  taskTitle: string = 'Tugas Kuliah',
  courseName: string = 'Kampus'
) {
  try {
    const ctx = getAudioContext();
    playTonePulse(ctx, tone, volume);

    if (tone === 'voice-alert' || tone === 'shock-siren') {
      speakShockWarning(taskTitle, courseName);
    }

    // Short vibration on mobile
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 300]);
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.debug('Preview alarm tone error:', err);
  }
}

/**
 * Start continuous looping alarm for PC & Mobile
 * Returns a controller with a `stop()` function
 */
export function startContinuousAlarm(
  tone: AlarmTone = 'shock-siren',
  volume: number = 0.8,
  taskTitle: string = 'Tugas Kuliah',
  courseName: string = 'Kampus'
) {
  stopContinuousAlarm(); // Ensure any existing alarm is cancelled

  try {
    const ctx = getAudioContext();

    // Play immediate pulse
    playTonePulse(ctx, tone, volume);

    // If shock-siren or voice-alert, trigger Indonesian voice shout!
    if (tone === 'voice-alert' || tone === 'shock-siren' || tone === 'airhorn') {
      speakShockWarning(taskTitle, courseName);
    }

    // Loop interval based on tone rhythm
    const intervalMs =
      tone === 'shock-siren'
        ? 550 // Ultra fast panic
        : tone === 'airhorn'
        ? 650
        : tone === 'voice-alert'
        ? 3500 // Repeated shout
        : tone === 'marimba'
        ? 1400
        : 800;

    currentInterval = window.setInterval(() => {
      try {
        playTonePulse(ctx, tone, volume);
        if (tone === 'voice-alert' || tone === 'shock-siren') {
          // Re-speak every 5 seconds if still not dismissed
          if (Math.random() > 0.4) {
            speakShockWarning(taskTitle, courseName);
          }
        }
      } catch (err) {
        console.debug('Loop pulse error:', err);
      }
    }, intervalMs);

    // Intense continuous vibration for Mobile devices
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([500, 150, 500, 150, 800]);
        currentVibrationInterval = window.setInterval(() => {
          navigator.vibrate([500, 150, 500, 150, 800]);
        }, 1800);
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.debug('Failed to start alarm sound:', err);
  }

  return {
    stop: stopContinuousAlarm,
  };
}

/**
 * Stop active ringing alarm and cancel vibration & voice
 */
export function stopContinuousAlarm() {
  if (currentInterval !== null) {
    clearInterval(currentInterval);
    currentInterval = null;
  }

  if (currentVibrationInterval !== null) {
    clearInterval(currentVibrationInterval);
    currentVibrationInterval = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch {
      // ignore
    }
  }
}
