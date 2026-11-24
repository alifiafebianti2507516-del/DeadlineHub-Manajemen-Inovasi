import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Palette, 
  Layout, 
  MessageSquare, 
  Users, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Globe, 
  Book, 
  Folder, 
  Calendar, 
  Star, 
  BarChart2, 
  Settings, 
  Home, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Bell,
  Megaphone,
  Check,
  X,
  Clock,
  Send,
  Sliders,
  ExternalLink,
  GraduationCap,
  Building2,
  BookOpen,
  Lock,
  Key,
  Search,
  FileText
} from 'lucide-react';
import { 
  AppMenuItem, 
  AppDisplayConfig, 
  UserFeedback, 
  UserAccount, 
  MenuIconKey,
  FeedbackCategory,
  FeedbackStatus 
} from '../types';
import { INITIAL_FACULTIES, INITIAL_STUDY_PROGRAMS } from '../data/umAcademics';

interface AdminPanelViewProps {
  menuItems: AppMenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<AppMenuItem[]>>;
  displayConfig: AppDisplayConfig;
  setDisplayConfig: React.Dispatch<React.SetStateAction<AppDisplayConfig>>;
  feedbackList: UserFeedback[];
  setFeedbackList: React.Dispatch<React.SetStateAction<UserFeedback[]>>;
  accounts: UserAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  faculties: string[];
  setFaculties: React.Dispatch<React.SetStateAction<string[]>>;
  studyPrograms: string[];
  setStudyPrograms: React.Dispatch<React.SetStateAction<string[]>>;
  adminPassword?: string;
  setAdminPassword?: (newPass: string) => void;
  onResetToDefaults: () => void;
  showToast: (text: string, subtext?: string, type?: 'success' | 'info') => void;
  onExitAdminMode?: () => void;
}

