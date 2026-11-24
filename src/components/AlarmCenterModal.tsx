import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  Clock, 
  Volume2, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Timer, 
  AlertTriangle 
} from 'lucide-react';
import { DeadlineItem, AlarmTone, AlarmOffset } from '../types';
import { previewAlarmTone } from '../utils/alarmAudio';
import { formatDeadlineDate } from '../utils/helpers';

interface AlarmCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadlines: DeadlineItem[];
  onToggleTaskAlarm: (deadlineId: string, enabled: boolean) => void;
  onUpdateAlarmSettings: (deadlineId: string, offset: AlarmOffset, tone: AlarmTone) => void;
  onTestRingAlarm: (deadline?: DeadlineItem) => void;
}

export const AlarmCenterModal: React.FC<AlarmCenterModalProps> = ({
  isOpen,
  onClose,
  deadlines,
  onToggleTaskAlarm,
  onUpdateAlarmSettings,
  onTestRingAlarm,
}) => {
  const [selectedTone, setSelectedTone] = useState<AlarmTone>('shock-siren');
  const [volume, setVolume] = useState<number>(0.8);
  const [quickTimerMinutes, setQuickTimerMinutes] = useState<number>(30);
  const [quickTimerRunning, setQuickTimerRunning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePreviewTone = (tone: AlarmTone) => {
    setSelectedTone(tone);
    previewAlarmTone(
      tone,
      volume,
      deadlines[0]?.title || 'Tugas Metode Penelitian',
      deadlines[0]?.courseName || 'Metodologi Penelitian'
    );
  };

  const handleStartQuickTimer = (mins: number) => {
    setQuickTimerMinutes(mins);
    setQuickTimerRunning(true);
    setTimeout(() => {
      onTestRingAlarm();
      setQuickTimerRunning(false);
    }, mins * 60 * 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B1727] via-[#10243E] to-[#0B1727] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <BellRing className="w-5 h-5 text-white animate-wiggle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">Jam Alarm Deadline (PC & HP)</h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-400/30">
                  Bunyi Kencang & Getar
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Alarm berbunyi aktif di laptop dan bergetar di ponsel saat waktu pengumpulan tiba
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Test Live Alarm Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Uji Coba Bunyi Alarm Sekarang</h4>
                <p className="text-[11px] text-slate-600">
                  Coba dengarkan bagaimana alarm berbunyi secara kontinu dan memunculkan layar panggilan tugas di PC & HP Anda.
                </p>
              </div>
            </div>

            <button
              onClick={() => onTestRingAlarm(deadlines[0])}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <BellRing className="w-3.5 h-3.5" />
              Tes Alarm Berdering!
            </button>
          </div>

          {/* Tone Selector & Volume */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-600" />
                Pilihan Nada Dering Alarm
              </h4>
              <span className="text-[11px] text-slate-500">Klik nada untuk uji dengar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'shock-siren' as AlarmTone, name: '🚨 Sirene Panik Nuklir', desc: 'Sangat bikin kaget & melek' },
                { id: 'voice-alert' as AlarmTone, name: '📢 Suara Teriakan Bangun', desc: 'Peringatan suara bahasa Indo' },
                { id: 'airhorn' as AlarmTone, name: '💥 Klakson Kapal / Stadion', desc: 'Bass kencang menggelegar' },
                { id: 'digital' as AlarmTone, name: '📟 Digital Clock Beep', desc: 'Klasik jam beker nyaring' },
                { id: 'radar' as AlarmTone, name: '⚡ Radar Bahaya', desc: 'Siaga tinggi mendesak' },
                { id: 'marimba' as AlarmTone, name: '🎵 Melodi Marimba', desc: 'Irama ritmik ceria' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePreviewTone(item.id)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    selectedTone === item.id
                      ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                    <Play className="w-3 h-3 text-rose-600 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="pt-2 flex items-center gap-3">
              <span className="font-semibold text-slate-700 text-[11px]">Volume Suara:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="font-mono font-bold text-slate-700 text-xs">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Quick Timer Focus Alarm */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs">Alarm Belajar Cepat (Quick Timer)</h4>
              </div>
              {quickTimerRunning && (
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Timer Berjalan ({quickTimerMinutes}m)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              Pasang alarm pengingat cepat untuk menyemangati diri Anda mulai belajar atau beristirahat:
            </p>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleStartQuickTimer(mins)}
                  className="flex-1 py-1.5 rounded-xl border border-blue-300 bg-white hover:bg-blue-600 hover:text-white font-bold text-xs text-blue-700 transition cursor-pointer"
                >
                  +{mins} Menit
                </button>
              ))}
            </div>
          </div>

          {/* List of Tasks and their Alarm Status */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2">Status Jam Alarm Per Tugas:</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {deadlines.map((task) => {
                const isAlarmOn = task.alarm?.enabled ?? true;
                const offset = task.alarm?.offset ?? 'at-deadline';

                return (
                  <div
                    key={task.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{task.title}</span>
                        <span className="text-[10px] text-slate-500">({task.courseName})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Waktu Deadline: {formatDeadlineDate(task.dueDate, task.dueTime)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Alarm Offset selector */}
                      <select
                        value={offset}
                        onChange={(e) =>
                          onUpdateAlarmSettings(task.id, e.target.value as AlarmOffset, selectedTone)
                        }
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold"
                      >
                        <option value="at-deadline">Tepat Waktu</option>
                        <option value="1-hour">1 Jam Sebelum</option>
                        <option value="3-hours">3 Jam Sebelum</option>
                        <option value="1-day">1 Hari Sebelum</option>
                      </select>

                      {/* On/Off Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAlarmOn}
                          onChange={(e) => onToggleTaskAlarm(task.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5" /> PC Alarm Siaga</span>
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> HP Getar Siaga</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
