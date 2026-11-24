import React from 'react';
import { Download, Smartphone, Laptop, Sparkles, CheckCircle2, Globe, Link2, Copy, Check } from 'lucide-react';
import { PWAInstallState } from '../hooks/usePWAInstall';
import { getOfficialWebsiteUrl } from './InstallAppModal';

interface InstallAppButtonProps {
  pwaState: PWAInstallState;
  onOpenModal: () => void;
  variant?: 'topbar' | 'sidebar' | 'banner' | 'login';
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  pwaState,
  onOpenModal,
  variant = 'topbar',
}) => {
  const isPC = pwaState.isDesktop;

  const handleTopBarClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPC) {
      // On PC: Copy website link immediately for instant access, then open the modal
      try {
        navigator.clipboard.writeText(getOfficialWebsiteUrl());
      } catch {}
      onOpenModal();
      return;
    }

    if (pwaState.isInstalled) {
      onOpenModal();
      return;
    }

    // On Mobile/HP: attempt native install prompt if available
    if (pwaState.isInstallable && !pwaState.isIOS) {
      const installed = await pwaState.promptInstall();
      if (!installed) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  if (variant === 'topbar') {
    // If running on PC: Show "Link Website" button directly
    if (isPC) {
      return (
        <button
          onClick={handleTopBarClick}
          className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-extrabold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 border border-blue-400/30 ring-2 ring-blue-500/20"
          title="Salin & Buka Link Website DeadlineHub untuk PC / Laptop"
        >
          <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Globe className="w-3 h-3 text-white group-hover:rotate-12 transition-transform" />
          </div>
          
          <span className="tracking-tight">Link Website</span>

          <span className="inline-flex items-center text-[10px] bg-white/20 text-blue-100 px-1.5 py-0.5 rounded-md font-bold tracking-normal">
            PC
          </span>
        </button>
      );
    }

    // On Mobile/HP: If installed
    if (pwaState.isInstalled) {
      return (
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/90 text-xs font-bold shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
          title="Aplikasi DeadlineHub sudah terpasang. Klik untuk melihat panduan perangkat PC/HP lain."
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden sm:inline">Aplikasi Terpasang</span>
          <span className="sm:hidden">Terpasang</span>
        </button>
      );
    }

    // On Mobile/HP: Show "Instal Aplikasi"
    return (
      <button
        onClick={handleTopBarClick}
        className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-extrabold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 border border-blue-400/30 ring-2 ring-blue-500/20"
        title="Instal Aplikasi DeadlineHub di HP (Akses Cepat Langsung di Layar Utama)"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
        <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5" />
        
        <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Download className="w-3 h-3 text-white group-hover:-translate-y-0.5 transition-transform" />
        </div>
        
        <span className="hidden sm:inline tracking-tight">Instal Aplikasi</span>
        <span className="sm:hidden tracking-tight">Instal App</span>

        <span className="inline-flex items-center text-[10px] bg-white/20 text-blue-100 px-1.5 py-0.5 rounded-md font-bold tracking-normal">
          HP
        </span>
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="p-3 mx-3 my-2 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-blue-50 border border-blue-200/70">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            {isPC ? <Globe className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </div>
          <div>
            <p className="text-xs font-bold text-blue-950">
              {isPC ? 'Link Website PC' : 'Aplikasi PC & HP'}
            </p>
            <p className="text-[10px] text-blue-700">
              {isPC ? 'Akses langsung via browser' : 'Akses cepat tanpa browser'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenModal}
          className="w-full mt-1.5 py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          {isPC ? <Link2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isPC ? 'Lihat / Salin Link' : pwaState.isInstalled ? 'Petunjuk Perangkat' : 'Instal Aplikasi'}</span>
        </button>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            {isPC ? <Globe className="w-5 h-5 text-blue-100" /> : <Laptop className="w-5 h-5 text-blue-100" />}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>{isPC ? 'Tautan Resmi Website Portal DeadlineHub' : 'Bisa diakses & dipasang di PC dan HP!'}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </p>
            <p className="text-[11px] sm:text-xs text-blue-100/90">
              {isPC 
                ? 'Gunakan tautan website langsung di browser PC Anda, atau simpan ke bookmark.' 
                : 'Jadikan DeadlineHub aplikasi di layar desktop PC atau home screen HP Anda.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenModal}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isPC ? <Copy className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isPC ? 'Salin Link Website' : 'Pasang Sekarang'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Variant: login page
  return (
    <button
      onClick={onOpenModal}
      type="button"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold transition cursor-pointer"
    >
      {isPC ? <Globe className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
      <span>{isPC ? 'Link Website PC' : 'Pasang di HP'}</span>
    </button>
  );
};