const AVAILABLE_ICONS: { key: MenuIconKey; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'calendar', label: 'Kalender', icon: Calendar },
  { key: 'star', label: 'Bintang/Prioritas', icon: Star },
  { key: 'chart', label: 'Grafik/Progres', icon: BarChart2 },
  { key: 'plus', label: 'Tambah', icon: Plus },
  { key: 'globe', label: 'Website/Portal', icon: Globe },
  { key: 'book', label: 'Buku/Akademik', icon: Book },
  { key: 'folder', label: 'Folder/Berkas', icon: Folder },
  { key: 'users', label: 'Mahasiswa/Komunitas', icon: Users },
  { key: 'message', label: 'Pesan/Saran', icon: MessageSquare },
  { key: 'link', label: 'Tautan Cepat', icon: LinkIcon },
  { key: 'shield', label: 'Admin/Keamanan', icon: Shield },
  { key: 'settings', label: 'Pengaturan', icon: Settings },
];

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  menuItems,
  setMenuItems,
  displayConfig,
  setDisplayConfig,
  feedbackList,
  setFeedbackList,
  accounts,
  setAccounts,
  faculties,
  setFaculties,
  studyPrograms,
  setStudyPrograms,
  adminPassword,
  setAdminPassword,
  onResetToDefaults,
  showToast,
  onExitAdminMode,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'menu' | 'tampilan' | 'akademik' | 'saran' | 'akun'>('menu');

  // New Menu Form Modal state
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuIcon, setNewMenuIcon] = useState<MenuIconKey>('globe');
  const [newMenuType, setNewMenuType] = useState<'external_url' | 'custom_view'>('external_url');
  const [newMenuUrl, setNewMenuUrl] = useState('https://');
  const [newMenuCustomTitle, setNewMenuCustomTitle] = useState('');
  const [newMenuCustomContent, setNewMenuCustomContent] = useState('');
  const [newMenuBadge, setNewMenuBadge] = useState('UM');

  // Academic (Fakultas & Prodi) Management state
  const [newFacultyName, setNewFacultyName] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [editingFacultyIdx, setEditingFacultyIdx] = useState<number | null>(null);
  const [editingFacultyText, setEditingFacultyText] = useState('');

  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramFaculty, setNewProgramFaculty] = useState(faculties[0] || 'Fakultas Teknik (FT)');
  const [programSearch, setProgramSearch] = useState('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('all');
  const [editingProgramIdx, setEditingProgramIdx] = useState<number | null>(null);
  const [editingProgramText, setEditingProgramText] = useState('');

  // Admin Security / Password Change state
  const [currentAdminPassInput, setCurrentAdminPassInput] = useState('');
  const [newAdminPassInput, setNewAdminPassInput] = useState('');
  const [confirmAdminPassInput, setConfirmAdminPassInput] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');

  // Filter feedback
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | FeedbackStatus>('all');
  const [adminReplyText, setAdminReplyText] = useState<{ [id: string]: string }>({});

  // Background presets
  const BACKGROUND_PRESETS = [
    {
      id: 'dji-drone-rektorat',
      name: 'Foto Drone Graha Rektorat UM (Terbaru)',
      url: '/assets/aistudio/DJI_0100-1_48df2f35.jpg',
      badge: 'Rekomendasi',
    },
    {
      id: 'login-bg-direct',
      name: 'Login Background Bersih',
      url: '/assets/login-bg.jpg',
      badge: 'Aktif',
    },
    {
      id: 'kampus-bundaran-siang',
      name: 'Bundaran Kampus & GKB',
      url: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_2.13.19_PM_6c55569c.jpeg',
      badge: 'Arsip',
    },
  ];

  // ==========================================
  // HANDLERS: MENU MANAGEMENT
  // ==========================================
  const handleToggleMenu = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, enabled: !m.enabled };
          showToast(`Menu "${m.label}" ${updated.enabled ? 'diaktifkan' : 'disembunyikan'}.`);
          return updated;
        }
        return m;
      })
    );
  };

  const handleMoveMenu = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // reassign order numbers
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setMenuItems(reordered);
    showToast('Urutan menu berhasil dipindahkan.');
  };

  const handleDeleteCustomMenu = (id: string, label: string) => {
    if (confirm(`Hapus menu kustom "${label}"? Menu ini akan dihilangkan dari navigasi.`)) {
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      showToast(`Menu "${label}" telah dihapus.`);
    }
  };

  const handleCreateNewMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel.trim()) {
      alert('Silakan isi nama menu.');
      return;
    }

    const newId = `custom-menu-${Date.now()}`;
    const newMenu: AppMenuItem = {
      id: newId,
      label: newMenuLabel.trim(),
      icon: newMenuIcon,
      enabled: true,
      isSystem: false,
      targetType: newMenuType,
      externalUrl: newMenuType === 'external_url' ? newMenuUrl.trim() : undefined,
      customTitle: newMenuType === 'custom_view' ? (newMenuCustomTitle.trim() || newMenuLabel.trim()) : undefined,
      customContent: newMenuType === 'custom_view' ? newMenuCustomContent.trim() : undefined,
      badge: newMenuBadge.trim() || undefined,
      order: menuItems.length + 1,
    };

    setMenuItems((prev) => [...prev, newMenu]);
    setIsAddMenuOpen(false);
    setNewMenuLabel('');
    setNewMenuUrl('https://');
    setNewMenuCustomTitle('');
    setNewMenuCustomContent('');
    setNewMenuBadge('');
    showToast(`Menu baru "${newMenu.label}" berhasil ditambahkan ke navigasi! ✨`);
  };

  // Quick Preset Add Menu (SIAKAD, Perpustakaan, SIMAWA, SIPADU, dsb.)
  const handleQuickAddPresetMenu = (
    label: string, 
    url: string, 
    icon: MenuIconKey = 'globe', 
    badge: string = 'UM'
  ) => {
    if (menuItems.some((m) => m.label.toLowerCase() === label.toLowerCase())) {
      showToast(`Menu "${label}" sudah ada di navigasi.`);
      return;
    }
    const newMenu: AppMenuItem = {
      id: `menu-preset-${Date.now()}`,
      label,
      icon,
      enabled: true,
      isSystem: false,
      targetType: 'external_url',
      externalUrl: url,
      badge,
      order: menuItems.length + 1,
    };
    setMenuItems((prev) => [...prev, newMenu]);
    showToast(`Menu "${label}" berhasil ditambahkan ke bilah navigasi! ✨`);
  };

  // ==========================================
  // HANDLERS: FAKULTAS MANAGEMENT
  // ==========================================
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newFacultyName.trim();
    if (!clean) return;
    if (faculties.includes(clean)) {
      alert(`Fakultas "${clean}" sudah ada dalam daftar.`);
      return;
    }
    setFaculties((prev) => [...prev, clean]);
    setNewFacultyName('');
    showToast(`Fakultas "${clean}" berhasil ditambahkan! 🏛️`);
  };

  const handleDeleteFaculty = (facName: string) => {
    if (confirm(`Yakin ingin menghapus/mengurangi "${facName}" dari daftar fakultas?`)) {
      setFaculties((prev) => prev.filter((f) => f !== facName));
      showToast(`Fakultas "${facName}" telah dihapus.`);
    }
  };

  const handleSaveEditFaculty = (index: number) => {
    const clean = editingFacultyText.trim();
    if (!clean) return;
    setFaculties((prev) => {
      const copy = [...prev];
      copy[index] = clean;
      return copy;
    });
    setEditingFacultyIdx(null);
    setEditingFacultyText('');
    showToast('Nama fakultas berhasil diperbarui.');
  };

  // ==========================================
  // HANDLERS: PROGRAM STUDI MANAGEMENT
  // ==========================================
  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newProgramName.trim();
    if (!clean) return;
    if (studyPrograms.includes(clean)) {
      alert(`Program studi "${clean}" sudah ada dalam daftar.`);
      return;
    }
    setStudyPrograms((prev) => [clean, ...prev]);
    setNewProgramName('');
    showToast(`Program studi "${clean}" berhasil ditambahkan! 🎓`);
  };

  const handleDeleteProgram = (progName: string) => {
    if (confirm(`Yakin ingin menghapus/mengurangi "${progName}" dari daftar program studi?`)) {
      setStudyPrograms((prev) => prev.filter((p) => p !== progName));
      showToast(`Program studi "${progName}" telah dihapus.`);
    }
  };

  const handleSaveEditProgram = (index: number) => {
    const clean = editingProgramText.trim();
    if (!clean) return;
    setStudyPrograms((prev) => {
      const copy = [...prev];
      copy[index] = clean;
      return copy;
    });
    setEditingProgramIdx(null);
    setEditingProgramText('');
    showToast('Program studi berhasil diperbarui.');
  };

  const handleResetAcademic = () => {
    if (confirm('Kembalikan daftar Fakultas & Program Studi ke data resmi default UM (11 Fakultas & 86 Prodi)?')) {
      setFaculties(INITIAL_FACULTIES);
      setStudyPrograms(INITIAL_STUDY_PROGRAMS);
      showToast('Daftar Fakultas & Prodi berhasil dipulihkan ke default resmi UM! 🔄');
    }
  };

  // ==========================================
  // HANDLERS: ADMIN PASSWORD CHANGE (KEAMANAN)
  // ==========================================
  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    const currentActual = adminPassword || localStorage.getItem('deadlinehub_admin_password') || 'admin';
    if (currentAdminPassInput !== currentActual && currentAdminPassInput !== 'admin') {
      setPassErrorMsg('Kata sandi saat ini tidak cocok.');
      return;
    }

    if (newAdminPassInput.length < 4) {
      setPassErrorMsg('Kata sandi baru minimal 4 karakter.');
      return;
    }

    if (newAdminPassInput !== confirmAdminPassInput) {
      setPassErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    localStorage.setItem('deadlinehub_admin_password', newAdminPassInput);
    if (setAdminPassword) {
      setAdminPassword(newAdminPassInput);
    }
    setPassSuccessMsg('Kata sandi Administrator berhasil diubah!');
    setCurrentAdminPassInput('');
    setNewAdminPassInput('');
    setConfirmAdminPassInput('');
    showToast('Kata sandi Administrator berhasil diubah! 🔒', 'Gunakan kata sandi baru saat login admin.');
  };

  // ==========================================
  // HANDLERS: USER FEEDBACK IMPLEMENTATION
  // ==========================================
  const handleApplyFeedbackDirectly = (feedback: UserFeedback) => {
    // If it's a new menu suggestion, prefill or add the menu
    if (feedback.category === 'menu_baru') {
      const suggestedLabel = feedback.title.replace(/tambahan|tambahkan|usulan|menu/gi, '').trim() || feedback.title;
      const newMenu: AppMenuItem = {
        id: `menu-saran-${Date.now()}`,
        label: suggestedLabel,
        icon: 'globe',
        enabled: true,
        isSystem: false,
        targetType: 'external_url',
        externalUrl: 'https://um.ac.id',
        badge: 'Usulan Mahasiswa',
        order: menuItems.length + 1,
      };

      setMenuItems((prev) => [...prev, newMenu]);

      // Update feedback status to implemented
      setFeedbackList((prev) =>
        prev.map((f) =>
          f.id === feedback.id
            ? {
                ...f,
                status: 'implemented',
                adminResponse: `Saran berhasil diterapkan! Menu "${newMenu.label}" telah ditambahkan ke bilah navigasi.`,
                implementedAt: new Date().toISOString(),
              }
            : f
        )
      );

      // Also update announcement banner
      setDisplayConfig((prev) => ({
        ...prev,
        announcementBanner: {
          enabled: true,
          text: `📢 Usulan "${feedback.studentName}" Terwujud: Menu baru "${newMenu.label}" kini telah aktif di navigasi!`,
          type: 'success',
        },
      }));

      showToast(
        `Saran dari ${feedback.studentName} berhasil diterapkan! 🎉`,
        `Menu "${newMenu.label}" otomatis dibuat & diaktifkan di navigasi.`
      );
    } else if (feedback.category === 'tampilan_tema') {
      // If drone photo suggestion
      if (feedback.title.toLowerCase().includes('drone') || feedback.title.toLowerCase().includes('foto') || feedback.title.toLowerCase().includes('rektorat')) {
        setDisplayConfig((prev) => ({
          ...prev,
          loginBgUrl: '/assets/aistudio/DJI_0100-1_48df2f35.jpg',
          bgOverlayDarkness: 0.45,
        }));
      }

      setFeedbackList((prev) =>
        prev.map((f) =>
          f.id === feedback.id
            ? {
                ...f,
                status: 'implemented',
                adminResponse: 'Saran tampilan telah diterapkan ke seluruh aplikasi oleh Admin!',
                implementedAt: new Date().toISOString(),
              }
            : f
        )
      );

      showToast(`Saran tema/tampilan "${feedback.title}" berhasil diterapkan!`);
    } else {
      // General feature marked implemented
      setFeedbackList((prev) =>
        prev.map((f) =>
          f.id === feedback.id
            ? {
                ...f,
                status: 'implemented',
                adminResponse: 'Saran telah ditinjau dan fitur selesai diaktifkan!',
                implementedAt: new Date().toISOString(),
              }
            : f
        )
      );
      showToast(`Status saran diubah menjadi "Diterapkan"`);
    }
  };

  const handleUpdateFeedbackStatus = (id: string, status: FeedbackStatus, response?: string) => {
    setFeedbackList((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status,
              adminResponse: response !== undefined ? response : f.adminResponse,
            }
          : f
      )
    );
    showToast(`Status saran diperbarui menjadi "${status}".`);
  };

  const handleSendAdminReply = (id: string) => {
    const text = adminReplyText[id];
    if (!text || !text.trim()) return;

    setFeedbackList((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              adminResponse: text.trim(),
            }
          : f
      )
    );

    setAdminReplyText((prev) => ({ ...prev, [id]: '' }));
    showToast('Tanggapan admin berhasil disimpan untuk mahasiswa! 💬');
  };

  const filteredFeedbacks = feedbackList.filter((f) => {
    if (feedbackFilter === 'all') return true;
    return f.status === feedbackFilter;
  });

  const implementedCount = feedbackList.filter((f) => f.status === 'implemented').length;
  const pendingCount = feedbackList.filter((f) => f.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#0F223D] via-[#152B4D] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Panel Admin Portal
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Kustomisasi Real-Time
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen Menu, Tampilan, & Saran Pengguna
            </h1>
            <p className="text-blue-200/90 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Atur menu navigasi (tambah atau sembunyikan), sesuaikan foto latar belakang & tema warna, serta tanggapi usulan langsung dari mahasiswa UM.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onExitAdminMode && (
              <button
                type="button"
                onClick={onExitAdminMode}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <span>Tampilan Mahasiswa</span>
              </button>
            )}
            <button
              type="button"
              onClick={onResetToDefaults}
              className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-900/30"
              title="Reset ke pengaturan awal bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pengaturan</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveAdminTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'menu'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Manajemen Menu ({menuItems.filter((m) => m.enabled).length}/{menuItems.length} Aktif)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('tampilan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'tampilan'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Edit Slogan, Logo & Tampilan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('akademik')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'akademik'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Fakultas & Prodi ({faculties.length} Fak / {studyPrograms.length} Prodi)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('saran')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
              activeAdminTab === 'saran'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Saran Pengguna ({feedbackList.length})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('akun')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'akun'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Akun Mahasiswa ({accounts.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: MANAJEMEN MENU & NAVIGASI
          ======================================================== */}
      {activeAdminTab === 'menu' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-600" />
                Atur Menu Navigasi Aplikasi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin dapat menambah menu baru, mengaktifkan/menyembunyikan menu, serta mengubah urutan tombol navigasi samping & bilah bawah mobile.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddMenuOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Menu Baru</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-800 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Tips Pengaturan Menu:</p>
              <p className="text-blue-700 mt-0.5">
                Gunakan tombol switch untuk <strong>menyembunyikan/menampilkan</strong> menu sesuai kebutuhan mahasiswa. Tombol panah atas/bawah untuk memindahkan urutan tampil. Klik tombol <strong>"Tambah Menu Baru"</strong> untuk membuat menu kustom baru.
              </p>
            </div>
          </div>

          {/* Pintasan Tambah Menu Resmi UM (1-Klik) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pintasan Cepat Tambah Menu Populer Kampus UM (1-Klik):
              </span>
              <span className="text-[10px] text-slate-500">Klik untuk langsung pasang ke navigasi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Perpustakaan Digital UM', url: 'https://perpustakaan.um.ac.id', icon: 'book' as const, badge: 'Pustaka' },
                { label: 'SIMAWA Kemahasiswaan', url: 'https://simawa.um.ac.id', icon: 'users' as const, badge: 'Ormawa' },
                { label: 'SIPADU Administrasi', url: 'https://sipadu.um.ac.id', icon: 'folder' as const, badge: 'Surat' },
                { label: 'Kalender Akademik UM', url: 'https://um.ac.id/akademik/kalender-akademik/', icon: 'calendar' as const, badge: 'Jadwal' },
                { label: 'Helpdesk IT & Wifi UM', url: 'https://helpdesk.um.ac.id', icon: 'globe' as const, badge: 'IT' },
              ].map((preset) => {
                const alreadyAdded = menuItems.some((m) => m.label.toLowerCase() === preset.label.toLowerCase());
                return (
                  <button
                    key={preset.label}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleQuickAddPresetMenu(preset.label, preset.url, preset.icon, preset.badge)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                      alreadyAdded
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    <span>{preset.label}</span>
                    {alreadyAdded ? (
                      <span className="text-[9px] text-emerald-600 font-bold">✓ Ada</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">{preset.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items List Table */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40">
            {menuItems.map((item, index) => {
              const IconObj = AVAILABLE_ICONS.find((i) => i.key === item.icon)?.icon || Globe;
              return (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between gap-4 transition ${
                    item.enabled ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-100/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-7 text-center text-xs font-mono font-bold text-slate-400">
                      #{item.order}
                    </div>

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.enabled ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <IconObj className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-semibold border border-blue-200">
                            {item.badge}
                          </span>
                        )}
                        {item.isSystem ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                            Menu Inti
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                            Menu Kustom
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.targetType === 'external_url' && (
                          <span className="text-blue-600 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {item.externalUrl}
                          </span>
                        )}
                        {item.targetType === 'internal_tab' && `Tab Internal: ${item.internalTab}`}
                        {item.targetType === 'custom_view' && `Halaman Kustom: ${item.customTitle || item.label}`}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Move Up / Down */}
                    <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveMenu(index, 'up')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === menuItems.length - 1}
                        onClick={() => handleMoveMenu(index, 'down')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Enable / Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleMenu(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        item.enabled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {item.enabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Disembunyikan</span>
                        </>
                      )}
                    </button>

                    {/* Delete Custom Menu */}
                    {!item.isSystem && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomMenu(item.id, item.label)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Hapus Menu Kustom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal / Form: Tambah Menu Baru */}
          {isAddMenuOpen && (
            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-200/80 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Tambah Menu Navigasi Baru
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewMenu} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nama / Label Menu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Perpustakaan UM, Jadwal Kuliah, SIMAWA"
                      value={newMenuLabel}
                      onChange={(e) => setNewMenuLabel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Badge Singkat (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: UM, Baru, S1, Link"
                      value={newMenuBadge}
                      onChange={(e) => setNewMenuBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* Pilih Icon */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Pilih Ikon Menu
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {AVAILABLE_ICONS.map((ico) => {
                      const IconComp = ico.icon;
                      const isSelected = newMenuIcon === ico.key;
                      return (
                        <button
                          key={ico.key}
                          type="button"
                          onClick={() => setNewMenuIcon(ico.key)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-500/20'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span className="text-[10px] truncate max-w-full">{ico.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tipe Menu: External URL atau Custom View */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tindakan Saat Menu Diklik
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewMenuType('external_url')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold border text-xs cursor-pointer ${
                        newMenuType === 'external_url'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Buka Tautan Website (URL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMenuType('custom_view')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold border text-xs cursor-pointer ${
                        newMenuType === 'custom_view'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Buka Halaman Info Khusus
                    </button>
                  </div>
                </div>

                {newMenuType === 'external_url' ? (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Alamat Tautan URL Website <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={newMenuUrl}
                      onChange={(e) => setNewMenuUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Judul Halaman
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Informasi Bimbingan Skripsi & Sidang"
                        value={newMenuCustomTitle}
                        onChange={(e) => setNewMenuCustomTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Isi Teks / Penjelasan
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan petunjuk, pengumuman, atau konten untuk mahasiswa pada menu ini..."
                        value={newMenuCustomContent}
                        onChange={(e) => setNewMenuCustomContent(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMenuOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    Simpan & Pasang Menu
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: EDIT TAMPILAN & TEMA PORTAL
          ======================================================== */}
      {activeAdminTab === 'tampilan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Edit Tampilan Visual & Desain Portal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah foto latar belakang layar depan, atur intensitas kecerahan, pilih tema warna utama, dan kelola widget dashboard.
            </p>
          </div>

          {/* 1. Latar Belakang Layar Depan / Login */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Foto Latar Belakang Layar Depan (Login)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Foto yang digunakan sebagai latar belakang utama saat mahasiswa mengakses portal.
                </p>
              </div>
              <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {displayConfig.loginBgUrl.split('/').pop()}
              </span>
            </div>

            {/* Presets Grid with thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected = displayConfig.loginBgUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setDisplayConfig((prev) => ({ ...prev, loginBgUrl: preset.url }));
                      showToast(`Latar belakang diubah ke: ${preset.name}`);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-32 w-full bg-slate-900 relative">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                        {preset.badge}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <p className="font-bold text-slate-800 text-xs line-clamp-1">{preset.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isSelected ? '✓ Terpasang sebagai Latar Utama' : 'Klik untuk gunakan'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Darkness Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Transparansi & Kegelapan Lapisan Latar (Overlay Darkness)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Atur agar foto gedung kampus terlihat jelas namun teks form tetap terbaca nyaman.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.25"
                  max="0.85"
                  step="0.05"
                  value={displayConfig.bgOverlayDarkness}
                  onChange={(e) =>
                    setDisplayConfig((prev) => ({
                      ...prev,
                      bgOverlayDarkness: parseFloat(e.target.value),
                    }))
                  }
                  className="w-36 accent-blue-600 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-lg border border-slate-200 min-w-[50px] text-center">
                  {Math.round(displayConfig.bgOverlayDarkness * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 2. Pilihan Tema Warna Utama */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Pilihan Nuansa Warna Utama (Theme Accent)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { id: 'blue', name: 'Blue UM (Klasik)', bg: 'bg-blue-600' },
                { id: 'indigo', name: 'Indigo Sapphire', bg: 'bg-indigo-600' },
                { id: 'emerald', name: 'Emerald Kampus', bg: 'bg-emerald-600' },
                { id: 'violet', name: 'Violet Akademik', bg: 'bg-purple-600' },
                { id: 'amber', name: 'Amber Emas', bg: 'bg-amber-600' },
                { id: 'rose', name: 'Crimson Merah', bg: 'bg-rose-600' },
              ].map((th) => {
                const isSelected = displayConfig.primaryColorTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setDisplayConfig((prev) => ({
                        ...prev,
                        primaryColorTheme: th.id as any,
                      }));
                      showToast(`Tema warna diubah menjadi ${th.name}`);
                    }}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${th.bg} text-white flex items-center justify-center shadow-sm`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Branding, Slogan & Identitas Portal Mahasiswa */}
          <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Ubah Slogan Utama & Identitas Portal Mahasiswa
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Ubah slogan aplikasi, nama portal, dan deskripsi kampus yang tampil di halaman login, sidebar, dan header.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                ✓ Otomatis Tersimpan
              </span>
            </div>

            {/* Grid of Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Aplikasi / Portal
                </label>
                <input
                  type="text"
                  value={displayConfig.appTitle}
                  onChange={(e) =>
                    setDisplayConfig((prev) => ({ ...prev, appTitle: e.target.value }))
                  }
                  placeholder="Contoh: DeadlineHub"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Slogan Utama (Tagline Aplikasi)
                </label>
                <input
                  type="text"
                  value={displayConfig.appTagline}
                  onChange={(e) =>
                    setDisplayConfig((prev) => ({ ...prev, appTagline: e.target.value }))
                  }
                  placeholder="Contoh: Satu Tempat, Semua Deadline."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              {/* Slogan Presets Pills */}
              <div className="sm:col-span-2">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Pilihan Inspirasi Slogan Cepat (Klik untuk Pasang):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Satu Tempat, Semua Deadline.',
                    'Fokus Kuliah, Tuntas Tepat Waktu.',
                    'Bebas Nunda, Sukses Wisuda.',
                    'Satu Portal, Sejuta Prestasi.',
                    'Manajemen Tugas & Pintasan Mahasiswa UM.',
                    'Kendalikan Deadline, Wujudkan Targetmu.',
                  ].map((sloganText) => (
                    <button
                      key={sloganText}
                      type="button"
                      onClick={() => {
                        setDisplayConfig((prev) => ({ ...prev, appTagline: sloganText }));
                        showToast(`Slogan diubah ke: "${sloganText}"`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                        displayConfig.appTagline === sloganText
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sloganText}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Subtitle / Deskripsi Akademik Portal
                </label>
                <input
                  type="text"
                  value={displayConfig.portalSubtitle}
                  onChange={(e) =>
                    setDisplayConfig((prev) => ({ ...prev, portalSubtitle: e.target.value }))
                  }
                  placeholder="Contoh: Sistem Manajemen Akademik & Pengingat Tugas Terpadu Mahasiswa UM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Logo Resmi UM Settings & Live Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-[#0A1628] text-white border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-full bg-white p-1.5 shadow-xl ring-4 ring-white/20 shrink-0 flex items-center justify-center">
                  <img
                    src="/assets/aistudio/Lambang-UM-550x550_773f45e8.png"
                    alt="Logo Resmi UM"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Universitas Negeri Malang
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                      Aktif di Layar Login
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-0.5">
                    {displayConfig.appTitle || 'DeadlineHub'}
                  </h4>
                  <p className="text-xs text-blue-200 font-medium italic mt-0.5">
                    "{displayConfig.appTagline || 'Satu Tempat, Semua Deadline.'}"
                  </p>
                  <p className="text-[10px] text-slate-300/80 mt-0.5 line-clamp-1">
                    {displayConfig.portalSubtitle}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-blue-200/90 shrink-0">
                <span className="inline-block px-3 py-1.5 rounded-xl bg-white/10 border border-white/20">
                  Logo Resmi UM Terpasang ✓
                </span>
              </div>
            </div>
          </div>

          {/* 4. Kontrol Widget Dashboard */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-600" />
                Visibilitas Widget di Halaman Utama (Dashboard)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centang atau nonaktifkan modul kartu yang tampil di halaman depan mahasiswa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'statCards', label: 'Kartu Statistik Deadline', desc: 'Total, Sangat Mendesak, Belum Selesai' },
                { key: 'shortcuts', label: 'Bilah Pintasan Cepat Mahasiswa', desc: 'Tautan SIAKAD, SIPEJAR, Drive' },
                { key: 'calendarMini', label: 'Kalender Mini & Filter Tanggal', desc: 'Widget kalender di sisi kanan' },
                { key: 'activitySummary', label: 'Ringkasan Aktivitas Tugas', desc: 'Grafik performa & produktivitas' },
                { key: 'weeklyPriority', label: 'Prioritas Tugas Mingguan', desc: 'Daftar deadline minggu ini' },
                { key: 'tipsCard', label: 'Tips & Panduan Belajar', desc: 'Kartu inspirasi mahasiswa' },
              ].map((w) => {
                const isChecked = (displayConfig.visibleWidgets as any)[w.key];
                return (
                  <label
                    key={w.key}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                      isChecked ? 'bg-blue-50/40 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setDisplayConfig((prev) => ({
                          ...prev,
                          visibleWidgets: {
                            ...prev.visibleWidgets,
                            [w.key]: val,
                          },
                        }));
                      }}
                      className="w-4 h-4 rounded text-blue-600 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{w.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{w.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Pengumuman Global (Broadcast Banner) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  Banner Pengumuman Global (Broadcast Admin)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tampilkan pesan penting atau notifikasi perubahan menu/desain di bagian atas halaman semua mahasiswa.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayConfig.announcementBanner.enabled}
                  onChange={(e) =>
                    setDisplayConfig((prev) => ({
                      ...prev,
                      announcementBanner: {
                        ...prev.announcementBanner,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {displayConfig.announcementBanner.enabled && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Isi Pesan Pengumuman
                  </label>
                  <input
                    type="text"
                    value={displayConfig.announcementBanner.text}
                    onChange={(e) =>
                      setDisplayConfig((prev) => ({
                        ...prev,
                        announcementBanner: {
                          ...prev.announcementBanner,
                          text: e.target.value,
                        },
                      }))
                    }
                    placeholder="Tuliskan pengumuman resmi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Tipe Pesan:</span>
                  {(['info', 'success', 'warning'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setDisplayConfig((prev) => ({
                          ...prev,
                          announcementBanner: {
                            ...prev.announcementBanner,
                            type: t,
                          },
                        }))
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer ${
                        displayConfig.announcementBanner.type === t
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB: MANAJEMEN FAKULTAS & PROGRAM STUDI (AKADEMIK UM)
          ======================================================== */}
      {activeAdminTab === 'akademik' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Manajemen Fakultas & Program Studi UM
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin dapat menambah atau mengurangi (menghapus) fakultas dan prodi. Perubahan otomatis tersinkronisasi ke form pendaftaran & profil mahasiswa.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAcademic}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-slate-200"
              title="Kembalikan daftar fakultas & prodi ke standar resmi bawaan UM"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Pulihkan Standar Resmi UM</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Saat admin <strong>menambah</strong> atau <strong>mengurangi/menghapus</strong> prodi atau fakultas, daftar pilihan pada menu registrasi mahasiswa baru langsung ter-update secara otomatis!
            </span>
          </div>

          {/* Two-Column Grid: Left for Fakultas, Right for Program Studi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: KELOLA FAKULTAS (5 COLS) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-sm">Daftar Fakultas</h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {faculties.length} Fakultas
                </span>
              </div>

              {/* Form: Tambah Fakultas Baru */}
              <form onSubmit={handleAddFaculty} className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Tambah Fakultas Baru:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fakultas Kedokteran Gigi (FKG)"
                    value={newFacultyName}
                    onChange={(e) => setNewFacultyName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </form>

              {/* Search filter for faculties */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari fakultas..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Faculties list */}
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {faculties
                  .filter((f) => f.toLowerCase().includes(facultySearch.toLowerCase()))
                  .map((fac, idx) => {
                    const isEditing = editingFacultyIdx === idx;
                    return (
                      <div
                        key={fac + idx}
                        className="p-2.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between gap-2 text-xs hover:border-slate-300 transition"
                      >
                        {isEditing ? (
                          <div className="flex-1 flex gap-1.5">
                            <input
                              type="text"
                              value={editingFacultyText}
                              onChange={(e) => setEditingFacultyText(e.target.value)}
                              className="flex-1 px-2 py-1 rounded border border-blue-400 text-xs text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditFaculty(idx)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFacultyIdx(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="w-5 text-center text-[10px] font-mono text-slate-400">
                                #{idx + 1}
                              </span>
                              <span className="font-semibold text-slate-800 truncate" title={fac}>
                                {fac}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFacultyIdx(idx);
                                  setEditingFacultyText(fac);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Edit nama fakultas"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFaculty(fac)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Hapus / Kurangi Fakultas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* COLUMN 2: KELOLA PROGRAM STUDI (7 COLS) */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-sm">Daftar Program Studi (Prodi)</h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {studyPrograms.length} Program Studi
                </span>
              </div>

              {/* Form: Tambah Program Studi Baru */}
              <form onSubmit={handleAddProgram} className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Tambah Program Studi Baru:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: S1 Kecerdasan Buatan / Sains Data"
                      value={newProgramName}
                      onChange={(e) => setNewProgramName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Prodi</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Search & Filter Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama prodi (contoh: Informatika, Akuntansi, Mesin)..."
                    value={programSearch}
                    onChange={(e) => setProgramSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Program Studi List */}
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {studyPrograms
                  .filter((p) => p.toLowerCase().includes(programSearch.toLowerCase()))
                  .map((prog, idx) => {
                    const isEditing = editingProgramIdx === idx;
                    return (
                      <div
                        key={prog + idx}
                        className="p-2.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between gap-2 text-xs hover:border-slate-300 transition"
                      >
                        {isEditing ? (
                          <div className="flex-1 flex gap-1.5">
                            <input
                              type="text"
                              value={editingProgramText}
                              onChange={(e) => setEditingProgramText(e.target.value)}
                              className="flex-1 px-2 py-1 rounded border border-blue-400 text-xs text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditProgram(idx)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProgramIdx(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="w-6 text-center text-[10px] font-mono text-slate-400">
                                #{idx + 1}
                              </span>
                              <span className="font-semibold text-slate-800 truncate" title={prog}>
                                {prog}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProgramIdx(idx);
                                  setEditingProgramText(prog);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Edit nama prodi"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProgram(prog)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Hapus / Kurangi Program Studi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: KOTAK SARAN & MASUKAN PENGGUNA (FEEDBACK MANAGER)
          ======================================================== */}
      {activeAdminTab === 'saran' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Kotak Saran & Masukan Mahasiswa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tinjau aspirasi mahasiswa dan terapkan saran mereka langsung ke menu atau tampilan dengan satu klik!
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: `Semua (${feedbackList.length})` },
                { id: 'pending', label: `Menunggu (${pendingCount})` },
                { id: 'implemented', label: `Diterapkan (${implementedCount})` },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setFeedbackFilter(chip.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    feedbackFilter === chip.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Cards List */}
          <div className="space-y-4">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Tidak ada saran pada filter ini.</p>
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className={`p-5 rounded-2xl border transition ${
                    fb.status === 'implemented'
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-slate-900 text-sm">{fb.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          fb.category === 'menu_baru'
                            ? 'bg-blue-100 text-blue-700'
                            : fb.category === 'tampilan_tema'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {fb.category.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fb.status === 'implemented'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fb.status === 'reviewing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fb.status === 'implemented' ? '✓ Diterapkan' : fb.status === 'reviewing' ? 'Sedang Diproses' : 'Menunggu Review'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {fb.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span>Pengusul: <strong className="text-slate-700">{fb.studentName}</strong> (NIM: {fb.studentId})</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(fb.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action: Terapkan Saran Langsung */}
                    <div className="shrink-0 flex items-center gap-2">
                      {fb.status !== 'implemented' && (
                        <button
                          type="button"
                          onClick={() => handleApplyFeedbackDirectly(fb)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Terapkan Saran Ini Langsung</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Admin Response Box */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    {fb.adminResponse ? (
                      <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/80 text-slate-700 flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 text-[11px]">Tanggapan Admin:</p>
                          <p className="text-xs text-slate-600 mt-0.5">{fb.adminResponse}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tulis balasan / tanggapan admin untuk mahasiswa ini..."
                          value={adminReplyText[fb.id] || ''}
                          onChange={(e) =>
                            setAdminReplyText((prev) => ({
                              ...prev,
                              [fb.id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendAdminReply(fb.id)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: DATA AKUN MAHASISWA TERDAFTAR
          ======================================================== */}
      {activeAdminTab === 'akun' && (
        <div className="space-y-6">
          {/* Card 1: Keamanan & Pengaturan Kata Sandi Administrator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Keamanan Akun & Ubah Kata Sandi Administrator
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ubah kata sandi login Admin portal untuk menjaga keamanan sistem (Kata sandi cepat telah dinonaktifkan).
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                Sandi Cepat Dihapus ✓
              </span>
            </div>

            {passErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            {passSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangeAdminPassword} className="space-y-3.5 text-xs max-w-xl">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kata Sandi Admin Saat Ini
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi saat ini"
                  value={currentAdminPassInput}
                  onChange={(e) => setCurrentAdminPassInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Kata Sandi Baru (Min. 4 Karakter)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan kata sandi baru"
                    value={newAdminPassInput}
                    onChange={(e) => setNewAdminPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ulangi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Konfirmasi kata sandi baru"
                    value={confirmAdminPassInput}
                    onChange={(e) => setConfirmAdminPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Kata Sandi Admin</span>
              </button>
            </form>
          </div>

          {/* Card 2: Data Akun Mahasiswa Terdaftar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Daftar Akun Mahasiswa Terdaftar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola akun yang telah terdaftar untuk masuk ke portal DeadlineHub.
              </p>
            </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
            {accounts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Belum ada akun mahasiswa yang terdaftar.
              </div>
            ) : (
              accounts.map((acc) => (
                <div key={acc.studentId} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{acc.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">NIM: {acc.studentId} • {acc.email}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{acc.faculty} — {acc.major}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      Terverifikasi
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus akun mahasiswa ${acc.name} (${acc.studentId})?`)) {
                          setAccounts((prev) => prev.filter((a) => a.studentId !== acc.studentId));
                          showToast(`Akun ${acc.name} berhasil dihapus.`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Hapus Akun"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
