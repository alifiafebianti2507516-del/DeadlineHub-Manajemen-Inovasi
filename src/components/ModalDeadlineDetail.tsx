import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Mail, 
  Send, 
  CalendarPlus, 
  Download, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Trash2,
  Edit3,
  BellRing
} from 'lucide-react';
import { DeadlineItem, TaskStatus } from '../types';
import { 
  formatDeadlineDate, 
  formatFullIndoDate, 
  getPriorityBadgeProps, 
  generateMailtoUrl, 
  generateGoogleCalendarUrl, 
  downloadIcsFile 
} from '../utils/helpers';

interface ModalDeadlineDetailProps {
  deadline: DeadlineItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onSendEmailReminder: (deadline: DeadlineItem) => void;
  onEdit: (deadline: DeadlineItem) => void;
  onDelete: (id: string) => void;
  studentEmail: string;
  onRingAlarm?: (deadline: DeadlineItem) => void;
}

export const ModalDeadlineDetail: React.FC<ModalDeadlineDetailProps> = ({
  deadline,
  onClose,
  onUpdateStatus,
  onSendEmailReminder,
  onEdit,
  onDelete,
  studentEmail,
  onRingAlarm,
}) => {
  if (!deadline) return null;

  const badge = getPriorityBadgeProps(deadline.priority);
  const isCompleted = deadline.status === 'selesai';

  const statusOptions: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'belum-dikerjakan', label: 'Belum Dikerjakan', color: 'border-rose-200 text-rose-700 bg-rose-50' },
    { id: 'sedang-dikerjakan', label: 'Sedang Dikerjakan', color: 'border-amber-200 text-amber-700 bg-amber-50' },
    { id: 'selesai', label: 'Selesai', color: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Urgency Banner */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between relative bg-gradient-to-r from-slate-50 to-blue-50/30">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${badge.className}`}>
                {badge.label}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                {deadline.category}
              </span>
            </div>
            <h3 className={`text-xl font-extrabold text-slate-900 tracking-tight leading-snug ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}>
              {deadline.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              {deadline.courseName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Due date card */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Batas Waktu Pengumpulan</p>
                <p className="text-sm font-bold text-slate-800">
                  {formatFullIndoDate(deadline.dueDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                <Clock className="w-3 h-3 text-slate-400" />
                {deadline.dueTime} WIB
              </span>
            </div>
          </div>

          {/* Location / Portal */}
          {deadline.location && (
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Lokasi / Platform: <strong>{deadline.location}</strong></span>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Catatan & Petunjuk Tugas
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
              {deadline.description || 'Tidak ada catatan tambahan untuk tugas ini.'}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Status Pengerjaan
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateStatus(deadline.id, opt.id)}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition flex items-center justify-center gap-1.5 ${
                    deadline.status === opt.id
                      ? `${opt.color} ring-2 ring-blue-500 shadow-xs font-bold`
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {deadline.status === opt.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  )}
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alarm Feature Box (PC & HP) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <BellRing className="w-4 h-4 animate-wiggle" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Jam Alarm Deadline (PC & HP)</h4>
                  <p className="text-[11px] text-slate-500">Membunyikan alarm nyaring dan getar</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {deadline.alarm?.enabled ?? true ? 'Alarm Siaga' : 'Mati'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2.5">
              Alarm akan berbunyi kencang di laptop dan menggetarkan HP Anda saat batas waktu tiba untuk mencegah keterlambatan.
            </p>

            <button
              onClick={() => onRingAlarm?.(deadline)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              Tes Bunyikan Alarm Tugas Ini Sekarang
            </button>
          </div>

          {/* Email Reminder Feature Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pengingat Email Mahasiswa</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{studentEmail}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {deadline.emailReminder.enabled ? 'Aktif' : 'Non-aktif'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              Kirim notifikasi pengingat otomatis ke inbox email mahasiswa Anda agar tidak lupa deadline ini.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSendEmailReminder(deadline)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Pengingat ke Email Sekarang
              </button>

              <a
                href={generateMailtoUrl(deadline, studentEmail)}
                target="_blank"
                rel="noreferrer"
                title="Buka Aplikasi Email Langsung (Mailto)"
                className="p-2 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition"
              >
                Buka Mail App
              </a>
            </div>
          </div>

          {/* Calendar Sync Shortcuts */}
          <div className="pt-2 flex items-center gap-2">
            <a
              href={generateGoogleCalendarUrl(deadline)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
              Google Calendar
            </a>
            <button
              onClick={() => downloadIcsFile(deadline)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Unduh .ICS
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Yakin ingin menghapus tugas "${deadline.title}"?`)) {
                onDelete(deadline.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-rose-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(deadline);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
