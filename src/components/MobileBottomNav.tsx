import React from 'react';
import { Home, CalendarDays, Plus, Star, Settings, Mail, BellRing } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onOpenEmailCenter: () => void;
  onOpenAlarmCenter: () => void;
  unreadEmailCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenEmailCenter,
  onOpenAlarmCenter,
  unreadEmailCount,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {/* Dashboard */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition ${
          activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Dashboard</span>
      </button>

      {/* Kalender */}
      <button
        onClick={() => setActiveTab('kalender')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition ${
          activeTab === 'kalender' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <CalendarDays className="w-5 h-5 mb-0.5" />
        <span>Kalender</span>
      </button>

      {/* Center prominent Add Button */}
      <button
        onClick={onOpenAddModal}
        className="w-11 h-11 -mt-4 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition"
        aria-label="Tambah Deadline Baru"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Prioritas */}
      <button
        onClick={() => setActiveTab('prioritas')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition ${
          activeTab === 'prioritas' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Star className="w-5 h-5 mb-0.5" />
        <span>Prioritas</span>
      </button>

      {/* Alarm Center */}
      <button
        onClick={onOpenAlarmCenter}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold text-rose-600 hover:text-rose-700 transition"
      >
        <BellRing className="w-5 h-5 mb-0.5 animate-wiggle" />
        <span>Alarm</span>
      </button>

      {/* Email Center */}
      <button
        onClick={onOpenEmailCenter}
        className="relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <Mail className="w-5 h-5 mb-0.5" />
        <span>Email</span>
        {unreadEmailCount > 0 && (
          <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
        )}
      </button>
    </div>
  );
};
