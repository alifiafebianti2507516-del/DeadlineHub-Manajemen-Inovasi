import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  initialDeadlines, 
  initialProfile, 
  initialEmailLogs 
} from './data/initialData';
import { 
  DeadlineItem, 
  StudentProfile, 
  EmailLog, 
  ActiveTab, 
  Priority, 
  TaskStatus,
  ShortcutLink,
  UserAccount,
  AppMenuItem,
  AppDisplayConfig,
  UserFeedback
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { StatCards } from './components/StatCards';
import { StudentShortcutsBar } from './components/StudentShortcutsBar';
import { DeadlineList } from './components/DeadlineList';
import { TipsCard } from './components/TipsCard';
import { CalendarWidget } from './components/CalendarWidget';
import { ActivitySummaryWidget } from './components/ActivitySummaryWidget';
import { WeeklyPriorityWidget } from './components/WeeklyPriorityWidget';
import { ModalDeadlineDetail } from './components/ModalDeadlineDetail';
import { ModalAddDeadline } from './components/ModalAddDeadline';
import { EmailReminderCenterModal } from './components/EmailReminderCenterModal';
import { FullCalendarView } from './components/FullCalendarView';
import { PriorityKanbanView } from './components/PriorityKanbanView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationSettingsBanner } from './components/NotificationSettingsBanner';
import { AlarmCenterModal } from './components/AlarmCenterModal';
import { AlarmRingingModal } from './components/AlarmRingingModal';
import { AuthLoginPage } from './components/AuthLoginPage';
import { InstallAppModal } from './components/InstallAppModal';
import { AdminPanelView } from './components/AdminPanelView';
import { UserFeedbackModal } from './components/UserFeedbackModal';
import { 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_DISPLAY_CONFIG, 
  INITIAL_USER_FEEDBACK 
} from './data/adminDefaults';
import { usePWAInstall } from './hooks/usePWAInstall';
import { CheckCircle2, Bell, X, Sparkles, Megaphone, Shield, FileText } from 'lucide-react';
import { formatDeadlineDate } from './utils/helpers';
import { 
  sendDeviceNotification, 
  openGoogleCalendarEvent, 
  playNotificationSound 
} from './utils/notifications';
import { startContinuousAlarm, stopContinuousAlarm } from './utils/alarmAudio';
import { DEFAULT_DEMO_SHORTCUTS, INITIAL_FACULTIES, INITIAL_STUDY_PROGRAMS } from './data/umAcademics';

export default function App() {
  // Current active student NIM / ID (only valid for registered non-demo accounts)
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem('deadlinehub_current_student_id');
    return saved && saved !== '2507516' ? saved : '';
  });

  // Registered accounts list (strictly user-registered accounts)
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('deadlinehub_registered_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((a) => !a.isDemo && a.studentId !== '2507516');
        }
      } catch {}
    }
    return [];
  });

  // Authentication session state (Login gate before entering website - must have registered account or admin)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = localStorage.getItem('deadlinehub_auth_session') === 'true';
    const activeId = localStorage.getItem('deadlinehub_current_student_id');
    if (!activeId || activeId === '2507516') {
      return false;
    }
    if (activeId === 'admin') {
      return session;
    }
    const saved = localStorage.getItem('deadlinehub_registered_accounts');
    if (saved) {
      try {
        const parsed: UserAccount[] = JSON.parse(saved);
        const match = parsed.some((a) => a.studentId === activeId && !a.isDemo && a.studentId !== '2507516');
        if (!match) return false;
      } catch {
        return false;
      }
    } else {
      return false;
    }
    return session;
  });

  // Admin & Customizer Navigation & Display states
  const [menuItems, setMenuItems] = useState<AppMenuItem[]>(() => {
    const saved = localStorage.getItem('deadlinehub_menu_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [displayConfig, setDisplayConfig] = useState<AppDisplayConfig>(() => {
    const saved = localStorage.getItem('deadlinehub_display_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_DISPLAY_CONFIG, ...parsed };
      } catch {}
    }
    return DEFAULT_DISPLAY_CONFIG;
  });

  const [feedbackList, setFeedbackList] = useState<UserFeedback[]>(() => {
    const saved = localStorage.getItem('deadlinehub_feedback_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_USER_FEEDBACK;
  });

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Dynamic Faculties and Study Programs (Managed by Admin)
  const [faculties, setFaculties] = useState<string[]>(() => {
    const saved = localStorage.getItem('deadlinehub_faculties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_FACULTIES;
  });

  const [studyPrograms, setStudyPrograms] = useState<string[]>(() => {
    const saved = localStorage.getItem('deadlinehub_study_programs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_STUDY_PROGRAMS;
  });

  // Admin Custom Password
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('deadlinehub_admin_password') || 'admin';
  });

  // Sync admin configurations to localStorage
  useEffect(() => {
    localStorage.setItem('deadlinehub_faculties', JSON.stringify(faculties));
  }, [faculties]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_study_programs', JSON.stringify(studyPrograms));
  }, [studyPrograms]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_display_config', JSON.stringify(displayConfig));
    if (displayConfig.appTitle || displayConfig.appTagline) {
      document.title = `${displayConfig.appTitle || 'DeadlineHub'} - ${displayConfig.appTagline || 'Satu Tempat, Semua Deadline'}`;
    }
  }, [displayConfig]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_feedback_list', JSON.stringify(feedbackList));
  }, [feedbackList]);

  // Handler for student feedback submission
  const handleNewFeedback = (item: Omit<UserFeedback, 'id' | 'createdAt' | 'status'>) => {
    const newFeedback: UserFeedback = {
      ...item,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
    showToast('Masukan berhasil dikirim ke Admin! 💌', 'Admin akan meninjau dan menerapkan usulan Anda.');
  };

  // Clean up any legacy demo account from storage on load
  useEffect(() => {
    const activeId = localStorage.getItem('deadlinehub_current_student_id');
    if (activeId === '2507516') {
      localStorage.removeItem('deadlinehub_current_student_id');
      localStorage.removeItem('deadlinehub_auth_session');
      setIsAuthenticated(false);
      setCurrentStudentId('');
    }
  }, []);

  // Deadlines: Starts from 0 for any new registered account
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    const activeId = localStorage.getItem('deadlinehub_current_student_id');
    if (activeId && activeId !== '2507516') {
      const saved = localStorage.getItem(`deadlinehub_items_${activeId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  // Shortcuts: Starts empty for newly registered accounts
  const [shortcuts, setShortcuts] = useState<ShortcutLink[]>(() => {
    const activeId = localStorage.getItem('deadlinehub_current_student_id');
    if (activeId && activeId !== '2507516') {
      const saved = localStorage.getItem(`deadlinehub_shortcuts_${activeId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const activeId = localStorage.getItem('deadlinehub_current_student_id');
    if (activeId && activeId !== '2507516') {
      const saved = localStorage.getItem(`deadlinehub_profile_${activeId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialProfile;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const activeId = localStorage.getItem('deadlinehub_current_student_id');
    if (activeId && activeId !== '2507516') {
      const saved = localStorage.getItem(`deadlinehub_email_logs_${activeId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });


  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);

  // Modals
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<DeadlineItem | null>(null);
  const [isEmailCenterOpen, setIsEmailCenterOpen] = useState(false);
  const [isAlarmCenterOpen, setIsAlarmCenterOpen] = useState(false);
  const [ringingDeadline, setRingingDeadline] = useState<DeadlineItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quickDateForAdd, setQuickDateForAdd] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const pwaState = usePWAInstall();

  // Toast alert
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    subtext?: string;
    type: 'success' | 'info';
  } | null>(null);

  // Alarm Ringing & Controls
  const handleTestRingAlarm = (target?: DeadlineItem) => {
    const task = target || deadlines.find((d) => d.status !== 'selesai') || deadlines[0];
    if (!task) return;
    setRingingDeadline(task);
    startContinuousAlarm(
      task.alarm?.tone || 'shock-siren',
      task.alarm?.volume || 0.85,
      task.title,
      task.courseName
    );
    sendDeviceNotification(
      `🚨 [ALERTA ANTI-NUNDA] ${task.title}!`,
      `Woi bangun! Deadline ${formatDeadlineDate(task.dueDate, task.dueTime)} sudah mepet! Cepat kumpulkan!`,
      { playSound: false }
    );
  };

  const handleDismissAlarm = () => {
    stopContinuousAlarm();
    setRingingDeadline(null);
  };

  const handleSnoozeAlarm = (deadlineId: string, minutes: number) => {
    stopContinuousAlarm();
    setRingingDeadline(null);
    showToast(`Alarm ditunda selama ${minutes} menit ⏰`);
    setTimeout(() => {
      const task = deadlines.find((d) => d.id === deadlineId);
      if (task) {
        handleTestRingAlarm(task);
      }
    }, minutes * 60 * 1000);
  };

  const handleToggleTaskAlarm = (deadlineId: string, enabled: boolean) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === deadlineId
          ? {
              ...d,
              alarm: {
                enabled,
                offset: d.alarm?.offset || 'at-deadline',
                tone: d.alarm?.tone || 'digital',
                volume: d.alarm?.volume || 0.7,
              },
            }
          : d
      )
    );
    showToast(`Alarm tugas ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const handleUpdateAlarmSettings = (
    deadlineId: string,
    offset: import('./types').AlarmOffset,
    tone: import('./types').AlarmTone
  ) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === deadlineId
          ? {
              ...d,
              alarm: {
                enabled: d.alarm?.enabled ?? true,
                offset,
                tone,
                volume: d.alarm?.volume || 0.7,
              },
            }
          : d
      )
    );
    showToast(`Pengaturan alarm tugas diperbarui!`);
  };

  // Persist state changes per student
  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem(`deadlinehub_items_${currentStudentId}`, JSON.stringify(deadlines));
      localStorage.setItem('deadlinehub_items', JSON.stringify(deadlines));
    }
  }, [deadlines, currentStudentId]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem(`deadlinehub_shortcuts_${currentStudentId}`, JSON.stringify(shortcuts));
    }
  }, [shortcuts, currentStudentId]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem(`deadlinehub_profile_${currentStudentId}`, JSON.stringify(profile));
      localStorage.setItem('deadlinehub_profile', JSON.stringify(profile));
    }
  }, [profile, currentStudentId]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem(`deadlinehub_email_logs_${currentStudentId}`, JSON.stringify(emailLogs));
      localStorage.setItem('deadlinehub_email_logs', JSON.stringify(emailLogs));
    }
  }, [emailLogs, currentStudentId]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_current_student_id', currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_display_config', JSON.stringify(displayConfig));
  }, [displayConfig]);

  useEffect(() => {
    localStorage.setItem('deadlinehub_feedback_list', JSON.stringify(feedbackList));
  }, [feedbackList]);

  const handleResetAdminDefaults = () => {
    setMenuItems(DEFAULT_MENU_ITEMS);
    setDisplayConfig(DEFAULT_DISPLAY_CONFIG);
    localStorage.setItem('deadlinehub_menu_items', JSON.stringify(DEFAULT_MENU_ITEMS));
    localStorage.setItem('deadlinehub_display_config', JSON.stringify(DEFAULT_DISPLAY_CONFIG));
    showToast('Menu dan tampilan berhasil dikembalikan ke standar awal! 🔄');
  };

  const showToast = (text: string, subtext?: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, subtext, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Shortcut CRUD handlers
  const handleAddShortcut = (item: Omit<ShortcutLink, 'id' | 'createdAt'>) => {
    const newShortcut: ShortcutLink = {
      ...item,
      id: `sc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setShortcuts((prev) => [newShortcut, ...prev]);
    showToast(`Tautan pintasan "${newShortcut.title}" berhasil ditambahkan! 🔗`);
  };

  const handleEditShortcut = (id: string, updated: Omit<ShortcutLink, 'id' | 'createdAt'>) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast(`Pintasan berhasil diperbarui! ✨`);
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
    showToast(`Pintasan telah dihapus.`);
  };

  const handleLoadDefaultPresets = () => {
    setShortcuts(DEFAULT_DEMO_SHORTCUTS);
    showToast(`Pintasan resmi kampus (SIAKAD, SIPEJAR, SIMAWA, SIPADU, Google Drive) berhasil dipasang! ⚡`);
  };

  // Register New Student (Mahasiswa Baru Mulai dari Nol)
  const handleRegisterAccount = (newAccount: UserAccount) => {
    const updatedAccounts = [
      ...registeredAccounts.filter((a) => a.studentId !== newAccount.studentId),
      newAccount,
    ];
    setRegisteredAccounts(updatedAccounts);
    localStorage.setItem('deadlinehub_registered_accounts', JSON.stringify(updatedAccounts));

    const newProfile: StudentProfile = {
      name: newAccount.name,
      role: 'Mahasiswa',
      email: newAccount.email,
      university: 'Universitas Negeri Malang',
      faculty: newAccount.faculty,
      major: newAccount.major,
      studentId: newAccount.studentId,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      autoEmailReminders: true,
      defaultReminderOffset: '1-day',
      browserNotificationEnabled: true,
    };

    // User requirement:
    // "apabila ada login akun baru, seluruh data atau grafik harus dimulai dari nol dan dapat berfungsi apabila ada aktivitas baru ditambahkan, lalu pintasan mahasiswa juga dikosongkan dulu agar mahasiswa bisa menambahkan sendiri sesuai dengan kategori yang tersedia"
    setCurrentStudentId(newAccount.studentId);
    localStorage.setItem('deadlinehub_current_student_id', newAccount.studentId);

    setDeadlines([]);
    localStorage.setItem(`deadlinehub_items_${newAccount.studentId}`, JSON.stringify([]));

    setShortcuts([]);
    localStorage.setItem(`deadlinehub_shortcuts_${newAccount.studentId}`, JSON.stringify([]));

    setProfile(newProfile);
    localStorage.setItem(`deadlinehub_profile_${newAccount.studentId}`, JSON.stringify(newProfile));

    setEmailLogs([]);
    localStorage.setItem(`deadlinehub_email_logs_${newAccount.studentId}`, JSON.stringify([]));

    setIsAuthenticated(true);
    localStorage.setItem('deadlinehub_auth_session', 'true');

    showToast(
      `Selamat datang di DeadlineHub, ${newAccount.name}! 🎉`,
      `Akun baru terdaftar. Seluruh data & grafik dimulai dari nol (0).`
    );
  };

  // Login Handler (Loads data for this specific registered student)
  const handleLoginSuccess = (studentId: string, account?: UserAccount) => {
    setCurrentStudentId(studentId);
    localStorage.setItem('deadlinehub_current_student_id', studentId);

    // 1. Deadlines
    const savedTasks = localStorage.getItem(`deadlinehub_items_${studentId}`);
    if (savedTasks) {
      try {
        setDeadlines(JSON.parse(savedTasks));
      } catch {
        setDeadlines([]);
      }
    } else {
      setDeadlines([]);
      localStorage.setItem(`deadlinehub_items_${studentId}`, JSON.stringify([]));
    }

    // 2. Shortcuts
    const savedShortcuts = localStorage.getItem(`deadlinehub_shortcuts_${studentId}`);
    if (savedShortcuts) {
      try {
        setShortcuts(JSON.parse(savedShortcuts));
      } catch {
        setShortcuts([]);
      }
    } else {
      setShortcuts([]);
      localStorage.setItem(`deadlinehub_shortcuts_${studentId}`, JSON.stringify([]));
    }

    // 3. Profile
    const savedProfile = localStorage.getItem(`deadlinehub_profile_${studentId}`);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        setProfile(initialProfile);
      }
    } else if (account) {
      const freshProfile: StudentProfile = {
        name: account.name,
        role: account.role === 'admin' ? 'Administrator' : 'Mahasiswa',
        email: account.email,
        university: 'Universitas Negeri Malang',
        faculty: account.faculty,
        major: account.major,
        studentId: account.studentId,
        avatarUrl: account.role === 'admin' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        autoEmailReminders: true,
        defaultReminderOffset: '1-day',
        browserNotificationEnabled: true,
      };
      setProfile(freshProfile);
      localStorage.setItem(`deadlinehub_profile_${studentId}`, JSON.stringify(freshProfile));
    } else {
      setProfile(initialProfile);
    }

    // 4. Email logs
    const savedLogs = localStorage.getItem(`deadlinehub_email_logs_${studentId}`);
    if (savedLogs) {
      try {
        setEmailLogs(JSON.parse(savedLogs));
      } catch {
        setEmailLogs([]);
      }
    } else {
      setEmailLogs([]);
      localStorage.setItem(`deadlinehub_email_logs_${studentId}`, JSON.stringify([]));
    }

    if (studentId === 'admin' || account?.role === 'admin') {
      setActiveTab('admin');
    }

    setIsAuthenticated(true);
    localStorage.setItem('deadlinehub_auth_session', 'true');
    showToast(
      studentId === 'admin' ? 'Selamat datang di Panel Admin DeadlineHub! 🛡️' : `Selamat datang di DeadlineHub, ${account?.name || studentId}! 👋`,
      studentId === 'admin' ? 'Mode Administrator Aktif: Akses penuh kelola menu & tampilan.' : `Berhasil masuk dengan NIM Mahasiswa: ${studentId}`
    );
  };


  const handleLogout = () => {
    stopContinuousAlarm();
    setRingingDeadline(null);
    setIsAlarmCenterOpen(false);
    setIsEmailCenterOpen(false);
    setIsAddModalOpen(false);
    setSelectedDeadline(null);
    setIsMobileMenuOpen(false);
    setIsAuthenticated(false);
    localStorage.removeItem('deadlinehub_auth_session');
    localStorage.setItem('deadlinehub_auth_session', 'false');
    showToast('Berhasil keluar (logout) dari akun mahasiswa. 👋');
  };

  // Toggle status with celebration confetti
  const handleToggleStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus: TaskStatus = d.status === 'selesai' ? 'belum-dikerjakan' : 'selesai';
          if (nextStatus === 'selesai') {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.75 },
              colors: ['#1E6BFF', '#10B981', '#F59E0B', '#EF4444'],
            });
            showToast(`Tugas "${d.title}" berhasil diselesaikan! 🎉`, 'Tetap semangat menyelesaikan tugas berikutnya.');
          }
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const handleUpdateStatus = (id: string, newStatus: TaskStatus) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          if (newStatus === 'selesai') {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.75 },
              colors: ['#1E6BFF', '#10B981', '#F59E0B'],
            });
            showToast(`Tugas "${d.title}" ditandai selesai! 🎉`);
          }
          return { ...d, status: newStatus };
        }
        return d;
      })
    );
    if (selectedDeadline && selectedDeadline.id === id) {
      setSelectedDeadline((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Dispatch Email Reminder (Simulation & Web Notification)
  const handleTriggerSendEmail = (deadline: DeadlineItem) => {
    const newLog: EmailLog = {
      id: `email-${Date.now()}`,
      deadlineId: deadline.id,
      deadlineTitle: deadline.title,
      courseName: deadline.courseName,
      dueDate: deadline.dueDate,
      dueTime: deadline.dueTime,
      recipientEmail: profile.email,
      sentAt: new Date().toISOString(),
      triggerType: 'manual_test',
      previewSnippet: `🚨 [DeadlineHub Alert] ${deadline.title} (${deadline.courseName}) deadline ${formatDeadlineDate(
        deadline.dueDate,
        deadline.dueTime
      )}. Segera kumpulkan!`,
    };

    setEmailLogs((prev) => [newLog, ...prev]);

    // Update deadline sentCount
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === deadline.id
          ? {
              ...d,
              emailReminder: {
                ...d.emailReminder,
                sentCount: (d.emailReminder.sentCount || 0) + 1,
                lastSentAt: new Date().toISOString(),
              },
            }
          : d
      )
    );

    // Browser Notification if granted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ Pengingat Deadline: ${deadline.title}`, {
          body: `Batas waktu: ${formatDeadlineDate(deadline.dueDate, deadline.dueTime)}. Dikirim ke ${profile.email}`,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.error('Notification error', err);
      }
    }

    showToast(
      `Email pengingat terkirim ke ${profile.email}! 📧`,
      `Pemberitahuan untuk "${deadline.title}" telah diproses.`
    );
  };

  const handleQuickSendEmail = (deadline: DeadlineItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleTriggerSendEmail(deadline);
  };

  // Add / Edit deadline handler
  const handleSaveDeadline = (
    data: Omit<DeadlineItem, 'id' | 'createdAt'>,
    existingId?: string,
    syncOptions?: { syncToCalendar: boolean; notifyOnDevice: boolean }
  ) => {
    if (existingId) {
      setDeadlines((prev) =>
        prev.map((d) => (d.id === existingId ? { ...data, id: existingId, createdAt: d.createdAt } : d))
      );
      showToast(`Tugas "${data.title}" berhasil diperbarui!`);
    } else {
      const newItem: DeadlineItem = {
        ...data,
        id: `dl-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setDeadlines((prev) => [newItem, ...prev]);

      // Multi-Platform Notification: PC & HP
      if (syncOptions?.notifyOnDevice !== false) {
        sendDeviceNotification(
          `📌 Deadline Baru: ${data.title}`,
          `${data.courseName} • Batas: ${formatDeadlineDate(data.dueDate, data.dueTime)}`,
          { playSound: true }
        );
      }

      // Google Calendar Sync: Opens Google Calendar with pre-set alarm
      if (syncOptions?.syncToCalendar) {
        openGoogleCalendarEvent(data);
      }

      showToast(
        `Deadline "${data.title}" tersimpan! 🎯`,
        syncOptions?.syncToCalendar
          ? 'Notifikasi dikirim ke PC/HP & event dibuka di Google Calendar.'
          : 'Notifikasi pengingat diaktifkan di PC & HP Anda.'
      );
    }
    setEditingDeadline(null);
  };

  const handleDeleteDeadline = (id: string) => {
    const item = deadlines.find((d) => d.id === id);
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
    showToast(`Deadline "${item?.title || ''}" telah dihapus.`);
  };

  const handleResetToPhotoData = () => {
    setDeadlines(initialDeadlines);
    setProfile(initialProfile);
    setEmailLogs(initialEmailLogs);
    showToast('Data berhasil di-reset sesuai jadwal resmi Oktober 2026! 📸');
  };

  // Refresh & Bug Recovery Handlers
  const handleQuickRefresh = () => {
    setIsRefreshing(true);
    // Stop any runaway alarm audio if a bug occurred
    stopContinuousAlarm();
    setRingingDeadline(null);

    // Clear hung filter states
    setSelectedFilter(null);
    setSelectedDate(null);
    setSelectedPriority(null);
    setSelectedStatusFilter(null);
    setSearchQuery('');

    // Re-verify & heal localStorage
    try {
      const saved = localStorage.getItem('deadlinehub_items');
      if (saved) {
        const parsed: DeadlineItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDeadlines(parsed);
        } else {
          setDeadlines(initialDeadlines);
        }
      } else {
        setDeadlines(initialDeadlines);
      }
    } catch (err) {
      console.warn('Healing corrupted deadlines during refresh:', err);
      setDeadlines(initialDeadlines);
      localStorage.setItem('deadlinehub_items', JSON.stringify(initialDeadlines));
    }

    setTimeout(() => {
      setIsRefreshing(false);
      showToast(
        'Website Berhasil Disegarkan! 🔄',
        'Data tugas disinkronkan, filter dibersihkan, dan sistem pengingat aktif.'
      );
    }, 600);
  };

  const handleHardReload = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Apakah Anda ingin mereset data dan memperbaiki bug?\n\nSemua tugas akan dipulihkan ke jadwal resmi default Oktober 2026 dan cache yang rusak akan dibersihkan.'
      )
    ) {
      setIsRefreshing(true);
      stopContinuousAlarm();
      setRingingDeadline(null);
      setDeadlines(initialDeadlines);
      setProfile(initialProfile);
      setEmailLogs(initialEmailLogs);
      localStorage.setItem('deadlinehub_items', JSON.stringify(initialDeadlines));
      localStorage.setItem('deadlinehub_profile', JSON.stringify(initialProfile));
      localStorage.setItem('deadlinehub_email_logs', JSON.stringify(initialEmailLogs));

      // Reset filters
      setSelectedFilter(null);
      setSelectedDate(null);
      setSelectedPriority(null);
      setSelectedStatusFilter(null);
      setSearchQuery('');

      setTimeout(() => {
        setIsRefreshing(false);
        showToast(
          'Sistem Berhasil Dipulihkan! 🛠️',
          'Data telah di-reset ke jadwal resmi Oktober 2026. Semua potensi bug telah diperbaiki.'
        );
      }, 600);
    }
  };


  // Filter deadlines for display
  const filteredDeadlines = deadlines.filter((d) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchCourse = d.courseName.toLowerCase().includes(q);
      const matchCategory = d.category.toLowerCase().includes(q);
      const matchDesc = (d.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCourse && !matchCategory && !matchDesc) return false;
    }

    // Card filter
    if (selectedFilter) {
      if (selectedFilter === 'mendesak') {
        if (d.status === 'selesai' || (d.priority !== 'sangat-mendesak' && d.priority !== 'mendesak')) {
          return false;
        }
      } else if (selectedFilter === 'terjadwal') {
        if (d.status === 'selesai' || d.priority !== 'terjadwal') return false;
      } else if (selectedFilter === 'selesai') {
        if (d.status !== 'selesai') return false;
      }
    }

    // Date filter from calendar widget
    if (selectedDate && d.dueDate !== selectedDate) {
      return false;
    }

    // Priority filter from priority widget
    if (selectedPriority && d.priority !== selectedPriority) {
      return false;
    }

    // Status filter from activity summary
    if (selectedStatusFilter && d.status !== selectedStatusFilter) {
      return false;
    }

    return true;
  });

  // Login Gate: Show AuthLoginPage if student is not yet authenticated
  if (!isAuthenticated) {
    return (
      <>
        <AuthLoginPage
          onLoginSuccess={handleLoginSuccess}
          onRegisterAccount={handleRegisterAccount}
          profile={profile}
          accounts={registeredAccounts}
          pwaState={pwaState}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          displayConfig={displayConfig}
          faculties={faculties}
          studyPrograms={studyPrograms}
          adminPassword={adminPassword}
        />
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          pwaState={pwaState}
        />
      </>
    );
  }


  return (
    <div className="min-h-screen bg-[#F4F7FC] flex font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-start gap-3 p-4 rounded-2xl bg-white shadow-2xl border border-slate-100 max-w-sm animate-in slide-in-from-top-4 fade-in">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-slate-900">{toastMessage.text}</p>
            {toastMessage.subtext && (
              <p className="text-[11px] text-slate-500 mt-0.5">{toastMessage.subtext}</p>
            )}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'tambah') {
            setEditingDeadline(null);
            setQuickDateForAdd(null);
            setIsAddModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        profile={profile}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        openEmailCenter={() => setIsEmailCenterOpen(true)}
        openAlarmCenter={() => setIsAlarmCenterOpen(true)}
        unreadEmailCount={emailLogs.length}
        onLogout={handleLogout}
        onRefresh={handleQuickRefresh}
        pwaState={pwaState}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        menuItems={menuItems}
        displayConfig={displayConfig}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenAdminPanel={() => setActiveTab('admin')}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Sticky Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          profile={profile}
          emailLogs={emailLogs}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenEmailCenter={() => setIsEmailCenterOpen(true)}
          onNavigateToSettings={() => setActiveTab('pengaturan')}
          onLogout={handleLogout}
          onQuickRefresh={handleQuickRefresh}
          onHardReload={handleHardReload}
          onResetData={handleResetData}
          isRefreshing={isRefreshing}
          pwaState={pwaState}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenAdminPanel={() => setActiveTab('admin')}
          onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
          isAdminMode={activeTab === 'admin' || currentStudentId === 'admin'}
        />

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {/* Global Announcement Banner if enabled by Admin */}
          {displayConfig.announcementBanner?.enabled && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in ${
              displayConfig.announcementBanner.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : displayConfig.announcementBanner.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-4 h-4 shrink-0 text-blue-600" />
                <span className="font-semibold">{displayConfig.announcementBanner.text}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDisplayConfig((prev) => ({
                    ...prev,
                    announcementBanner: { ...prev.announcementBanner, enabled: false },
                  }))
                }
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Tutup Pengumuman"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {/* Active Filter Pill Bar if filters applied */}
          {(selectedFilter || selectedDate || selectedPriority || selectedStatusFilter || searchQuery) && (
            <div className="mb-4 flex items-center gap-2 flex-wrap bg-blue-50/70 p-3 rounded-2xl border border-blue-200/60 text-xs text-blue-900 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Filter Aktif:
              </span>
              {selectedFilter && (
                <span className="bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 font-semibold flex items-center gap-1">
                  Kategori: {selectedFilter}
                  <button onClick={() => setSelectedFilter(null)} className="text-slate-400 hover:text-slate-700">×</button>
                </span>
              )}
              {selectedDate && (
                <span className="bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 font-semibold flex items-center gap-1">
                  Tanggal: {selectedDate}
                  <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-700">×</button>
                </span>
              )}
              {selectedPriority && (
                <span className="bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 font-semibold flex items-center gap-1">
                  Prioritas: {selectedPriority}
                  <button onClick={() => setSelectedPriority(null)} className="text-slate-400 hover:text-slate-700">×</button>
                </span>
              )}
              {selectedStatusFilter && (
                <span className="bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 font-semibold flex items-center gap-1">
                  Status: {selectedStatusFilter}
                  <button onClick={() => setSelectedStatusFilter(null)} className="text-slate-400 hover:text-slate-700">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 font-semibold flex items-center gap-1">
                  Cari: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedFilter(null);
                  setSelectedDate(null);
                  setSelectedPriority(null);
                  setSelectedStatusFilter(null);
                  setSearchQuery('');
                }}
                className="ml-auto text-xs font-bold text-blue-700 hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* VIEW: DASHBOARD (Matches photo layout) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Notification & Google Calendar Banner */}
              <NotificationSettingsBanner
                deadlines={deadlines}
                onShowToast={(msg, sub) => showToast(msg, sub)}
                onOpenAlarmCenter={() => setIsAlarmCenterOpen(true)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Middle Section: Greeting, Stats, Deadlines list, Tips (8 cols on desktop) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Greeting Header matching screenshot */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      Halo, {profile.name.split(' ')[0]}! <span className="inline-block animate-bounce">👋</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Kelola semua deadline-mu dalam satu tempat. Tetap fokus dan raih tujuan!
                    </p>
                  </div>

                {/* 4 Colored Stat Cards */}
                <StatCards
                  deadlines={deadlines}
                  selectedFilter={selectedFilter}
                  onSelectFilter={setSelectedFilter}
                />

                {/* Kategori Tautan Pintasan Mahasiswa (SIAKAD, SIPEJAR, SIMAWA, SIPADU, Google Drive, Lainnya) */}
                <StudentShortcutsBar
                  shortcuts={shortcuts}
                  onAddShortcut={handleAddShortcut}
                  onEditShortcut={handleEditShortcut}
                  onDeleteShortcut={handleDeleteShortcut}
                  onLoadDefaultPresets={handleLoadDefaultPresets}
                />

                {/* Deadline Terdekat List */}
                <DeadlineList
                  deadlines={filteredDeadlines}
                  onSelectDeadline={(item) => setSelectedDeadline(item)}
                  onToggleStatus={handleToggleStatus}
                  onQuickSendEmail={handleQuickSendEmail}
                  onViewAllClick={() => setActiveTab('prioritas')}
                  isDashboardView={true}
                />

                {/* Tips Hari Ini Card */}
                <TipsCard />
              </div>

              {/* Right Section: Calendar, Activity Summary Donut, Weekly Priorities (4 cols on desktop) */}
              <div className="lg:col-span-4 space-y-5">
                {/* Calendar Widget */}
                <CalendarWidget
                  deadlines={deadlines}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onOpenFullCalendar={() => setActiveTab('kalender')}
                />

                {/* Ringkasan Kegiatan Donut Chart Widget */}
                <ActivitySummaryWidget
                  deadlines={deadlines}
                  onFilterStatus={setSelectedStatusFilter}
                  activeStatusFilter={selectedStatusFilter}
                />

                {/* Prioritas Minggu Ini Bars Widget */}
                <WeeklyPriorityWidget
                  deadlines={deadlines}
                  selectedPriority={selectedPriority}
                  onSelectPriority={setSelectedPriority}
                />
              </div>
            </div>
          </div>
        )}

          {/* VIEW: FULL INTERACTIVE CALENDAR */}
          {activeTab === 'kalender' && (
            <FullCalendarView
              deadlines={deadlines}
              onSelectDeadline={(item) => setSelectedDeadline(item)}
              onAddNewDeadlineOnDate={(dateStr) => {
                setQuickDateForAdd(dateStr);
                setEditingDeadline(null);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {/* VIEW: PRIORITY KANBAN BOARD */}
          {activeTab === 'prioritas' && (
            <PriorityKanbanView
              deadlines={filteredDeadlines}
              onSelectDeadline={(item) => setSelectedDeadline(item)}
              onUpdateStatus={handleUpdateStatus}
              onAddNewWithPriority={(p) => {
                setEditingDeadline(null);
                setQuickDateForAdd(null);
                setIsAddModalOpen(true);
              }}
              onQuickSendEmail={handleQuickSendEmail}
            />
          )}

          {/* VIEW: PROGRESS & ANALYTICS */}
          {activeTab === 'progress' && (
            <ProgressView
              deadlines={deadlines}
              onSelectDeadline={(item) => setSelectedDeadline(item)}
            />
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'pengaturan' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={setProfile}
              onResetToPhotoData={handleResetToPhotoData}
              onQuickRefresh={handleQuickRefresh}
              onHardReload={handleHardReload}
              pwaState={pwaState}
              onOpenInstallModal={() => setIsInstallModalOpen(true)}
              onTriggerTestEmail={() => {
                const sampleTask = deadlines[0];
                if (sampleTask) handleTriggerSendEmail(sampleTask);
              }}
            />
          )}

          {/* VIEW: ADMIN PANEL */}
          {activeTab === 'admin' && (
            <AdminPanelView
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              displayConfig={displayConfig}
              setDisplayConfig={setDisplayConfig}
              feedbackList={feedbackList}
              setFeedbackList={setFeedbackList}
              accounts={registeredAccounts}
              setAccounts={setRegisteredAccounts}
              faculties={faculties}
              setFaculties={setFaculties}
              studyPrograms={studyPrograms}
              setStudyPrograms={setStudyPrograms}
              adminPassword={adminPassword}
              setAdminPassword={setAdminPassword}
              onResetToDefaults={() => {
                setMenuItems(DEFAULT_MENU_ITEMS);
                setDisplayConfig(DEFAULT_DISPLAY_CONFIG);
                setFeedbackList(INITIAL_USER_FEEDBACK);
                setFaculties(INITIAL_FACULTIES);
                setStudyPrograms(INITIAL_STUDY_PROGRAMS);
                localStorage.removeItem('deadlinehub_menu_items');
                localStorage.removeItem('deadlinehub_display_config');
                localStorage.removeItem('deadlinehub_feedback_list');
                localStorage.removeItem('deadlinehub_faculties');
                localStorage.removeItem('deadlinehub_study_programs');
                showToast('Pengaturan admin berhasil di-reset ke bawaan resmi UM! 🔄');
              }}
              showToast={(text, subtext, type) => showToast(text, subtext, type)}
              onExitAdminMode={() => setActiveTab('dashboard')}
            />
          )}

          {/* VIEW: CUSTOM MENU CREATED BY ADMIN */}
          {menuItems.some((m) => m.id === activeTab && m.targetType === 'custom_view') && (() => {
            const customItem = menuItems.find((m) => m.id === activeTab);
            if (!customItem) return null;
            return (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 max-w-4xl mx-auto animate-in fade-in">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-slate-800">
                        {customItem.customTitle || customItem.label}
                      </h1>
                      {customItem.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-semibold border border-blue-200">
                          {customItem.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Halaman Informasi Akademik Mahasiswa • Universitas Negeri Malang
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {customItem.customContent || 'Konten informasi menu ini belum ditambahkan oleh Admin.'}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              </div>
            );
          })()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingDeadline(null);
          setQuickDateForAdd(null);
          setIsAddModalOpen(true);
        }}
        onOpenEmailCenter={() => setIsEmailCenterOpen(true)}
        onOpenAlarmCenter={() => setIsAlarmCenterOpen(true)}
        unreadEmailCount={emailLogs.length}
      />

      {/* MODAL: DEADLINE DETAILS */}
      <ModalDeadlineDetail
        deadline={selectedDeadline}
        onClose={() => setSelectedDeadline(null)}
        onUpdateStatus={handleUpdateStatus}
        onSendEmailReminder={handleTriggerSendEmail}
        onRingAlarm={handleTestRingAlarm}
        onEdit={(item) => {
          setEditingDeadline(item);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteDeadline}
        studentEmail={profile.email}
      />

      {/* MODAL: ADD / EDIT DEADLINE */}
      <ModalAddDeadline
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDeadline(null);
          setQuickDateForAdd(null);
        }}
        onSave={handleSaveDeadline}
        editingItem={editingDeadline}
        defaultEmail={profile.email}
        defaultDate={quickDateForAdd}
      />

      {/* MODAL: EMAIL REMINDER CENTER (STUDENT INBOX SIMULATOR & LOGS) */}
      <EmailReminderCenterModal
        isOpen={isEmailCenterOpen}
        onClose={() => setIsEmailCenterOpen(false)}
        profile={profile}
        deadlines={deadlines}
        emailLogs={emailLogs}
        onTriggerSendEmail={handleTriggerSendEmail}
      />

      {/* MODAL: JAM ALARM CENTER (PC & HP) */}
      <AlarmCenterModal
        isOpen={isAlarmCenterOpen}
        onClose={() => setIsAlarmCenterOpen(false)}
        deadlines={deadlines}
        onToggleTaskAlarm={handleToggleTaskAlarm}
        onUpdateAlarmSettings={handleUpdateAlarmSettings}
        onTestRingAlarm={handleTestRingAlarm}
      />

      {/* MODAL: ACTIVE RINGING ALARM SCREEN */}
      <AlarmRingingModal
        ringingDeadline={ringingDeadline}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
        onOpenTaskDetails={(task) => setSelectedDeadline(task)}
      />

      {/* MODAL: PWA INSTALLATION (PC & HP) */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        pwaState={pwaState}
      />

      {/* MODAL: KOTAK SARAN & MASUKAN MAHASISWA */}
      <UserFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        profile={profile}
        feedbackList={feedbackList}
        onSubmitFeedback={handleNewFeedback}
        onOpenAdminPanel={() => setActiveTab('admin')}
      />
    </div>
  );
}
