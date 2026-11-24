import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  LogOut, 
  RefreshCw, 
  RotateCcw, 
  Wrench, 
  Sparkles 
} from 'lucide-react';
import { StudentProfile, EmailLog } from '../types';
import { PWAInstallState } from '../hooks/usePWAInstall';
import { InstallAppButton } from './InstallAppButton';
import { Smartphone, Download as DownloadIcon, Globe, Shield, MessageSquare } from 'lucide-react';

interface TopHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  profile: StudentProfile;
  emailLogs: EmailLog[];
  onOpenMobileMenu: () => void;
  onOpenEmailCenter: () => void;
  onNavigateToSettings: () => void;
  onLogout?: () => void;
  onQuickRefresh?: () => void;
  onHardReload?: () => void;
  onResetData?: () => void;
  isRefreshing?: boolean;
  pwaState?: PWAInstallState;
  onOpenInstallModal?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenFeedbackModal?: () => void;
  isAdminMode?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  profile,
  emailLogs,
  onOpenMobileMenu,
  onOpenEmailCenter,
  onNavigateToSettings,
  onLogout,
  onQuickRefresh,
  onHardReload,
  onResetData,
  isRefreshing = false,
  pwaState,
  onOpenInstallModal,
  onOpenAdminPanel,
  onOpenFeedbackModal,
  isAdminMode = false,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);


  return (
    <header className="sticky top-0 z-30 bg-[#F4F7FC]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 border-b border-slate-200/60">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-200/70 transition"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input matching photo */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari deadline, tugas, atau kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs placeholder:text-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full px-1.5 py-0.5"
            >
              esc
            </button>
          )}
        </div>
      </div>

      {/* Right side: Install App, Email Reminder Center Button, Notification Bell, User dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA Install Button for PC & Mobile */}
        {pwaState && onOpenInstallModal && (
          <InstallAppButton
            pwaState={pwaState}
            onOpenModal={onOpenInstallModal}
            variant="topbar"
          />
        )}
        {/* Quick Email Status pill */}
        <button
          onClick={onOpenEmailCenter}
          className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 hover:bg-blue-100/70 transition shadow-xs"
          title="Buka Pusat Pengingat Email Mahasiswa"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Pengingat Email Aktif</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        {/* Kotak Saran & Masukan Mahasiswa */}
        {onOpenFeedbackModal && (
          <button
            type="button"
            onClick={onOpenFeedbackModal}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 hover:bg-purple-100 transition shadow-xs cursor-pointer"
            title="Kirimkan saran menu baru atau usulan desain tampilan ke Admin"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Kotak Saran</span>
          </button>
        )}

        {/* Panel Admin / Desain button */}
        {onOpenAdminPanel && (
          <button
            type="button"
            onClick={onOpenAdminPanel}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition shadow-xs cursor-pointer ${
              isAdminMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Buka Panel Admin: Tambah/Kurangi Menu & Edit Tampilan"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Panel Admin</span>
            {isAdminMode && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            )}
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowUserMenu(false);
              setShowRefreshMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition shadow-xs"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {emailLogs.length > 0 && (
              <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Notifikasi & Log Pengingat</h4>
                  <p className="text-[11px] text-slate-500">Terkirim ke {profile.email}</p>
                </div>
                <button
                  onClick={onOpenEmailCenter}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Buka Email Box
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {emailLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-slate-800 line-clamp-1">{log.deadlineTitle}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{log.previewSnippet}</p>
                      <span className="text-[10px] text-slate-400 mt-1 inline-block">
                        {new Date(log.sentAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl text-center">
                <button
                  onClick={() => {
                    setShowNotificationMenu(false);
                    onOpenEmailCenter();
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-blue-600 transition"
                >
                  Lihat Semua Riwayat Email & Preview Template →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fitur Segarkan & Pemulihan Bug (Refresh & Fix Bug) */}
        <div className="relative">
          <div className="flex items-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition overflow-hidden">
            <button
              onClick={() => {
                if (onQuickRefresh) onQuickRefresh();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition group cursor-pointer"
              title="Segarkan data & perbaiki bug tampilan langsung"
              aria-label="Segarkan Website"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition ${
                  isRefreshing ? 'animate-spin text-blue-600' : ''
                }`}
              />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
            <button
              onClick={() => {
                setShowRefreshMenu(!showRefreshMenu);
                setShowNotificationMenu(false);
                setShowUserMenu(false);
              }}
              className="px-1.5 py-1.5 border-l border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="Pilihan Pemulihan & Perbaikan Bug"
              aria-label="Menu Pilihan Segarkan"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh & Bug Recovery Dropdown */}
          {showRefreshMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    Pusat Segarkan & Perbaikan Bug
                  </h4>
                  <p className="text-[11px] text-slate-500">Pilihan jika website lambat atau macet</p>
                </div>
              </div>

              <div className="py-1">
                {/* 1. Quick Refresh */}
                <button
                  onClick={() => {
                    setShowRefreshMenu(false);
                    if (onQuickRefresh) onQuickRefresh();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-blue-50/60 flex items-start gap-3 transition group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      Segarkan Tampilan Cepat (Re-sync)
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Sinkronkan ulang data, hilangkan filter yang macet, dan update hitung mundur.
                    </p>
                  </div>
                </button>

                {/* 2. Reload Browser */}
                <button
                  onClick={() => {
                    setShowRefreshMenu(false);
                    if (onHardReload) {
                      onHardReload();
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-start gap-3 transition group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Muat Ulang Halaman (Reload)
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Memuat ulang browser untuk membersihkan cache script sementara.
                    </p>
                  </div>
                </button>

                {/* 3. Reset Corrupted Data */}
                <button
                  onClick={() => {
                    setShowRefreshMenu(false);
                    if (onResetData) onResetData();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-rose-50 flex items-start gap-3 transition group border-t border-slate-100 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-600 group-hover:text-white transition">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-600">
                      Perbaiki Bug & Pulihkan Data Awal
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Gunakan jika data rusak/hilang. Mereset ke jadwal resmi Oktober 2026 yang bersih.
                    </p>
                  </div>
                </button>
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl text-[10px] text-slate-400 text-center">
                Tekan tombol kapan saja jika website mengalami kendala teknis.
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching photo */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotificationMenu(false);
              setShowRefreshMenu(false);
            }}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 transition shadow-xs"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="hidden sm:inline text-xs font-semibold text-slate-800">{profile.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{profile.name}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{profile.email}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Mahasiswa Aktif
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateToSettings();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profil & Pengaturan Akun
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenEmailCenter();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  Kirim & Konfigurasi Email
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onQuickRefresh) onQuickRefresh();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2.5 font-medium cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  Segarkan Sistem & Data
                </button>
                {onOpenInstallModal && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenInstallModal();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-indigo-600 hover:bg-indigo-50 flex items-center gap-2.5 font-semibold cursor-pointer"
                  >
                    {pwaState?.isDesktop ? (
                      <Globe className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-indigo-500" />
                    )}
                    <span>{pwaState?.isDesktop ? 'Link Website PC & Akses HP' : 'Pasang Aplikasi di HP'}</span>
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 border-t border-slate-100 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Keluar (Logout)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tombol Simbol Logout Pintu Keluar di Pojok Kanan Atas */}
        {onLogout && (
          <button
            onClick={() => onLogout()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/90 text-xs font-bold transition shadow-xs cursor-pointer group"
            title="Keluar / Logout Mahasiswa (Kembali ke Halaman Login)"
            aria-label="Tombol Logout"
          >
            <LogOut className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        )}
      </div>
    </header>
  );
};
