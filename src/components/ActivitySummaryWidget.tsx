import React from 'react';
import { DeadlineItem } from '../types';

interface ActivitySummaryWidgetProps {
  deadlines: DeadlineItem[];
  onFilterStatus?: (status: string | null) => void;
  activeStatusFilter?: string | null;
}

export const ActivitySummaryWidget: React.FC<ActivitySummaryWidgetProps> = ({
  deadlines,
  onFilterStatus,
  activeStatusFilter,
}) => {
  const completed = deadlines.filter((d) => d.status === 'selesai').length;
  const inProgress = deadlines.filter((d) => d.status === 'sedang-dikerjakan').length;
  const pending = deadlines.filter((d) => d.status === 'belum-dikerjakan').length;
  const total = deadlines.length || 1;

  // Donut chart geometry
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89

  const completedPct = completed / total;
  const inProgressPct = inProgress / total;
  const pendingPct = pending / total;

  const completedStroke = completedPct * circumference;
  const inProgressStroke = inProgressPct * circumference;
  const pendingStroke = pendingPct * circumference;

  // Cumulative offsets
  const completedOffset = 0;
  const inProgressOffset = -completedStroke;
  const pendingOffset = -(completedStroke + inProgressStroke);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">Ringkasan Kegiatan</h3>

      <div className="flex items-center justify-between gap-4">
        {/* Donut Chart SVG */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background circle track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Selesai - Green */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#10B981"
              strokeWidth="10"
              strokeDasharray={`${completedStroke} ${circumference}`}
              strokeDashoffset={completedOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            {/* Sedang Dikerjakan - Orange */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#F59E0B"
              strokeWidth="10"
              strokeDasharray={`${inProgressStroke} ${circumference}`}
              strokeDashoffset={inProgressOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            {/* Belum Dikerjakan - Red */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#EF4444"
              strokeWidth="10"
              strokeDasharray={`${pendingStroke} ${circumference}`}
              strokeDashoffset={pendingOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Donut Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              {completed}/{deadlines.length}
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">
              {deadlines.length === 0 ? 'Mulai dari 0' : 'Tugas Selesai'}
            </span>
          </div>
        </div>

        {/* Legend on Right matching photo */}

        <div className="space-y-2.5 flex-1 min-w-0">
          {/* Selesai */}
          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'selesai' ? null : 'selesai')}
            className={`w-full flex items-center justify-between text-xs transition p-1 rounded-lg ${
              activeStatusFilter === 'selesai' ? 'bg-emerald-50 ring-1 ring-emerald-300' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-slate-600 font-medium truncate">Selesai</span>
            </div>
            <span className="font-bold text-slate-800 ml-2">{completed}</span>
          </button>

          {/* Sedang Dikerjakan */}
          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'sedang-dikerjakan' ? null : 'sedang-dikerjakan')}
            className={`w-full flex items-center justify-between text-xs transition p-1 rounded-lg ${
              activeStatusFilter === 'sedang-dikerjakan' ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
              <span className="text-slate-600 font-medium truncate">Sedang Dikerjakan</span>
            </div>
            <span className="font-bold text-slate-800 ml-2">{inProgress}</span>
          </button>

          {/* Belum Dikerjakan */}
          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'belum-dikerjakan' ? null : 'belum-dikerjakan')}
            className={`w-full flex items-center justify-between text-xs transition p-1 rounded-lg ${
              activeStatusFilter === 'belum-dikerjakan' ? 'bg-rose-50 ring-1 ring-rose-300' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
              <span className="text-slate-600 font-medium truncate">Belum Dikerjakan</span>
            </div>
            <span className="font-bold text-slate-800 ml-2">{pending}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
