import React from 'react';
import { ClipboardList, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { DeadlineItem } from '../types';

interface StatCardsProps {
  deadlines: DeadlineItem[];
  selectedFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  deadlines,
  selectedFilter,
  onSelectFilter,
}) => {
  // Compute counts dynamically while keeping accurate default counts
  const total = deadlines.length;
  const urgentCount = deadlines.filter(
    (d) => d.status !== 'selesai' && (d.priority === 'sangat-mendesak' || d.priority === 'mendesak')
  ).length;
  const scheduledCount = deadlines.filter(
    (d) => d.status !== 'selesai' && d.priority === 'terjadwal'
  ).length;
  const completedCount = deadlines.filter((d) => d.status === 'selesai').length;

  const cards = [
    {
      id: 'all',
      title: 'Total Deadline',
      count: total,
      subtext: '+2 dari minggu lalu',
      bgColor: 'bg-[#F6F4FF]',
      borderColor: 'border-[#EDE9FE]',
      iconBg: 'bg-[#EDE9FE]',
      iconColor: 'text-[#7C3AED]',
      icon: ClipboardList,
    },
    {
      id: 'mendesak',
      title: 'Mendesak',
      count: urgentCount,
      subtext: '≤ 3 hari',
      bgColor: 'bg-[#FFF3F3]',
      borderColor: 'border-[#FEE2E2]',
      iconBg: 'bg-[#FEE2E2]',
      iconColor: 'text-[#EF4444]',
      icon: AlertTriangle,
    },
    {
      id: 'terjadwal',
      title: 'Terjadwal',
      count: scheduledCount,
      subtext: '4 - 7 hari',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-[#FEF3C7]',
      iconBg: 'bg-[#FEF3C7]',
      iconColor: 'text-[#F59E0B]',
      icon: Clock,
    },
    {
      id: 'selesai',
      title: 'Selesai',
      count: completedCount,
      subtext: `dari ${total} tugas`,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-[#DCFCE7]',
      iconBg: 'bg-[#DCFCE7]',
      iconColor: 'text-[#10B981]',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilter(isSelected ? null : card.id)}
            className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${card.bgColor} ${card.borderColor} ${
              isSelected ? 'ring-2 ring-blue-500 scale-[1.02]' : 'hover:-translate-y-0.5'
            }`}
          >
            {/* Top row: Icon */}
            <div className={`w-9 h-9 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <p className="text-xs font-semibold text-slate-700">{card.title}</p>

            {/* Big Number */}
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1 tracking-tight">
              {card.count}
            </p>

            {/* Subtext */}
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{card.subtext}</p>
          </button>
        );
      })}
    </div>
  );
};
