import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DeadlineItem, Category } from '../types';
import { generateCalendarDays, monthNamesIndo, formatDeadlineDate } from '../utils/helpers';

interface FullCalendarViewProps {
  deadlines: DeadlineItem[];
  onSelectDeadline: (item: DeadlineItem) => void;
  onAddNewDeadlineOnDate: (dateStr: string) => void;
}

export const FullCalendarView: React.FC<FullCalendarViewProps> = ({
  deadlines,
  onSelectDeadline,
  onAddNewDeadlineOnDate,
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // Oktober 2026 (0-indexed: 9 = Oktober)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const weekdays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToCurrentMonth = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
  };

  // Filter deadlines
  const filteredDeadlines = deadlines.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  const deadlinesByDate = filteredDeadlines.reduce((acc, item) => {
    if (!acc[item.dueDate]) acc[item.dueDate] = [];
    acc[item.dueDate].push(item);
    return acc;
  }, {} as Record<string, DeadlineItem[]>);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'Matakuliah', label: 'Matakuliah' },
    { id: 'Organisasi', label: 'Organisasi' },
    { id: 'Administrasi', label: 'Administrasi' },
    { id: 'Proyek', label: 'Proyek' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Kalender Interaktif</h2>
            <p className="text-xs text-slate-500">Visualisasi jadwal deadline dan agenda perkuliahan</p>
          </div>
        </div>

        {/* Month Navigation & Category Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-36 text-center">
              {monthNamesIndo[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleJumpToCurrentMonth}
            className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition"
          >
            Okt 2026 (Hari Ini)
          </button>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center">
          {weekdays.map((day) => (
            <div key={day} className="py-2.5 text-xs font-bold text-slate-600">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[580px]">
          {calendarDays.map((cell, idx) => {
            const items = deadlinesByDate[cell.dateStr] || [];
            const isToday = cell.dateStr === '2026-10-25'; // current real-world date

            return (
              <div
                key={`${cell.dateStr}-${idx}`}
                className={`min-h-[95px] sm:min-h-[110px] p-1.5 sm:p-2 transition flex flex-col justify-between group ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/50 text-slate-300'
                    : isToday
                    ? 'bg-blue-50/30'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-300'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.isCurrentMonth && (
                    <button
                      onClick={() => onAddNewDeadlineOnDate(cell.dateStr)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-blue-600 hover:bg-blue-100 transition"
                      title="Tambah deadline di tanggal ini"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Deadlines badges inside cell */}
                <div className="space-y-1 overflow-y-auto max-h-[75px] scrollbar-thin">
                  {items.map((item) => {
                    const isUrgent = item.priority === 'sangat-mendesak' || item.priority === 'mendesak';
                    const isDone = item.status === 'selesai';

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectDeadline(item)}
                        className={`w-full text-left p-1 rounded-md text-[10px] sm:text-[11px] leading-tight truncate block border transition ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 line-through opacity-70'
                            : item.priority === 'sangat-mendesak'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                            : item.priority === 'mendesak'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                            : 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                        }`}
                      >
                        <span className="font-bold">{item.dueTime}</span> {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
