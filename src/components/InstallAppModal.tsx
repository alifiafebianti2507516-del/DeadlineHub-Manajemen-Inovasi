import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Apple, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Copy, 
  Sparkles, 
  Globe,
  Bookmark,
  Check
} from 'lucide-react';
import { PWAInstallState } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  pwaState: PWAInstallState;
}

export const getOfficialWebsiteUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')) {
    return window.location.origin;
  }
  return 'https://ais-pre-yoggihecwk2qzvhgd2bhy7-637040802885.asia-northeast1.run.app';
};

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  pwaState,
}) => {
  const [activeTab, setActiveTab] = useState<'pc' | 'android' | 'ios'>(() => {
    if (pwaState.isIOS) return 'ios';
    if (pwaState.isAndroid) return 'android';
    return 'pc';
  });
  const [copied, setCopied] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const websiteUrl = getOfficialWebsiteUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    setIsInstalling(true);
    try {
      const installed = await pwaState.promptInstall();
      if (installed) {
        onClose();
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Brand */}
        <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white overflow-hidden">
          {/* Subtle decoration circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 flex items-center justify-center ring-2 ring-white/30">
              <img src="/icon.svg" alt="DeadlineHub Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold text-blue-100 tracking-wide uppercase mb-1">
                <Globe className="w-3 h-3 text-amber-300" />
                Portal DeadlineHub UM
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {pwaState.isDesktop ? 'Link Website & Akses PC' : 'Aplikasi & Link Website'}
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                {pwaState.isDesktop 
                  ? 'Gunakan tautan website langsung di browser PC, atau pasang di HP'
                  : 'Buka via browser PC atau pasang sebagai aplikasi di smartphone Anda'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab selection for PC Website Link vs Mobile App */}
        <div className="p-6">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              onClick={() => setActiveTab('pc')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'pc'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Link Website (PC)</span>
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android (HP)</span>
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'ios'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>iPhone / iOS</span>
            </button>
          </div>

          {/* Tab Content: PC / Laptop Website Link */}
          {activeTab === 'pc' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Highlighted Website Link Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/60 border border-blue-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Tautan Resmi Website DeadlineHub
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Akses PC Tanpa Unduh
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-blue-200/80 font-mono text-xs text-slate-800 break-all select-all flex items-center justify-between gap-2 shadow-inner">
                  <span className="truncate">{websiteUrl}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span className="text-white">Link Website Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Link Website PC</span>
                      </>
                    )}
                  </button>

                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Buka link di tab baru"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Buka Tab Baru</span>
                  </a>
                </div>
              </div>

              {/* PC Browser Tips */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Simpan ke Bookmark Bar Browser PC</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-xs font-bold text-slate-800">Ctrl + D</kbd> (Windows) atau <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-xs font-bold text-slate-800">Cmd + D</kbd> (Mac) agar tautan website ini tersimpan langsung di bilah bookmark atas untuk akses cepat setiap saat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Cukup Buka di Browser Favorit Anda</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Di PC & Laptop, website ini berjalan lancar di Google Chrome, Microsoft Edge, Mozilla Firefox, dan Apple Safari tanpa perlu instalasi file apa pun.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional: PWA Standalone window in PC if user also wants it */}
              {pwaState.isInstallable && !pwaState.isInstalled && (
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 text-[11px]">
                    <span className="font-semibold text-slate-800">Ingin jendela mandiri di PC?</span> Bisa dipasang ke taskbar / desktop tanpa address bar.
                  </div>
                  <button
                    onClick={handleNativeInstall}
                    disabled={isInstalling}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isInstalling ? 'Memasang...' : 'Pasang di PC'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Android (HP) */}
          {activeTab === 'android' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-700">
                    Buka link website di browser <strong>Google Chrome</strong> pada HP Android Anda.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-700">
                    Bila banner muncul di bawah layar, tap <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Instal Aplikasi"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-slate-700">
                    Atau tap ikon <strong>titik tiga (⋮)</strong> di kanan atas Chrome, lalu pilih <strong>"Instal aplikasi"</strong>.
                  </p>
                </div>
              </div>

              {pwaState.isInstallable && !pwaState.isIOS && (
                <button
                  onClick={handleNativeInstall}
                  disabled={isInstalling}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalling ? 'Memasang Aplikasi...' : 'Instal Aplikasi ke HP Sekarang'}</span>
                </button>
              )}
            </div>
          )}

          {/* Tab Content: iPhone / iPad */}
          {activeTab === 'ios' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-700">
                    Buka link website menggunakan browser <strong>Safari</strong> di iPhone atau iPad.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                    Tap tombol <strong>Bagikan (Share)</strong>
                    <span className="inline-flex p-1 rounded bg-slate-200 text-slate-700">
                      <Share className="w-3.5 h-3.5" />
                    </span>
                    di bilah navigasi bawah Safari.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                    Gulir ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>
                    <span className="inline-flex p-1 rounded bg-slate-200 text-slate-700">
                      <PlusSquare className="w-3.5 h-3.5" />
                    </span>
                    , lalu tap <strong>Tambah (Add)</strong> di pojok kanan atas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Copy Link Row at bottom */}
          <div className="mt-5 p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-3">
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Tautan Web Resmi</p>
              <p className="text-xs font-mono text-slate-700 truncate">{websiteUrl}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50 transition shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
