import React from 'react';
import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  GraduationCap, 
  Users, 
  CreditCard, 
  Code2, 
  BookOpen, 
  Award,
  CheckCircle2,
  Circle,
  Mail,
  Clock
} from 'lucide-react';
import { DeadlineItem } from '../types';
import { formatDeadlineDate, getPriorityBadgeProps } from '../utils/helpers';

interface DeadlineListProps {
  deadlines: DeadlineItem[];
  onSelectDeadline: (item: DeadlineItem) => void;
  onToggleStatus: (id: string, e: React.MouseEvent) => void;
  onQuickSendEmail: (item: DeadlineItem, e: React.MouseEvent) => void;
  onViewAllClick?: () => void;
  isDashboardView?: boolean;
}

export const DeadlineList: React.FC<DeadlineListProps> = ({
  deadlines,
  onSelectDeadline,
  onToggleStatus,
  onQuickSendEmail,
  onViewAllClick,
  isDashboardView = true,
}) => {
  const getIcon = (type: DeadlineItem['iconType']) => {
    switch (type) {
      case 'doc':
        return {
          icon: FileText,
          bg: 'bg-rose-100/80 text-rose-600',
        };
      case 'presentation':
        return {
          icon: GraduationCap,
          bg: 'bg-purple-100/80 text-purple-600',
        };
      case 'users':
        return {
          icon: Users,
          bg: 'bg-emerald-100/80 text-emerald-600',
        };
      case 'card':
        return {
          icon: CreditCard,
          bg: 'bg-sky-100/80 text-sky-600',
        };
      case 'code':
        return {
          icon: Code2,
          bg: 'bg-indigo-100/80 text-indigo-600',
        };
      case 'book':
        return {
          icon: BookOpen,
          bg: 'bg-amber-100/80 text-amber-600',
        };
      case 'award':
      default:
        return {
          icon: Award,
          bg: 'bg-teal-100/80 text-teal-600',
        };
    }
  };

  const displayedList = isDashboardView ? deadlines.slice(0, 5) : deadlines;

  return (
    <div className="bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Deadline Terdekat</h2>
        {onViewAllClick && isDashboardView && (
          <button
            onClick={onViewAllClick}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition"
          >
            Lihat Semua 
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        )}
      </div>

      {/* Deadlines List */}
      {displayedList.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Belum ada deadline tercatat</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Akun mahasiswa baru dimulai dari nol. Klik tombol <strong>"+ Tambah"</strong> pada menu untuk mulai mencatat tugas kuliah pertama Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedList.map((item) => {
            const iconConfig = getIcon(item.iconType);
            const Icon = iconConfig.icon;
            const badge = getPriorityBadgeProps(item.priority);
            const isCompleted = item.status === 'selesai';

            return (
              <div
                key={item.id}
                onClick={() => onSelectDeadline(item)}
                className={`group relative flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer ${
                  isCompleted ? 'bg-slate-50/70 opacity-70' : ''
                }`}
              >
                {/* Left side: Icon + Title + Course */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Category Icon */}
                  <div className={`w-11 h-11 rounded-xl ${iconConfig.bg} flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title and details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}>
                        {item.title}
                      </h3>
                      {item.emailReminder.enabled && (
                        <span 
                          title="Pengingat email aktif untuk tugas ini" 
                          className="shrink-0 text-blue-500 hover:text-blue-600 p-0.5"
                          onClick={(e) => onQuickSendEmail(item, e)}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.category} - {item.courseName}
                    </p>
                  </div>
                </div>

                {/* Right side: Date + Priority Badge + Chevron */}
                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 pl-2">
                  {/* Due Date & Time */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatDeadlineDate(item.dueDate, item.dueTime)}</span>
                  </div>

                  {/* Priority Pill */}
                  <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${badge.className}`}>
                    {badge.label}
                  </span>

                  {/* Quick Toggle Status */}
                  <button
                    onClick={(e) => onToggleStatus(item.id, e)}
                    title={isCompleted ? "Tandai Belum Selesai" : "Tandai Selesai"}
                    className="p-1 rounded-lg text-slate-300 hover:text-emerald-600 transition"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 group-hover:text-slate-400" />
                    )}
                  </button>

                  {/* Chevron Right */}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
