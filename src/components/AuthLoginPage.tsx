import React, { useState } from 'react';
import { 
  CalendarDays, 
  Lock, 
  User, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  KeyRound,
  GraduationCap,
  Building2,
  BookOpen,
  PlusCircle,
  Search,
  UserPlus,
  LogIn,
  Download,
  Globe
} from 'lucide-react';
import { StudentProfile, UserAccount, AppDisplayConfig } from '../types';
import { UM_FACULTIES, UM_STUDY_PROGRAMS } from '../data/umAcademics';
import { PWAInstallState } from '../hooks/usePWAInstall';
import { Smartphone, Shield } from 'lucide-react';

interface AuthLoginPageProps {
  onLoginSuccess: (studentId: string, account?: UserAccount) => void;
  onRegisterAccount: (newAccount: UserAccount) => void;
  profile: StudentProfile;
  accounts: UserAccount[];
  pwaState?: PWAInstallState;
  onOpenInstallModal?: () => void;
  displayConfig?: AppDisplayConfig;
  faculties?: string[];
  studyPrograms?: string[];
  adminPassword?: string;
}

export const AuthLoginPage: React.FC<AuthLoginPageProps> = ({
  onLoginSuccess,
  onRegisterAccount,
  profile,
  accounts,
  pwaState,
  onOpenInstallModal,
  displayConfig,
  faculties,
  studyPrograms,
  adminPassword,
}) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'reset-sent' | 'admin'>('login');
  
  // Login fields - empty by default so user must enter registered credentials
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin login fields
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  // Dynamic faculties and study programs list
  const availableFaculties = faculties && faculties.length > 0 ? faculties : UM_FACULTIES;
  const availableStudyPrograms = studyPrograms && studyPrograms.length > 0 ? studyPrograms : UM_STUDY_PROGRAMS;

  // Register fields (for mahasiswa yang belum melakukan pendaftaran)
  const [regName, setRegName] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFaculty, setRegFaculty] = useState<string>(() => availableFaculties[4] || availableFaculties[0] || 'Fakultas Teknik (FT)');
  const [regMajor, setRegMajor] = useState<string>(() => availableStudyPrograms[41] || availableStudyPrograms[0] || 'Teknik Informatika');
  const [isCustomMajor, setIsCustomMajor] = useState(false);
  const [customMajorText, setCustomMajorText] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [majorSearchQuery, setMajorSearchQuery] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Forgot password fields
  const [campusEmail, setCampusEmail] = useState(profile.email || '');
  const [forgotError, setForgotError] = useState('');
  const [resetSuccessEmail, setResetSuccessEmail] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isResetComplete, setIsResetComplete] = useState(false);

  // Filter study programs based on search
  const filteredStudyPrograms = availableStudyPrograms.filter((p) =>
    p.toLowerCase().includes(majorSearchQuery.toLowerCase())
  );

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanNim = nim.trim();
    const cleanPass = password.trim();

    if (!cleanNim) {
      setLoginError('Silakan masukkan NIM mahasiswa Anda.');
      return;
    }

    if (!cleanPass) {
      setLoginError('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Check registered accounts list
      const existingAccount = accounts.find((a) => a.studentId === cleanNim && !a.isDemo);
      
      if (existingAccount) {
        // If password is set and doesn't match
        if (existingAccount.password && existingAccount.password !== cleanPass) {
          setLoginError('Kata sandi salah. Silakan periksa kembali kata sandi akun Anda.');
          return;
        }
        onLoginSuccess(cleanNim, existingAccount);
        return;
      }

      // No demo account allowed; student MUST register first
      setLoginError('NIM belum terdaftar! Silakan klik tab "Daftar Akun Baru" di atas untuk mendaftarkan akun Anda terlebih dahulu.');
    }, 450);
  };

  // Handle Registration Submit (Mahasiswa Baru)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!regName.trim()) {
      setRegisterError('Silakan masukkan nama lengkap mahasiswa.');
      return;
    }

    if (!regNim.trim()) {
      setRegisterError('Silakan masukkan NIM mahasiswa Anda.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegisterError('Silakan masukkan email kampus yang valid (contoh: @students.um.ac.id).');
      return;
    }

    const finalMajor = isCustomMajor ? customMajorText.trim() : regMajor;
    if (!finalMajor) {
      setRegisterError('Silakan pilih atau masukkan program studi Anda.');
      return;
    }

    // Check if NIM already exists
    if (accounts.some((a) => a.studentId === regNim.trim())) {
      setRegisterError(`NIM ${regNim.trim()} sudah terdaftar! Silakan langsung login.`);
      return;
    }

    setIsLoading(true);

    const newAccount: UserAccount = {
      studentId: regNim.trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      faculty: regFaculty,
      major: finalMajor,
      password: regPassword.trim() || regNim.trim(),
      isDemo: false,
    };

    setTimeout(() => {
      setIsLoading(false);
      onRegisterAccount(newAccount);
    }, 500);
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!campusEmail.trim() || !campusEmail.includes('@')) {
      setForgotError('Silakan masukkan format alamat email kampus yang valid.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setResetSuccessEmail(campusEmail.trim());
      setView('reset-sent');
    }, 500);
  };

  // Handle Admin Submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const cleanPass = adminPasscode.trim();
    if (!cleanPass) {
      setAdminError('Silakan masukkan kata sandi Administrator.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const configuredPassword = adminPassword || localStorage.getItem('deadlinehub_admin_password') || 'admin';
      
      // Match configured password or default admin password
      if (cleanPass === configuredPassword || cleanPass === 'admin') {
        const adminAccount: UserAccount = {
          studentId: 'admin',
          name: 'Administrator UM',
          email: 'admin@um.ac.id',
          faculty: 'Pengelola Sistem',
          major: 'Administrator DeadlineHub',
          password: cleanPass,
          role: 'admin',
          isDemo: false,
        };
        onLoginSuccess('admin', adminAccount);
      } else {
        setAdminError('Kata sandi admin tidak cocok. Silakan periksa kembali kata sandi Administrator Anda.');
      }
    }, 400);
  };

  const bgImage = displayConfig?.loginBgUrl || '/assets/aistudio/DJI_0100-1_48df2f35.jpg';
  const overlayDarkness = displayConfig?.bgOverlayDarkness ?? 0.45;

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(7, 19, 36, ${overlayDarkness}), rgba(7, 19, 36, ${Math.min(overlayDarkness + 0.18, 0.9)})), url('${bgImage}')`,
      }}
    >
      {/* Ambient gradient glow overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sisi Kanan Atas: Link Website untuk PC, atau Instal Aplikasi untuk HP */}
      {onOpenInstallModal && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="group flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/25 text-white shadow-xl backdrop-blur-md transition-all cursor-pointer ring-2 ring-white/10"
            title={pwaState?.isDesktop ? 'Salin & Buka Link Website DeadlineHub di PC' : 'Instal Aplikasi DeadlineHub di HP'}
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              {pwaState?.isDesktop ? (
                <Globe className="w-3.5 h-3.5 text-white" />
              ) : (
                <Download className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                  {pwaState?.isDesktop ? 'Link Website' : 'Instal Aplikasi'}
                </span>
                <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  {pwaState?.isDesktop ? 'PC' : 'HP'}
                </span>
              </div>
              <p className="text-[10px] text-blue-200/90 leading-none mt-1 hidden sm:block">
                {pwaState?.isDesktop ? 'Salin & Akses di Browser' : 'Pasang di Layar HP'}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-xl bg-[#0D1D33]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 my-4">
        {/* Brand Header with Official UM Logo */}
        <div className="text-center mb-6">
          <div className="relative inline-block mx-auto mb-3">
            {/* Ambient circular halo glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full blur-md opacity-70 animate-pulse pointer-events-none"></div>
            {/* White disc badge holding the official UM Seal */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2 shadow-2xl flex items-center justify-center ring-4 ring-white/30 transition-transform duration-300 hover:scale-105">
              <img
                src={displayConfig?.logoUrl || '/assets/aistudio/Lambang-UM-550x550_773f45e8.png'}
                alt="Lambang Resmi Universitas Negeri Malang"
                className="w-full h-full object-contain"
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0D1D33] shadow-md"
                title="Sistem Terhubung & Aktif"
              ></span>
            </div>
          </div>

          <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300/90 mb-1">
            Universitas Negeri Malang
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            {displayConfig?.appTitle || 'DeadlineHub'}
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 border border-blue-400/30 font-bold tracking-normal">
              Portal Akademik
            </span>
          </h1>

          {/* Slogan Utama */}
          <p className="text-sm font-bold text-blue-200 mt-1">
            {displayConfig?.appTagline || 'Satu Tempat, Semua Deadline.'}
          </p>
          {/* Sub-Slogan Deskripsi */}
          <p className="text-xs text-blue-200/80 font-medium mt-0.5 max-w-md mx-auto">
            {displayConfig?.portalSubtitle || 'Sistem Manajemen Akademik & Pintasan Mahasiswa Universitas Negeri Malang'}
          </p>

          {/* Quick Link/PWA Pill for PC & Mobile */}
          {onOpenInstallModal && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={onOpenInstallModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md transition cursor-pointer group"
              >
                {pwaState?.isDesktop ? (
                  <Globe className="w-3.5 h-3.5 text-blue-300 group-hover:scale-110 transition-transform" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5 text-blue-300 group-hover:scale-110 transition-transform" />
                )}
                <span>
                  {pwaState?.isDesktop ? 'Tautan Resmi Website Portal PC & HP' : 'Bisa Diakses di PC & HP (Instal Aplikasi)'}
                </span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher: Masuk vs Daftar Baru vs Admin */}
        {(view === 'login' || view === 'register' || view === 'admin') && (
          <div className="flex rounded-xl bg-[#081324] p-1 border border-slate-800 mb-6 text-xs gap-1">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setLoginError('');
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                view === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Mahasiswa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setView('register');
                setRegisterError('');
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                view === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setView('admin');
                setAdminError('');
              }}
              className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                view === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/80'
              }`}
              title="Akses Administrator untuk mengedit menu dan tampilan"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* =========================================
            VIEW 1: FORM LOGIN MAHASISWA
            ========================================= */}
        {view === 'login' && (
          <div>
            <div className="mb-5 text-center">
              <h2 className="text-base font-bold text-white">Masuk ke Portal Tugas</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Masukkan <strong>NIM</strong> dan Kata Sandi akun terdaftar Anda.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Username / NIM */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  NIM Mahasiswa (Username) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan NIM terdaftar Anda"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#091526] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    Kata Sandi <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setLoginError('');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi akun Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#091526] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#091526] border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Ingat Saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setRegisterError('');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
                >
                  Belum punya akun? Daftar
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Masuk ke DeadlineHub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick helper note */}
            <div className="mt-5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-300">Wajib Mendaftar Akun Terlebih Dahulu</p>
                <p className="mt-0.5">
                  Untuk menggunakan DeadlineHub, silakan klik tab <strong className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setView('register'); setRegisterError(''); }}>"Daftar Akun Baru"</strong> di atas. Akun baru Anda akan siap digunakan untuk mengelola tugas perkuliahan secara mandiri.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            VIEW 2: FORM REGISTRASI MAHASISWA BARU
            ========================================= */}
        {view === 'register' && (
          <div className="animate-in fade-in">
            <div className="mb-4 text-center">
              <h2 className="text-base font-bold text-white">Pendaftaran Mahasiswa Baru</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Daftarkan diri Anda untuk mengelola tugas dan tautan akademik kampus UM.
              </p>
            </div>

            {/* Error Message */}
            {registerError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Lengkap Mahasiswa <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Pratama Putra"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#091526] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* NIM & Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* NIM */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    NIM Mahasiswa <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2507518"
                    value={regNim}
                    onChange={(e) => {
                      setRegNim(e.target.value);
                      if (!regEmail || regEmail.endsWith('@students.um.ac.id')) {
                        const sanitized = (regName.toLowerCase().replace(/[^a-z0-9]/g, '.') || 'mahasiswa');
                        setRegEmail(`${sanitized}.${e.target.value}@students.um.ac.id`);
                      }
                      if (!regPassword) {
                        setRegPassword(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2 bg-[#091526] border border-slate-700/80 rounded-xl text-white font-mono placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Kata Sandi */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kata Sandi (Default: NIM)
                  </label>
                  <input
                    type="text"
                    placeholder="Otomatis sama dengan NIM"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#091526] border border-slate-700/80 rounded-xl text-white font-mono placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email Kampus */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Alamat Email Kampus <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama.nim@students.um.ac.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#091526] border border-slate-700/80 rounded-xl text-white font-mono placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Pilihan Fakultas */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    Pilih Fakultas <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{availableFaculties.length} Fakultas Tersedia</span>
                </label>
                <select
                  value={regFaculty}
                  onChange={(e) => setRegFaculty(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#091526] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {availableFaculties.map((faculty) => (
                    <option key={faculty} value={faculty} className="bg-[#091526] text-white">
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilihan Program Studi (80+ Prodi resmi + Opsi Tambah Menu Lainnya) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    Pilih Program Studi <span className="text-rose-400">*</span>
                  </label>

                  {/* Tombol Tambahkan Menu Lainnya seperti yang diminta user */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMajor(!isCustomMajor);
                      if (!isCustomMajor && !customMajorText) {
                        setCustomMajorText('');
                      }
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>{isCustomMajor ? 'Pilih dari Daftar' : 'Tambahkan Menu Lainnya'}</span>
                  </button>
                </div>

                {!isCustomMajor ? (
                  <div className="space-y-1.5">
                    {/* Quick filter search for long 80+ prodi list */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari prodi (contoh: Informatika, Akuntansi, PGSD)..."
                        value={majorSearchQuery}
                        onChange={(e) => setMajorSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-[#091526]/80 border border-slate-700/60 rounded-lg text-slate-300 placeholder:text-slate-500 text-[11px] focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <select
                      value={regMajor}
                      onChange={(e) => setRegMajor(e.target.value)}
                      size={4}
                      className="w-full px-2 py-1.5 bg-[#091526] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer overflow-y-auto"
                    >
                      {filteredStudyPrograms.map((prodi) => (
                        <option key={prodi} value={prodi} className="py-1 px-2 hover:bg-blue-600 rounded">
                          {prodi}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400">
                      Terpilih: <strong className="text-blue-300">{regMajor}</strong> • Jika tidak ada di daftar, klik "Tambahkan Menu Lainnya".
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1.5 animate-in fade-in">
                    <p className="text-[11px] text-blue-200 font-medium">
                      Tuliskan nama program studi Anda secara manual:
                    </p>
                    <input
                      type="text"
                      required={isCustomMajor}
                      placeholder="Contoh: S1 Desain Produk, D3 Tata Boga, dll."
                      value={customMajorText}
                      onChange={(e) => setCustomMajorText(e.target.value)}
                      className="w-full px-3 py-2 bg-[#091526] border border-blue-400/60 rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Daftar & Masuk ke DeadlineHub</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Sudah memiliki akun? <strong className="text-blue-400 underline">Masuk di sini</strong>
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            VIEW 3: FORM LUPA KATA SANDI (DENGAN EMAIL KAMPUS)
            ========================================= */}
        {view === 'forgot' && (
          <div>
            <button
              onClick={() => {
                setView('login');
                setForgotError('');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-4 transition font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Login
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5 border border-blue-500/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Lupa Kata Sandi?</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Masukkan <strong>Email Kampus</strong> yang terdaftar pada akun mahasiswa Anda. Sistem akan memverifikasi dan mengirimkan tautan reset kata sandi ke kotak masuk email universitas Anda.
              </p>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Alamat Email Kampus Mahasiswa <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama.nim@students.um.ac.id"
                    value={campusEmail}
                    onChange={(e) => setCampusEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#091526] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Contoh format email kampus: <span className="font-mono text-blue-300">nama.nim@students.um.ac.id</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Kirim Tautan Reset ke Email Kampus</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* =========================================
            VIEW 4: KONFIRMASI RESET KATA SANDI
            ========================================= */}
        {view === 'reset-sent' && (
          <div className="text-center space-y-4 text-xs animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">Tautan Reset Terkirim!</h2>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Instruksi reset kata sandi telah dikirimkan ke email kampus mahasiswa:
              </p>
              <p className="font-mono font-bold text-blue-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 my-2 inline-block">
                {resetSuccessEmail}
              </p>
            </div>

            {/* Quick Set New Password directly */}
            <div className="p-4 rounded-2xl bg-[#091526] border border-slate-800 text-left space-y-3">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Atur Kata Sandi Baru Langsung:</span>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPasswordInput.trim() || newPasswordInput.length < 4) {
                    alert('Kata sandi baru minimal 4 karakter.');
                    return;
                  }
                  setPassword(newPasswordInput.trim());
                  setIsResetComplete(true);
                  setTimeout(() => {
                    setView('login');
                    setIsResetComplete(false);
                  }, 1200);
                }} 
                className="space-y-2.5"
              >
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi baru Anda"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D1D33] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  {isResetComplete ? 'Kata Sandi Berhasil Diperbarui! ✓' : 'Simpan Kata Sandi Baru'}
                </button>
              </form>
            </div>

            <button
              onClick={() => setView('login')}
              className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800/80 text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Login
            </button>
          </div>
        )}

        {/* =========================================
            VIEW 5: FORM LOGIN ADMIN PORTAL
            ========================================= */}
        {view === 'admin' && (
          <div className="animate-in fade-in">
            <div className="mb-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2.5 border border-amber-500/30 shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white">Panel Administrator Portal</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Masuk untuk menambah/mengurangi menu dan menyesuaikan tampilan sesuai saran mahasiswa.
              </p>
            </div>

            {adminError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  ID Administrator
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#091526] border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Kata Sandi Administrator <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan kata sandi Administrator"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#091526] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Masuk ke Panel Kontrol Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Fitur Panel Admin Aktif:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400 text-[10px]">
                <li>Tambah menu kustom (SIAKAD, SIPEJAR, Perpustakaan, dsb.)</li>
                <li>Sembunyikan / aktifkan menu navigasi mahasiswa</li>
                <li>Ubah foto background drone & intensitas kecerahan</li>
                <li>Tinjau & terapkan langsung saran/usulan mahasiswa</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright with campus landmark attribution */}
      <div className="mt-4 text-center text-xs text-slate-300 relative z-10 drop-shadow">
        <p className="font-semibold text-white">DeadlineHub • Universitas Negeri Malang (UM)</p>
        <p className="text-[11px] text-slate-300/80 mt-0.5">
          Sistem Manajemen Akademik Terpadu
        </p>
      </div>
    </div>
  );
};
