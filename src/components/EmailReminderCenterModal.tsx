import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Inbox, 
  Calendar, 
  ShieldCheck, 
  BellRing,
  RefreshCw
} from 'lucide-react';
import { DeadlineItem, EmailLog, StudentProfile } from '../types';
import { formatDeadlineDate, formatFullIndoDate, generateMailtoUrl } from '../utils/helpers';

interface EmailReminderCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  deadlines: DeadlineItem[];
  emailLogs: EmailLog[];
  onTriggerSendEmail: (deadline: DeadlineItem) => void;
}

export const EmailReminderCenterModal: React.FC<EmailReminderCenterModalProps> = ({
  isOpen,
  onClose,
  profile,
  deadlines,
  emailLogs,
  onTriggerSendEmail,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    deadlines.find((d) => d.status !== 'selesai')?.id || deadlines[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'preview' | 'logs' | 'queue'>('preview');
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTask = deadlines.find((d) => d.id === selectedTaskId) || deadlines[0];

  const handleSendTest = () => {
    if (!currentTask) return;
    onTriggerSendEmail(currentTask);
    setTestSentSuccess(true);
    setTimeout(() => setTestSentSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#0A1628] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">Pusat Pengingat Email Mahasiswa</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Online & Siap
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Terhubung ke email: <strong className="text-blue-300 font-mono">{profile.email}</strong>
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

        {/* Tab Controls */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold bg-slate-50/60">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Live Preview Email Mahasiswa
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Riwayat Email Terkirim ({emailLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'queue'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BellRing className="w-4 h-4" />
            Antrean Jadwal Pengingat
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'preview' && (
            <div>
              {/* Task Selector to Preview */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 whitespace-nowrap">Pilih Deadline:</span>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
                  >
                    {deadlines.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} ({d.courseName}) - {formatDeadlineDate(d.dueDate, d.dueTime)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTest}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Notifikasi Sekarang
                  </button>
                  {currentTask && (
                    <a
                      href={generateMailtoUrl(currentTask, profile.email)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold transition"
                    >
                      Buka Mail App ↗
                    </a>
                  )}
                </div>
              </div>

              {testSentSuccess && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Berhasil dikirim!</strong> Notifikasi pengingat untuk "{currentTask?.title}" telah terkirim ke <u>{profile.email}</u>.
                  </span>
                </div>
              )}

              {/* Simulated Email Client Container */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-slate-50">
                {/* Email Client Header bar */}
                <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      DeadlineHub Automated Student Notification
                    </span>
                    <span>Baru Saja</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {currentTask?.priority === 'sangat-mendesak' ? '🚨 [SANGAT MENDESAK]' : '⏰ [PENGINGAT DEADLINE]'}{' '}
                    Pengingat Tugas: {currentTask?.title} ({currentTask?.courseName})
                  </h4>
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4">
                    <span>Dari: <strong className="text-slate-700 font-mono">pengingat@deadlinehub.id</strong></span>
                    <span>Kepada: <strong className="text-slate-700 font-mono">{profile.email}</strong> ({profile.name})</span>
                  </div>
                </div>

                {/* Email Body Template matching standard student HTML mailer */}
                <div className="p-6 bg-white max-w-xl mx-auto my-4 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-slate-800">
                  {/* Brand Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        DH
                      </div>
                      <span className="font-bold text-sm text-slate-900">DeadlineHub</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Pengingat Otomatis Mahasiswa</span>
                  </div>

                  {/* Greeting */}
                  <div>
                    <h5 className="text-base font-bold text-slate-900">
                      Halo, {profile.name}! 👋
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Ini adalah pengingat otomatis bahwa tugas kuliah Anda akan segera mencapai batas waktu pengumpulan:
                    </p>
                  </div>

                  {/* Deadline Card Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase">
                        {currentTask?.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        currentTask?.priority === 'sangat-mendesak'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {currentTask?.priority === 'sangat-mendesak' ? 'Sangat Mendesak' : 'Mendesak'}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">
                      {currentTask?.title}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                      <p>📚 <strong>Mata Kuliah:</strong> {currentTask?.courseName}</p>
                      <p>⏰ <strong>Batas Waktu:</strong> {currentTask ? formatDeadlineDate(currentTask.dueDate, currentTask.dueTime) : ''} WIB</p>
                      <p>📍 <strong>Pengumpulan:</strong> {currentTask?.location || 'Portal Kampus / LMS'}</p>
                    </div>

                    {currentTask?.description && (
                      <div className="text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600 italic">
                        "{currentTask.description}"
                      </div>
                    )}
                  </div>

                  {/* Call to action button */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={onClose}
                      className="inline-block px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                    >
                      Buka & Tandai Tugas di DeadlineHub
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Tetap fokus, cicil tugas Anda, dan jangan menunggu detik-detik terakhir sebelum server kampus padat!
                    </p>
                  </div>

                  {/* Email Footer */}
                  <div className="border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400">
                    <p>DeadlineHub © 2024 • Satu Tempat, Semua Deadline.</p>
                    <p className="mt-0.5">Dikirim ke {profile.email} berdasarkan konfigurasi akun mahasiswa Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-600">
                  Daftar email pengingat yang telah dikirim ke alamat email mahasiswa:
                </p>
                <button
                  onClick={handleSendTest}
                  className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Kirim Notifikasi Uji Coba
                </button>
              </div>

              {emailLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-semibold">Belum ada email yang terkirim</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {emailLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 transition">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="font-bold text-slate-800 text-xs">{log.deadlineTitle}</span>
                          <span className="text-[11px] text-slate-500">({log.courseName})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(log.sentAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                        {log.previewSnippet}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Penerima: <strong className="text-slate-600">{log.recipientEmail}</strong></span>
                        <span className="text-emerald-600 font-semibold">Terkirim ke Inbox</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                Daftar deadline dengan jadwal pengingat email otomatis yang akan datang:
              </p>

              <div className="space-y-2">
                {deadlines
                  .filter((d) => d.status !== 'selesai' && d.emailReminder.enabled)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs truncate">{task.title}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-md">
                            {task.courseName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Deadline: {formatDeadlineDate(task.dueDate, task.dueTime)} • Jadwal Trigger:{' '}
                          <span className="font-medium text-slate-700">
                            {task.emailReminder.remindOffsets.map((o) => o.replace('-', ' ')).join(', ')}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => onTriggerSendEmail(task)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition shrink-0"
                      >
                        Kirim Sekarang
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Status Engine: <strong className="text-emerald-600">Aktif & Siaga</strong>
          </span>
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
