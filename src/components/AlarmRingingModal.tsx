import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Clock, 
  ArrowRight, 
  Volume2, 
  Moon, 
  Flame, 
  AlertOctagon, 
  Sparkles,
  Zap,
  Bomb
} from 'lucide-react';
import { DeadlineItem } from '../types';
import { formatDeadlineDate } from '../utils/helpers';

interface AlarmRingingModalProps {
  ringingDeadline: DeadlineItem | null;
  onDismiss: () => void;
  onSnooze: (deadlineId: string, minutes: number) => void;
  onOpenTaskDetails: (deadline: DeadlineItem) => void;
}

const shockQuotes = [
  "Ingat! Nilai D atau E itu nyata kalau tugas ini kamu anggap sepele!",
  "Sistem Kebut Semalam (SKS) bikin umur berkurang 5 tahun! Kerjain sekarang!",
  "Dosen tidak menerima alasan 'mati lampu' atau 'file korup' ya!",
  "Ingat perjuangan orang tua bayar UKT, masa mau ngulang semester depan?!",
  "Rebahan 5 menit lagi = nangis panik jam 23.55 server SIAKAD down!",
];

export const AlarmRingingModal: React.FC<AlarmRingingModalProps> = ({
  ringingDeadline,
  onDismiss,
  onSnooze,
  onOpenTaskDetails,
}) => {
  const [clickCountToDismiss, setClickCountToDismiss] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (ringingDeadline) {
      setQuoteIndex(Math.floor(Math.random() * shockQuotes.length));
      setClickCountToDismiss(0);
    }
  }, [ringingDeadline]);

  if (!ringingDeadline) return null;

  const handlePledgeDismiss = () => {
    // If student clicks 1 time or directly clicks pledge
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-rose-600 overflow-hidden text-center relative animate-pulse"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hazard Warning Stripe Header */}
        <div className="bg-amber-400 py-1.5 px-4 flex items-center justify-center gap-2 text-slate-900 font-extrabold text-[11px] tracking-widest uppercase border-b-2 border-slate-900">
          <AlertOctagon className="w-4 h-4 animate-bounce" />
          <span>⚠️ ALERTA DARURAT MAHASISWA: ANTI-MENUNDA ⚠️</span>
          <AlertOctagon className="w-4 h-4 animate-bounce" />
        </div>

        <div className="p-6 sm:p-8">
          {/* Pulsating Shock Icon */}
          <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping"></span>
            <span className="absolute -inset-3 rounded-full bg-red-600/20 animate-pulse"></span>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 relative z-10 border-2 border-white">
              <Bomb className="w-10 h-10 animate-wiggle" />
            </div>
          </div>

          {/* Alarm Shock Banner */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            WOI BANGUN! JANGAN MENUNDA LAGI!
          </span>

          {/* Task Details */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mt-1">
            "{ringingDeadline.title}"
          </h2>
          <p className="text-xs sm:text-sm font-bold text-rose-600 mt-1">
            {ringingDeadline.courseName} • Kategori: {ringingDeadline.category}
          </p>

          {/* Due Time Card */}
          <div className="my-4 p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-around text-xs">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold">
              <Clock className="w-4 h-4 text-rose-600 animate-spin" />
              <span>Batas Pengumpulan:</span>
            </div>
            <span className="font-mono font-black text-rose-700 bg-white px-3 py-1 rounded-xl border border-rose-300 shadow-xs text-sm">
              {formatDeadlineDate(ringingDeadline.dueDate, ringingDeadline.dueTime)} WIB
            </span>
          </div>

          {/* Shocking Reality Check Quote */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold leading-relaxed mb-5 shadow-xs">
            💡 <em>"{shockQuotes[quoteIndex]}"</em>
          </div>

          {/* Action Buttons for Chronic Procrastinators */}
          <div className="space-y-2.5">
            {/* The Main Anti-Nunda Pledge Button */}
            <button
              onClick={handlePledgeDismiss}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-xl shadow-rose-600/30 transition flex items-center justify-center gap-2 cursor-pointer border-2 border-rose-300"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>SAYA BERJANJI MULAI KERJAIN SEKARANG! (MATIKAN ALARM)</span>
            </button>

            {/* Direct Open Button */}
            <button
              onClick={() => {
                onDismiss();
                onOpenTaskDetails(ringingDeadline);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
            >
              Buka Detail & Tempat Kumpul Tugas ({ringingDeadline.location || 'LMS Kampus'})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Snooze Button with Warning */}
            <button
              onClick={() => onSnooze(ringingDeadline.id, 5)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold text-[11px] transition flex items-center justify-center gap-1.5"
            >
              <Moon className="w-3 h-3 text-slate-400" />
              Tunda 5 Menit (Awas nanti panik pas jam deadline mepet!)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
