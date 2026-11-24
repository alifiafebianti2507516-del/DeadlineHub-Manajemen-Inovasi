import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Lightbulb, 
  Palette, 
  Layout, 
  Bug,
  ShieldAlert
} from 'lucide-react';
import { UserFeedback, FeedbackCategory, StudentProfile } from '../types';

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  feedbackList: UserFeedback[];
  onSubmitFeedback: (item: Omit<UserFeedback, 'id' | 'createdAt' | 'status'>) => void;
  onOpenAdminPanel?: () => void;
}

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({
  isOpen,
  onClose,
  profile,
  feedbackList,
  onSubmitFeedback,
  onOpenAdminPanel,
}) => {
  const [tab, setTab] = useState<'submit' | 'history'>('submit');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('menu_baru');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Silakan lengkapi judul dan deskripsi usulan.');
      return;
    }

    onSubmitFeedback({
      studentId: profile.studentId || 'Mahasiswa UM',
      studentName: profile.name || 'Mahasiswa',
      category,
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setDescription('');
      setTab('history');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Kotak Saran & Masukan Mahasiswa</h2>
              <p className="text-xs text-blue-200/80">Kirim usulan menu baru atau ide desain tampilan langsung ke Admin!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold px-6 pt-3">
          <button
            type="button"
            onClick={() => setTab('submit')}
            className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              tab === 'submit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Kirim Usulan Baru</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              tab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Riwayat Usulan & Realisasi ({feedbackList.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {tab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Saran Berhasil Terkirim ke Admin!</p>
                    <p className="text-[11px] text-emerald-700">Admin akan segera meninjau dan dapat menerapkannya langsung ke menu aplikasi.</p>
                  </div>
                </div>
              )}

              {/* Kategori Usulan */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Kategori Usulan <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'menu_baru', label: 'Menu Baru', icon: Layout },
                    { id: 'tampilan_tema', label: 'Tampilan & Tema', icon: Palette },
                    { id: 'fitur', label: 'Fitur Baru', icon: Sparkles },
                    { id: 'bug', label: 'Kendala / Bug', icon: Bug },
                  ].map((cat) => {
                    const IconC = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as FeedbackCategory)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer text-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconC className="w-4 h-4" />
                        <span className="text-[11px]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Judul Usulan / Saran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tambahkan tautan menu Perpustakaan UM di samping"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Detail Saran & Masukan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan kebutuhan Anda, apa yang perlu ditambahkan, dikurangi, atau diubah..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Prioritas */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Tingkat Kebutuhan
                </label>
                <div className="flex gap-2">
                  {(['rendah', 'sedang', 'tinggi'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold capitalize cursor-pointer ${
                        priority === p
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {onOpenAdminPanel && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdminPanel();
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Buka Panel Admin
                  </button>
                )}

                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirimkan Usulan Saya</span>
                </button>
              </div>
            </form>
          )}

          {tab === 'history' && (
            <div className="space-y-3">
              <p className="text-slate-500 text-[11px]">
                Berikut daftar saran dari mahasiswa beserta status penerapannya oleh Admin:
              </p>

              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className={`p-4 rounded-2xl border text-xs ${
                    fb.status === 'implemented'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-xs">{fb.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      fb.status === 'implemented'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {fb.status === 'implemented' ? '✓ Telah Diterapkan Admin' : 'Sedang Ditinjau'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{fb.description}</p>
                  
                  {fb.adminResponse && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-blue-900 font-medium">
                      <span className="font-bold text-blue-700">Tanggapan Admin: </span>
                      {fb.adminResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
