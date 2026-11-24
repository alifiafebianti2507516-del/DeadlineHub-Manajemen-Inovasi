import React from 'react';
import { 
  Home, 
  PlusCircle, 
  CalendarDays, 
  Star, 
  BarChart2, 
  Settings, 
  LogOut,
  X,
  Mail,
  BellRing,
  RefreshCw,
  Globe,
  Smartphone,
  Shield,
  MessageSquare,
  BookOpen,
  Folder,
  Users,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { ActiveTab, StudentProfile, AppMenuItem, AppDisplayConfig } from '../types';
import { PWAInstallState } from '../hooks/usePWAInstall';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  openEmailCenter: () => void;
  openAlarmCenter: () => void;
  unreadEmailCount: number;
  onLogout: () => void;
  onRefresh?: () => void;
  pwaState?: PWAInstallState;
  onOpenInstallModal?: () => void;
  menuItems?: AppMenuItem[];
  displayConfig?: AppDisplayConfig;
  onOpenFeedbackModal?: () => void;
  onOpenAdminPanel?: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  home: Home,
  plus: PlusCircle,
  calendar: CalendarDays,
  star: Star,
  chart: BarChart2,
  settings: Settings,
  globe: Globe,
  book: BookOpen,
  folder: Folder,
  users: Users,
  message: MessageSquare,
  shield: Shield,
  link: LinkIcon,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  isOpenMobile,
  setIsOpenMobile,
  openEmailCenter,
  openAlarmCenter,
  unreadEmailCount,
  onLogout,
  onRefresh,
  pwaState,
  onOpenInstallModal,
  menuItems,
  displayConfig,
  onOpenFeedbackModal,
  onOpenAdminPanel,
}) => {
  // Use enabled menu items configured by Admin, or standard default
  const visibleNavItems = menuItems
    ? menuItems.filter((m) => m.enabled)
    : [
        { id: 'dashboard', label: 'Dashboard', icon: 'home', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'dashboard', order: 1 },
        { id: 'tambah', label: 'Tambah Deadline', icon: 'plus', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'tambah', order: 2 },
        { id: 'kalender', label: 'Kalender', icon: 'calendar', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'kalender', order: 3 },
        { id: 'prioritas', label: 'Prioritas', icon: 'star', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'prioritas', order: 4 },
        { id: 'progress', label: 'Progress', icon: 'chart', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'progress', order: 5 },
        { id: 'saran', label: 'Kotak Saran & Masukan', icon: 'message', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'saran', order: 6 },
        { id: 'pengaturan', label: 'Pengaturan', icon: 'settings', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'pengaturan', order: 7 },
        { id: 'admin', label: 'Panel Admin & Desain', icon: 'shield', enabled: true, isSystem: true, targetType: 'internal_tab' as const, internalTab: 'admin', badge: 'Admin', order: 8 },
      ];

  const handleNavClick = (item: any) => {
    setIsOpenMobile(false);

    if (item.targetType === 'external_url' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.id === 'admin') {
      setActiveTab('admin');
      return;
    }

    if (item.id === 'saran') {
      if (onOpenFeedbackModal) {
        onOpenFeedbackModal();
      } else {
        setActiveTab('saran');
      }
      return;
    }

    if (item.internalTab) {
      setActiveTab(item.internalTab);
    } else {
      setActiveTab(item.id);
    }
  };

  const appTitle = displayConfig?.appTitle || 'DeadlineHub';
  const appTagline = displayConfig?.appTagline || 'Satu Tempat, Semua Deadline.';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A1628] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:static lg:h-screen lg:shrink-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Icon with Official UM Seal */}
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 ring-2 ring-white/20">
                <img
                  src={displayConfig?.logoUrl || '/assets/aistudio/Lambang-UM-550x550_773f45e8.png'}
                  alt="Lambang UM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight truncate">{appTitle}</h1>
                <p className="text-[11px] text-slate-400 font-medium truncate" title={appTagline}>{appTagline}</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links - Dynamically managed by Admin */}
          <nav className="mt-8 space-y-1.5">
            {visibleNavItems.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || Globe;
              const isActive = activeTab === item.id || (item.internalTab && activeTab === item.internalTab);
              const isExternal = item.targetType === 'external_url';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#1E6BFF] text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.badge === 'Admin'
                          ? 'bg-amber-400 text-slate-950'
                          : isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isExternal && (
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Email & Alarm Section */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => {
                openEmailCenter();
                setIsOpenMobile(false);
              }}
              className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 hover:border-blue-500/40 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Notifikasi Email
                </span>
                {unreadEmailCount > 0 && (
                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                    {unreadEmailCount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {profile.email ? `Terhubung: ${profile.email.split('@')[0]}...` : 'Aktif'}
              </p>
            </button>

            {/* Quick Alarm Button */}
            <button
              onClick={() => {
                openAlarmCenter();
                setIsOpenMobile(false);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 hover:border-rose-500/50 transition group flex items-center justify-between cursor-pointer"
            >
              <span className="text-xs font-semibold text-rose-300 flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5 text-rose-400" />
                Jam Alarm Tugas
              </span>
              <span className="text-[10px] bg-rose-500/30 text-rose-300 font-bold px-1.5 py-0.5 rounded-md">
                Bunyi
              </span>
            </button>

            {/* Quick Refresh */}
            {onRefresh && (
              <button
                onClick={() => {
                  onRefresh();
                  setIsOpenMobile(false);
                }}
                className="w-full text-left p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/80 transition group flex items-center justify-between cursor-pointer"
                title="Segarkan data & perbaiki bug jika terjadi kendala"
              >
                <span className="text-xs font-medium text-slate-300 flex items-center gap-2 group-hover:text-blue-300 transition">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                  Segarkan Sistem
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                  Sync
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Website Link (PC) or Mobile App Promo Box */}
        {pwaState && onOpenInstallModal && (
          <div className="px-3 pb-2">
            <button
              onClick={() => {
                onOpenInstallModal();
                setIsOpenMobile(false);
              }}
              className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-950/60 to-blue-900/40 border border-blue-500/30 hover:border-blue-400 transition group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  {pwaState.isDesktop ? <Globe className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                    {pwaState.isDesktop ? 'Link Website PC' : 'Aplikasi HP'}
                  </p>
                  <p className="text-[10px] text-blue-300 truncate">
                    {pwaState.isDesktop 
                      ? 'Salin & Buka di Browser' 
                      : pwaState.isInstalled ? 'Sudah Terpasang' : 'Pasang / Unduh App'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* User Profile Card at Bottom */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-[#0F2038]/80 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
            />
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
              <p className="text-xs text-slate-400 truncate">{profile.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onLogout();
              setIsOpenMobile(false);
            }}
            title="Keluar / Logout Mahasiswa"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
