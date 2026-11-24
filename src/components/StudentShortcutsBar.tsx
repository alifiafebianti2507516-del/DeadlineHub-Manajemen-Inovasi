import React, { useState } from 'react';
import { 
  Link2, 
  ExternalLink, 
  Plus, 
  FolderGit2, 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileCheck2, 
  Bookmark, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Globe, 
  Check, 
  X,
  Layers
} from 'lucide-react';
import { ShortcutLink, ShortcutCategory } from '../types';

interface StudentShortcutsBarProps {
  shortcuts: ShortcutLink[];
  onAddShortcut: (item: Omit<ShortcutLink, 'id' | 'createdAt'>) => void;
  onEditShortcut: (id: string, item: Omit<ShortcutLink, 'id' | 'createdAt'>) => void;
  onDeleteShortcut: (id: string) => void;
  onLoadDefaultPresets?: () => void;
}

export const CATEGORY_PRESETS: {
  category: ShortcutCategory;
  label: string;
  defaultTitle: string;
  defaultUrl: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    category: 'SIAKAD',
    label: '1. SIAKAD',
    defaultTitle: 'SIAKAD UM (Portal Akademik)',
    defaultUrl: 'https://siakad.um.ac.id',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    icon: GraduationCap,
  },
  {
    category: 'SIPEJAR',
    label: '2. SIPEJAR',
    defaultTitle: 'SIPEJAR UM (LMS Kuliah)',
    defaultUrl: 'https://sipejar.um.ac.id',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700',
    iconBg: 'bg-indigo-600',
    iconColor: 'text-white',
    icon: BookOpen,
  },
  {
    category: 'SIMAWA',
    label: '3. SIMAWA',
    defaultTitle: 'SIMAWA UM (Kemahasiswaan)',
    defaultUrl: 'https://simawa.um.ac.id',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    icon: Award,
  },
  {
    category: 'SIPADU',
    label: '4. SIPADU',
    defaultTitle: 'SIPADU UM (Layanan Surat)',
    defaultUrl: 'https://sipadu.um.ac.id',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white',
    icon: FileCheck2,
  },
  {
    category: 'Google Drive file tugas',
    label: '5. Google Drive file tugas',
    defaultTitle: 'Google Drive Folder Tugas',
    defaultUrl: 'https://drive.google.com',
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200',
    badgeText: 'text-teal-700',
    iconBg: 'bg-teal-600',
    iconColor: 'text-white',
    icon: FolderGit2,
  },
  {
    category: 'Lainnya',
    label: '6. Lainnya',
    defaultTitle: 'Portal Tugas Mahasiswa',
    defaultUrl: 'https://',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    icon: Bookmark,
  },
];

