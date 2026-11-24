import React from 'react';
import { DeadlineItem } from '../types';
import { 
  Trophy, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award,
  Zap
} from 'lucide-react';

interface ProgressViewProps {
  deadlines: DeadlineItem[];
  onSelectDeadline: (item: DeadlineItem) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ deadlines, onSelectDeadline }) => {
  const total = deadlines.length;
  const completed = deadlines.filter((d) => d.status === 'selesai').length;
  const inProgress = deadlines.filter((d) => d.status === 'sedang-dikerjakan').length;
  const pending = deadlines.filter((d) => d.status === 'belum-dikerjakan').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Category breakdown
  const categoryCounts = deadlines.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Streak Belajar 7 Hari
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Evaluasi & Progress Akademik</h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg">
              Pantau performa penyelesaian tugas kuliah, hindari sistem kebut semalam (SKS), dan capai IPK optimal!
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/20 sm:pl-6">
            <span className="text-3xl sm:text-4xl font-extrabold">{completionRate}%</span>
            <p className="text-xs text-blue-200 font-medium">Tingkat Ketuntasan</p>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Tugas Diselesaikan</p>
            <p className="text-2xl font-extrabold text-slate-900">{completed} <span className="text-xs font-normal text-slate-400">/ {total}</span></p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Tuntas tepat waktu</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Sedang Dikerjakan</p>
            <p className="text-2xl font-extrabold text-slate-900">{inProgress}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Dalam proses riset & koding</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Belum Disentuh</p>
            <p className="text-2xl font-extrabold text-slate-900">{pending}</p>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Disarankan segera dicicil</p>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Distribusi Berdasarkan Kategori
          </h3>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{cat}</span>
                    <span className="text-slate-500">{count} tugas ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Badges */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Pencapaian Mahasiswa Produktif
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Anti SKS</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Menyelesaikan 3 tugas H-2 sebelum batas waktu.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Email Alert Hero</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mengaktifkan pengingat email pada semua tugas.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Master Perencanaan</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Menjadwalkan agenda perkuliahan sebulan penuh.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
              <Flame className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Konsisten 7 Hari</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Login dan cek deadline harian tanpa putus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
