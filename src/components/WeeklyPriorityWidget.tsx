import React from 'react';
import { DeadlineItem, Priority } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface WeeklyPriorityWidgetProps {
  deadlines: DeadlineItem[];
  onSelectPriority?: (p: Priority | null) => void;
  selectedPriority?: Priority | null;
}

export const WeeklyPriorityWidget: React.FC<WeeklyPriorityWidgetProps> = ({
  deadlines,
  onSelectPriority,
  selectedPriority,
}) => {
  const sangatMendesak = deadlines.filter(
    (d) => d.status !== 'selesai' && d.priority === 'sangat-mendesak'
  ).length;
  const mendesak = deadlines.filter(
    (d) => d.status !== 'selesai' && d.priority === 'mendesak'
  ).length;
  const terjadwal = deadlines.filter(
    (d) => d.status !== 'selesai' && d.priority === 'terjadwal'
  ).length;

  const maxVal = Math.max(sangatMendesak, mendesak, terjadwal, 5);

  const priorities: {
    id: Priority;
    label: string;
    count: number;
    barColor: string;
    dotColor: string;
    isBlueIcon?: boolean;
  }[] = [
    {
      id: 'sangat-mendesak',
      label: 'Sangat Mendesak',
      count: sangatMendesak,
      barColor: 'bg-[#EF4444]',
      dotColor: 'bg-[#EF4444]',
    },
    {
      id: 'mendesak',
      label: 'Mendesak',
      count: mendesak,
      barColor: 'bg-[#F97316]',
      dotColor: 'bg-[#F97316]',
    },
    {
      id: 'terjadwal',
      label: 'Terjadwal',
      count: terjadwal,
      barColor: 'bg-[#1E6BFF]',
      dotColor: 'bg-[#1E6BFF]',
      isBlueIcon: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">Prioritas Minggu Ini</h3>

      <div className="space-y-4">
        {priorities.map((item) => {
          const widthPct = item.count === 0 ? 0 : Math.min(100, Math.max(8, (item.count / maxVal) * 100));
          const isSelected = selectedPriority === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPriority?.(isSelected ? null : item.id)}
              className={`w-full text-left transition-all p-1 rounded-xl ${
                isSelected ? 'ring-2 ring-blue-500 bg-slate-50' : 'hover:bg-slate-50/80'
              }`}
            >
              {/* Label & Number */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  {item.isBlueIcon ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                  ) : (
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor} shrink-0`} />
                  )}
                  <span className="font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="font-bold text-slate-800">{item.count}</span>
              </div>

              {/* Progress Bar matching screenshot */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
