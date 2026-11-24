import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, AlertCircle, Mail, Check, Sparkles } from 'lucide-react';
import { DeadlineItem, Priority, Category } from '../types';

interface ModalAddDeadlineProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    deadline: Omit<DeadlineItem, 'id' | 'createdAt'>,
    existingId?: string,
    syncOptions?: { syncToCalendar: boolean; notifyOnDevice: boolean }
  ) => void;
  editingItem?: DeadlineItem | null;
  defaultEmail: string;
  defaultDate?: string | null;
}

export const ModalAddDeadline: React.FC<ModalAddDeadlineProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  defaultEmail,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState<Category>('Matakuliah');
  const [dueDate, setDueDate] = useState(defaultDate || '2026-10-28');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<Priority>('mendesak');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [iconType, setIconType] = useState<DeadlineItem['iconType']>('doc');
  
  // Email reminder state
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [remindOffsets, setRemindOffsets] = useState<('3-days' | '1-day' | '6-hours' | '1-hour')[]>([
    '1-day',
    '6-hours',
  ]);

  // Google Calendar & Device Notification toggles
  const [syncToCalendar, setSyncToCalendar] = useState(true);
  const [notifyOnDevice, setNotifyOnDevice] = useState(true);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCourseName(editingItem.courseName);
      setCategory(editingItem.category);
      setDueDate(editingItem.dueDate);
      setDueTime(editingItem.dueTime);
      setPriority(editingItem.priority);
      setDescription(editingItem.description || '');
      setLocation(editingItem.location || '');
      setIconType(editingItem.iconType);
      setEmailEnabled(editingItem.emailReminder.enabled);
      setRecipientEmail(editingItem.emailReminder.recipientEmail || defaultEmail);
      setRemindOffsets(editingItem.emailReminder.remindOffsets || ['1-day']);
    } else {
      // Reset form
      setTitle('');
      setCourseName('');
      setCategory('Matakuliah');
      setDueDate(defaultDate || '2024-10-02');
      setDueTime('23:59');
      setPriority('mendesak');
      setDescription('');
      setLocation('Google Classroom / LMS');
      setIconType('doc');
      setEmailEnabled(true);
      setRecipientEmail(defaultEmail);
      setRemindOffsets(['1-day', '6-hours']);
    }
  }, [editingItem, isOpen, defaultEmail, defaultDate]);

  if (!isOpen) return null;

  const toggleOffset = (offset: '3-days' | '1-day' | '6-hours' | '1-hour') => {
    if (remindOffsets.includes(offset)) {
      setRemindOffsets(remindOffsets.filter((o) => o !== offset));
    } else {
      setRemindOffsets([...remindOffsets, offset]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseName.trim()) {
      alert('Silakan isi judul tugas dan nama matakuliah/kegiatan!');
      return;
    }

    onSave(
      {
        title: title.trim(),
        courseName: courseName.trim(),
        category,
        dueDate,
        dueTime,
        priority,
        status: editingItem ? editingItem.status : 'belum-dikerjakan',
        iconType,
        description: description.trim(),
        location: location.trim(),
        emailReminder: {
          enabled: emailEnabled,
          recipientEmail: recipientEmail.trim(),
          remindOffsets,
          sentCount: editingItem ? editingItem.emailReminder.sentCount : 0,
          lastSentAt: editingItem ? editingItem.emailReminder.lastSentAt : undefined,
        },
      },
      editingItem ? editingItem.id : undefined,
      { syncToCalendar, notifyOnDevice }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {editingItem ? 'Edit Deadline' : 'Tambah Deadline Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              Isi rincian tugas kuliah dan atur jadwal pengingat email otomatis.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Judul Deadline / Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Tugas Metode Penelitian, Makalah AI..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Subject & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Mata Kuliah / Kategori Penyelenggara <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Metodologi Penelitian"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Kategori Bidang</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition"
              >
                <option value="Matakuliah">Matakuliah</option>
                <option value="Organisasi">Organisasi Mahasiswa</option>
                <option value="Administrasi">Administrasi Kampus</option>
                <option value="Proyek">Proyek / Lomba</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Batas Tanggal (Deadline) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Jam Pengumpulan (WIB) <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Priority selector matching photo categories */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Tingkat Urgensi / Prioritas</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('sangat-mendesak')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                  priority === 'sangat-mendesak'
                    ? 'bg-rose-50 text-rose-600 border-rose-300 ring-2 ring-rose-400'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                Sangat Mendesak
              </button>
              <button
                type="button"
                onClick={() => setPriority('mendesak')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                  priority === 'mendesak'
                    ? 'bg-orange-50 text-orange-600 border-orange-300 ring-2 ring-orange-400'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                Mendesak
              </button>
              <button
                type="button"
                onClick={() => setPriority('terjadwal')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                  priority === 'terjadwal'
                    ? 'bg-blue-50 text-blue-600 border-blue-300 ring-2 ring-blue-400'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                Terjadwal
              </button>
            </div>
          </div>

          {/* Location & Icon type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Platform / Lokasi Pengumpulan</label>
              <input
                type="text"
                placeholder="Google Classroom, SIAKAD, Ruang D104..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Pilih Ikon Visual</label>
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value as DeadlineItem['iconType'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition"
              >
                <option value="doc">📄 Dokumen / Tugas Makalah</option>
                <option value="presentation">🎓 Presentasi / Sidang</option>
                <option value="users">👥 Rapat Organisasi</option>
                <option value="card">💳 Pembayaran / UKT / Beasiswa</option>
                <option value="code">💻 Pemrograman / Koding</option>
                <option value="book">📚 Bacaan / Resume Jurnal</option>
                <option value="award">🏆 Lomba / Seminar</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Catatan Tambahan & Instruksi</label>
            <textarea
              rows={2}
              placeholder="Detail rubrik penilaian, link submission, format PDF..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Student Email Reminder Configuration */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Fitur Pengingat Email Mahasiswa</h4>
                  <p className="text-[10px] text-slate-500">Kirim reminder otomatis ke email kampus</p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {emailEnabled && (
              <div className="space-y-2 pt-1 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Mahasiswa Tujuan:
                  </label>
                  <input
                    type="email"
                    required={emailEnabled}
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    Waktu Pengiriman Pengingat:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: '3-days', label: 'H-3 Hari' },
                      { id: '1-day', label: 'H-1 Hari' },
                      { id: '6-hours', label: 'H-6 Jam' },
                      { id: '1-hour', label: 'H-1 Jam' },
                    ].map((item) => {
                      const isChecked = remindOffsets.includes(item.id as any);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleOffset(item.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 ${
                            isChecked
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Google Calendar & PC/HP Notification Toggles */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Notifikasi Device & Kalender
            </h4>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={notifyOnDevice}
                onChange={(e) => setNotifyOnDevice(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-800">
                  🔔 Bunyikan Chime & Munculkan Notifikasi di PC / HP
                </span>
                <p className="text-[10px] text-slate-500">
                  Mengirimkan pop-up pemberitahuan langsung ke notification tray laptop & HP Anda saat tugas ini ditambahkan atau mendekat.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs pt-1 border-t border-slate-200/60">
              <input
                type="checkbox"
                checked={syncToCalendar}
                onChange={(e) => setSyncToCalendar(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-800">
                  📅 Buka & Masukkan Otomatis ke Google Calendar
                </span>
                <p className="text-[10px] text-slate-500">
                  Langsung menyinkronkan event deadline ke Google Calendar dengan alarm pengingat 1 hari & 1 jam sebelum batas waktu.
                </p>
              </div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah Deadline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
