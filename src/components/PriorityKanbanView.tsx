import React from 'react';
import { DeadlineItem, Priority, TaskStatus } from '../types';
import { formatDeadlineDate, getPriorityBadgeProps } from '../utils/helpers';
import { AlertTriangle, Clock, Calendar, CheckCircle2, ChevronRight, Mail, Plus } from 'lucide-react';

interface PriorityKanbanViewProps {
  deadlines: DeadlineItem[];
  onSelectDeadline: (item: DeadlineItem) => void;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onAddNewWithPriority: (priority: Priority) => void;
  onQuickSendEmail: (item: DeadlineItem, e: React.MouseEvent) => void;
}

export const PriorityKanbanView: React.FC<PriorityKanbanViewProps> = ({
  deadlines,
  onSelectDeadline,
  onUpdateStatus,
  onAddNewWithPriority,
  onQuickSendEmail,
}) => {
  const columns: {
    id: Priority | 'selesai';
    title: string;
    description: string;
    badgeBg: string;
    borderCol: string;
    headerBg: string;
    items: DeadlineItem[];
  }[] = [
    {
      id: 'sangat-mendesak',
      title: 'Sangat Mendesak',
      description: 'Deadline ≤ 24-48 jam ke depan',
      badgeBg: 'bg-rose-500 text-white',
      borderCol: 'border-rose-200',
      headerBg: 'bg-rose-50/70',
      items: deadlines.filter((d) => d.status !== 'selesai' && d.priority === 'sangat-mendesak'),
    },
    {
      id: 'mendesak',
      title: 'Mendesak',
      description: 'Deadline 2 - 3 hari lagi',
      badgeBg: 'bg-orange-500 text-white',
      borderCol: 'border-orange-200',
      headerBg: 'bg-orange-50/70',
      items: deadlines.filter((d) => d.status !== 'selesai' && d.priority === 'mendesak'),
    },
    {
      id: 'terjadwal',
      title: 'Terjadwal',
      description: 'Deadline 4 - 7+ hari lagi',
      badgeBg: 'bg-blue-500 text-white',
      borderCol: 'border-blue-200',
      headerBg: 'bg-blue-50/70',
      items: deadlines.filter((d) => d.status !== 'selesai' && d.priority === 'terjadwal'),
    },
    {
      id: 'selesai',
      title: 'Tugas Selesai',
      description: 'Tuntas dikerjakan & dikumpulkan',
      badgeBg: 'bg-emerald-500 text-white',
      borderCol: 'border-emerald-200',
      headerBg: 'bg-emerald-50/70',
      items: deadlines.filter((d) => d.status === 'selesai'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Matriks Prioritas & Kanban</h2>
          <p className="text-xs text-slate-500">
            Kelompokkan tugas berdasarkan tingkat urgensi untuk memaksimalkan fokus pengerjaan
          </p>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`bg-white rounded-2xl border ${col.borderCol} shadow-xs flex flex-col max-h-[750px]`}
          >
            {/* Column Header */}
            <div className={`p-4 rounded-t-2xl border-b ${col.borderCol} ${col.headerBg} flex items-center justify-between`}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">{col.title}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {col.items.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{col.description}</p>
              </div>

              {col.id !== 'selesai' && (
                <button
                  onClick={() => onAddNewWithPriority(col.id as Priority)}
                  className="p-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 shadow-xs transition"
                  title={`Tambah tugas ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Task Cards */}
            <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
              {col.items.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  Tidak ada tugas dalam kolom ini
                </div>
              ) : (
                col.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectDeadline(item)}
                    className="p-3.5 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-blue-300 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                        {item.category}
                      </span>
                      {item.emailReminder.enabled && (
                        <button
                          onClick={(e) => onQuickSendEmail(item, e)}
                          title="Kirim pengingat email sekarang"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 mt-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.courseName}</p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatDeadlineDate(item.dueDate, item.dueTime)}</span>
                      </div>

                      {/* Quick status cycle button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus: TaskStatus =
                            item.status === 'selesai' ? 'belum-dikerjakan' : 'selesai';
                          onUpdateStatus(item.id, nextStatus);
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                      >
                        {item.status === 'selesai' ? 'Buka Lagi' : 'Selesai ✓'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
