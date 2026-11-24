import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  RotateCcw, 
  CheckCircle2, 
  Send, 
  GraduationCap, 
  Save,
  Download,
  Upload,
  RefreshCw,
  Wrench,
  AlertTriangle,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';
import { PWAInstallState } from '../hooks/usePWAInstall';

interface SettingsViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onResetToPhotoData: () => void;
  onTriggerTestEmail: () => void;
  onQuickRefresh?: () => void;
  onHardReload?: () => void;
  pwaState?: PWAInstallState;
  onOpenInstallModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetToPhotoData,
  onTriggerTestEmail,
  onQuickRefresh,
  onHardReload,
  pwaState,
  onOpenInstallModal,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [isRefreshingLocal, setIsRefreshingLocal] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendTest = () => {
    onTriggerTestEmail();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const requestBrowserNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('DeadlineHub Aktif!', {
          body: 'Notifikasi pengingat browser berhasil dihubungkan untuk email mahasiswa.',
          icon: '/favicon.ico',
        });
        setFormData({ ...formData, browserNotificationEnabled: true });
        onUpdateProfile({ ...formData, browserNotificationEnabled: true });
      } else {
        alert('Izin notifikasi ditolak oleh browser.');
      }
    } else {
      alert('Browser Anda tidak mendukung Web Notification API.');
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pengaturan & Konfigurasi</h2>
          <p className="text-xs text-slate-500">
            Kelola profil mahasiswa, integrasi notifikasi email kampus, dan preferensi aplikasi
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Tersimpan!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Data Profil Mahasiswa</h3>
              <p className="text-xs text-slate-500">Nama dan identitas universitas yang tampil di DeadlineHub</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
            <img
              src={formData.avatarUrl}
              alt={formData.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-sm"
            />
            <div className="flex-1 w-full space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Mahasiswa</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status / Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIM / ID Mahasiswa</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Universitas / Kampus</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Reminder Integration Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Integrasi Pengingat Email Mahasiswa</h3>
              <p className="text-xs text-slate-500">
                Pemberitahuan otomatis deadline tugas yang dikirimkan ke kotak masuk email
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Email Mahasiswa Penerima <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Email Uji Coba
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Semua notifikasi pengingat otomatis akan dikirim ke email kampus ini.
              </p>
            </div>

            {testSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Email Uji Coba Terkirim!</strong> Pesan pengingat simulasi telah berhasil dikirim ke <u>{formData.email}</u>.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-slate-800">Aktifkan Pengingat Otomatis</span>
                  <input
                    type="checkbox"
                    checked={formData.autoEmailReminders}
                    onChange={(e) =>
                      setFormData({ ...formData, autoEmailReminders: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <p className="text-[11px] text-slate-500 mt-1">
                  Kirim email berkala secara otomatis menjelang batas waktu pengumpulan tugas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Izin Notifikasi Browser</span>
                  <button
                    type="button"
                    onClick={requestBrowserNotification}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Minta Izin
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Munculkan popup desktop saat waktu pengingat tugas mahasiswa tiba.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Akses Multi-Platform (PC & HP / PWA) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Aplikasi Multi-Platform (PC & HP)
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                    PWA Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Pasang DeadlineHub di Desktop Windows/Mac atau Layar Utama Android/iOS</p>
              </div>
            </div>
            {onOpenInstallModal && (
              <button
                type="button"
                onClick={onOpenInstallModal}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Petunjuk / Pasang</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <p className="text-[10px] font-bold uppercase text-slate-400">Mode Tampilan</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {pwaState?.isInstalled ? 'Aplikasi Mandiri (Standalone) ✓' : 'Akses Browser Web'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {pwaState?.isInstalled ? 'Berjalan mulus tanpa address bar browser' : 'Dapat dipasang ke desktop / home screen'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <p className="text-[10px] font-bold uppercase text-slate-400">Dukungan Perangkat</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">Laptop, PC, Tablet & HP</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Responsive fleksibel untuk layar besar maupun ponsel pintar
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <p className="text-[10px] font-bold uppercase text-slate-400">Tautan Aplikasi</p>
              <p className="text-xs font-mono text-blue-700 font-semibold mt-0.5 truncate">
                {typeof window !== 'undefined' ? window.location.origin : 'https://...'}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.origin);
                    alert('Tautan website berhasil disalin ke clipboard!');
                  }
                }}
                className="text-[11px] text-blue-600 hover:underline font-bold mt-1 inline-block"
              >
                Salin Tautan →
              </button>
            </div>
          </div>
        </div>

        {/* Card: Pusat Pemulihan & Perbaikan Bug Website */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pusat Pemulihan & Perbaikan Bug Website</h3>
              <p className="text-xs text-slate-500">Gunakan opsi di bawah ini jikalau website mengalami bug, data macet, atau tampilan lambat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* 1. Quick Refresh */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  Segarkan Tampilan (Quick)
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Menyinkronkan ulang data dari penyimpanan, membersihkan filter macet, dan memperbarui hitung mundur tanpa reload.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRefreshingLocal(true);
                  if (onQuickRefresh) onQuickRefresh();
                  setTimeout(() => setIsRefreshingLocal(false), 600);
                }}
                disabled={isRefreshingLocal}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingLocal ? 'animate-spin' : ''}`} />
                Segarkan Sekarang
              </button>
            </div>

            {/* 2. Reload Browser */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <RotateCcw className="w-4 h-4 text-slate-700" />
                  Muat Ulang Halaman (Reload)
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Memuat ulang browser penuh untuk membersihkan script runtime atau websocket yang macet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onHardReload) {
                    onHardReload();
                  } else {
                    window.location.reload();
                  }
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Halaman
              </button>
            </div>

            {/* 3. Reset Corrupted Data */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Pulihkan & Reset Cache Bug
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Membersihkan data corrupt dan mengembalikan tugas ke jadwal resmi default Oktober 2026.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin memulihkan dan mereset semua data tugas ke default resmi Oktober 2026? Ini akan memperbaiki semua bug data.')) {
                    onResetToPhotoData();
                  }
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Wrench className="w-3.5 h-3.5" />
                Reset & Perbaiki Data
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan semua data ke tampilan persis seperti pada foto asli?')) {
                onResetToPhotoData();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-600 font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Data Tampilan Foto
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};
