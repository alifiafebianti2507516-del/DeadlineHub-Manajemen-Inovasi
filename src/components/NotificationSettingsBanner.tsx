import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Calendar, Volume2, CheckCircle2, Sparkles, X, Smartphone, Laptop, Clock } from 'lucide-react';
import { requestNotificationPermission, sendDeviceNotification, openGoogleCalendarEvent } from '../utils/notifications';
import { DeadlineItem } from '../types';

interface NotificationSettingsBannerProps {
  deadlines: DeadlineItem[];
  onShowToast: (msg: string, sub?: string) => void;
  onOpenAlarmCenter: () => void;
}

export const NotificationSettingsBanner: React.FC<NotificationSettingsBannerProps> = ({
  deadlines,
  onShowToast,
  onOpenAlarmCenter,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  if (isDismissed) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      sendDeviceNotification(
        '🎉 Notifikasi DeadlineHub Aktif!',
        'Anda akan menerima pengingat deadline langsung di layar PC dan HP Anda.',
        { playSound: true }
      );
      onShowToast('Notifikasi PC & HP Diaktifkan!', 'Pop-up pemberitahuan dan audio chime telah aktif.');
    } else {
      onShowToast('Izin belum diberikan', 'Silakan izinkan notifikasi pada pengaturan browser.');
    }
  };

  const handleTestChimeAndNotification = () => {
    sendDeviceNotification(
      '⏰ [DeadlineHub Alert] Uji Coba Notifikasi',
      'Tugas Metode Penelitian & UKT jatuh tempo segera. Notifikasi ini muncul di PC & HP Anda!',
      { playSound: true }
    );
    onShowToast('🔔 Notifikasi & Suara Chime Dikirim!', 'Cek bar notifikasi laptop/HP Anda.');
  };

  const handleSyncAllToGoogleCalendar = () => {
    const urgentTasks = deadlines.filter((d) => d.status !== 'selesai').slice(0, 3);
    urgentTasks.forEach((task, index) => {
      setTimeout(() => {
        openGoogleCalendarEvent(task);
      }, index * 400);
    });
    onShowToast('Sinkronisasi Google Calendar Dibuka!', 'Event tugas telah dibuka untuk disimpan ke Google Calendar Anda.');
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-[#0F2445] to-[#0A1628] text-white border border-blue-500/30 shadow-lg shadow-blue-900/20 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/80 border border-blue-400/30 text-white flex items-center justify-center shrink-0 shadow-md">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Notifikasi Otomatis di PC, HP & Google Calendar
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-rose-500/30 text-rose-300 border-rose-400/40 animate-pulse flex items-center gap-1">
                <span>🔥</span> Mode Anti-Nunda (Bikin Melek)
              </span>
            </div>

            <p className="text-xs text-blue-200/80 mt-1 max-w-xl leading-relaxed">
              Dilengkapi <strong>Alarm Darurat Anti-Nunda</strong> (sirene kencang, klakson kapal & teriakan suara bangun tidur) untuk anak yang suka menunda tugas kuliah agar langsung kaget dan gerak cepat!
            </p>

            <div className="flex items-center gap-3 mt-2 text-[11px] text-blue-300/90 font-medium">
              <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5" /> Windows / Mac / Linux</span>
              <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> HP Getar Kencang</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Google Calendar Alarms</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {permission !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              Aktifkan Notifikasi Device
            </button>
          ) : (
            <button
              onClick={handleTestChimeAndNotification}
              className="px-3.5 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs border border-blue-400/30 shadow-md transition flex items-center gap-1.5"
              title="Bunyikan suara dan tampilkan notifikasi sekarang"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              Tes Notifikasi
            </button>
          )}

          <button
            onClick={onOpenAlarmCenter}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/40 transition flex items-center gap-1.5 cursor-pointer border border-rose-400/50"
            title="Buka Pusat Pengaturan Jam Alarm Anti-Nunda"
          >
            <Clock className="w-3.5 h-3.5 animate-wiggle" />
            🚨 Alarm Anti-Nunda (Shock Mode)
          </button>

          <button
            onClick={handleSyncAllToGoogleCalendar}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
            title="Buka Google Calendar untuk menyinkronkan tugas terdekat"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            Sync Google Calendar
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Tutup Banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