export const StudentShortcutsBar: React.FC<StudentShortcutsBarProps> = ({
  shortcuts,
  onAddShortcut,
  onEditShortcut,
  onDeleteShortcut,
  onLoadDefaultPresets,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState<ShortcutCategory>('SIAKAD');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const openAddModal = (presetCategory?: ShortcutCategory) => {
    const targetCat = presetCategory || 'SIAKAD';
    const preset = CATEGORY_PRESETS.find((p) => p.category === targetCat);
    setEditingId(null);
    setFormCategory(targetCat);
    setFormTitle(preset ? preset.defaultTitle : '');
    setFormUrl(preset ? preset.defaultUrl : 'https://');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ShortcutLink) => {
    setEditingId(item.id);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormUrl(item.url);
    setFormDescription(item.description || '');
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCategorySelect = (cat: ShortcutCategory) => {
    setFormCategory(cat);
    const preset = CATEGORY_PRESETS.find((p) => p.category === cat);
    if (preset) {
      // If title or url is empty or equals another default, populate
      if (!formTitle || CATEGORY_PRESETS.some((p) => p.defaultTitle === formTitle)) {
        setFormTitle(preset.defaultTitle);
      }
      if (!formUrl || formUrl === 'https://' || CATEGORY_PRESETS.some((p) => p.defaultUrl === formUrl)) {
        setFormUrl(preset.defaultUrl);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    let formattedUrl = formUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (editingId) {
      onEditShortcut(editingId, {
        title: formTitle.trim(),
        url: formattedUrl,
        category: formCategory,
        description: formDescription.trim() || undefined,
      });
    } else {
      onAddShortcut({
        title: formTitle.trim(),
        url: formattedUrl,
        category: formCategory,
        description: formDescription.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const filteredShortcuts = selectedCategoryFilter === 'semua'
    ? shortcuts
    : shortcuts.filter((s) => s.category === selectedCategoryFilter);

  const getPresetConfig = (category: ShortcutCategory) => {
    return CATEGORY_PRESETS.find((p) => p.category === category) || CATEGORY_PRESETS[5];
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Tautan Pintasan Mahasiswa
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {shortcuts.length} tautan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Akses langsung ke portal kampus: <strong>SIAKAD</strong>, <strong>SIPEJAR</strong>, <strong>SIMAWA</strong>, <strong>SIPADU</strong>, <strong>Google Drive file tugas</strong>, dan <strong>Lainnya</strong>.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pintasan</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setSelectedCategoryFilter('semua')}
          className={`px-3 py-1 rounded-xl font-semibold transition shrink-0 ${
            selectedCategoryFilter === 'semua'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua ({shortcuts.length})
        </button>

        {CATEGORY_PRESETS.map((preset) => {
          const count = shortcuts.filter((s) => s.category === preset.category).length;
          const isSelected = selectedCategoryFilter === preset.category;

          return (
            <button
              key={preset.category}
              onClick={() => setSelectedCategoryFilter(preset.category)}
              className={`px-3 py-1 rounded-xl font-medium transition shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{preset.category}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content: List or Empty State */}
      {filteredShortcuts.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-50/80 border border-dashed border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Link2 className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-bold text-slate-800">
              {shortcuts.length === 0
                ? 'Pintasan Mahasiswa Masih Kosong'
                : `Belum Ada Pintasan Kategori "${selectedCategoryFilter}"`}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {shortcuts.length === 0
                ? 'Akun mahasiswa baru dimulai dari nol. Anda dapat menambahkan tautan portal akademik yang sering dibuka seperti SIAKAD, SIPEJAR, SIMAWA, SIPADU, Google Drive berkas tugas, atau link penting lainnya.'
                : 'Pilih kategori lain atau tambahkan tautan baru untuk kategori ini.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => openAddModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pintasan Pertama</span>
            </button>

            {onLoadDefaultPresets && shortcuts.length === 0 && (
              <button
                onClick={onLoadDefaultPresets}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition cursor-pointer"
                title="Pasang sekaligus link portal resmi UM (SIAKAD, SIPEJAR, SIMAWA, SIPADU, Google Drive)"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Pasang Pintasan Resmi Kampus (Default)</span>
              </button>
            )}
          </div>

          {/* Quick preset chips when empty */}
          {shortcuts.length === 0 && (
            <div className="pt-3 border-t border-slate-200/60 max-w-xl mx-auto">
              <p className="text-[11px] text-slate-400 font-medium mb-2">Pilih kategori cepat untuk ditambahkan:</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {CATEGORY_PRESETS.map((p) => (
                  <button
                    key={p.category}
                    onClick={() => openAddModal(p.category)}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3 h-3 text-blue-500" />
                    <span>{p.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredShortcuts.map((item) => {
            const config = getPresetConfig(item.category);
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/90 hover:border-blue-300 bg-white hover:bg-blue-50/20 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Top: Icon + Category Badge + Menu */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl ${config.iconBg} ${config.iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${config.badgeBg} ${config.badgeBorder} ${config.badgeText}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Quick 3-dot dropdown for edit/delete */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Opsi pintasan"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 animate-in fade-in">
                          <button
                            onClick={() => openEditModal(item)}
                            className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              onDeleteShortcut(item.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                    {item.title}
                  </h4>

                  {/* Description or url snippet */}
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                    {item.description || item.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>

                {/* Bottom link trigger */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
                    {item.url.replace(/^https?:\/\//, '')}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Tambah / Edit Pintasan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Tautan Pintasan' : 'Tambah Tautan Pintasan Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">Pilih salah satu dari 6 kategori yang tersedia</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Category Radio Grid (6 categories requested by user) */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  Kategori Pintasan <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_PRESETS.map((preset) => {
                    const isSelected = formCategory === preset.category;
                    const Icon = preset.icon;

                    return (
                      <button
                        key={preset.category}
                        type="button"
                        onClick={() => handleCategorySelect(preset.category)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${preset.iconBg} ${preset.iconColor} flex items-center justify-center shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className={`font-bold truncate text-[11px] ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                            {preset.category}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Pintasan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SIAKAD UM, SIPEJAR LMS, Google Drive Tugas"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* URL input */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Alamat URL / Tautan Web <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    placeholder="https://siakad.um.ac.id"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Format harus diawali dengan http:// atau https://
                </p>
              </div>

              {/* Description input */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Catatan / Keterangan Singkat (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Cek nilai UTS, upload tugas praktikum, folder tugas akhir"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Pintasan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
