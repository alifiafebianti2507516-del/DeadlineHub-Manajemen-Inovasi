/**
 * Sistem Notifikasi Multi-Platform (PC & HP) + Audio Chime + Google Calendar Sync
 */

// Web Audio API chime tone (no external mp3 dependency required)
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Pleasant double chime: 587.33Hz (D5) -> 880Hz (A5)
    const now = ctx.currentTime;
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.debug('Audio chime skipped', err);
  }
}

// Request Notification Permission on PC or Mobile
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

// Send Native OS Notification (appears in Windows/Mac notification center & Android notification tray)
export function sendDeviceNotification(
  title: string,
  body: string,
  options?: { tag?: string; playSound?: boolean }
) {
  // Play chime sound if enabled
  if (options?.playSound !== false) {
    playNotificationSound();
  }

  // Trigger vibration on Mobile devices if supported
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([150, 80, 150]);
    } catch {
      // ignore
    }
  }

  // Native Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: options?.tag || `deadlinehub-${Date.now()}`,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (err) {
      console.debug('Notification display error:', err);
    }
  }
}

// Open Google Calendar Event with reminder alarms pre-set
export function openGoogleCalendarEvent(deadline: {
  title: string;
  courseName: string;
  dueDate: string;
  dueTime: string;
  location?: string;
  description?: string;
}) {
  const [year, month, day] = deadline.dueDate.split('-');
  const [hour, minute] = deadline.dueTime.split(':');
  
  // Format YYYYMMDDTHHMMSS
  const startTime = `${year}${month}${day}T${hour}${minute}00`;
  const endTime = `${year}${month}${day}T${hour}${minute}00`;

  const title = encodeURIComponent(`[DeadlineHub] ${deadline.title} (${deadline.courseName})`);
  const details = encodeURIComponent(
    `Tugas: ${deadline.title}\n` +
    `Matakuliah: ${deadline.courseName}\n` +
    `Lokasi / Portal: ${deadline.location || 'Portal Kampus'}\n\n` +
    `Catatan Tugas:\n${deadline.description || 'Disinkronkan otomatis dari DeadlineHub'}\n\n` +
    `Tetap fokus dan kumpulkan tepat waktu! 🎓`
  );
  const location = encodeURIComponent(deadline.location || 'Kampus');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
