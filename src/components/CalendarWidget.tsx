import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { DeadlineItem } from '../types';
import { generateCalendarDays, monthNamesIndo } from '../utils/helpers';

interface CalendarWidgetProps {
  deadlines: DeadlineItem[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string | null) => void;
  onOpenFullCalendar?: () => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  deadlines,
  selectedDate,
  onSelectDate,
  onOpenFullCalendar,
}) => {
  // Set default to current real-world month: Oktober 2026 (Month index 9)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // Oktober (0-indexed: 9 = Oktober)

  const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
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

  // Map deadlines by date
  const deadlinesByDate = deadlines.reduce((acc, item) => {
    if (!acc[item.dueDate]) acc[item.dueDate] = [];
    acc[item.dueDate].push(item);
    return acc;
  }, {} as Record<string, DeadlineItem[]>);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Kalender</h3>
        {onOpenFullCalendar && (
          <button
            onClick={onOpenFullCalendar}
            title="Lihat Kalender Lengkap"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Buka Penuh ↗
          </button>
        )}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-slate-800">
          {monthNamesIndo[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekdays.map((day) => (
          <span key={day} className="text-[11px] font-semibold text-slate-400">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((cell, idx) => {
          const itemsOnDay = deadlinesByDate[cell.dateStr] || [];
          const hasUrgent = itemsOnDay.some(
            (d) => d.status !== 'selesai' && (d.priority === 'sangat-mendesak' || d.priority === 'mendesak')
          );
          const hasScheduled = itemsOnDay.some(
            (d) => d.status !== 'selesai' && d.priority === 'terjadwal'
          );
          const hasCompleted = itemsOnDay.some((d) => d.status === 'selesai');

          // Today date is 25 Oktober 2026
          const isToday = cell.dateStr === '2026-10-25' && !selectedDate;
          const isSelected = selectedDate === cell.dateStr || isToday;

          return (
            <button
              key={`${cell.dateStr}-${idx}`}
              onClick={() => {
                if (selectedDate === cell.dateStr) {
                  onSelectDate(null);
                } else {
                  onSelectDate(cell.dateStr);
                }
              }}
              className={`h-9 w-full flex flex-col items-center justify-center rounded-xl text-xs relative transition-all ${
                !cell.isCurrentMonth
                  ? 'text-slate-300 opacity-40'
                  : isSelected
                  ? 'bg-[#1E6BFF] text-white font-bold shadow-md shadow-blue-500/30'
                  : isToday
                  ? 'ring-2 ring-blue-500 text-blue-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-100 font-medium'
              }`}
            >
              <span>{cell.dayNumber}</span>

              {/* Event indicators dot underneath */}
              <div className="flex items-center gap-0.5 h-1.5 mt-0.5">
                {itemsOnDay.length > 0 && (
                  <>
                    {hasUrgent && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-rose-500'
                        }`}
                      />
                    )}
                    {hasScheduled && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-blue-200' : 'bg-amber-500'
                        }`}
                      />
                    )}
                    {hasCompleted && !hasUrgent && !hasScheduled && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-emerald-200' : 'bg-emerald-500'
                        }`}
                      />
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Filter: <strong className="text-slate-800">{selectedDate}</strong>
          </span>
          <button
            onClick={() => onSelectDate(null)}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
