export type Priority = 'sangat-mendesak' | 'mendesak' | 'terjadwal';
export type TaskStatus = 'belum-dikerjakan' | 'sedang-dikerjakan' | 'selesai';
export type Category = 'Matakuliah' | 'Organisasi' | 'Administrasi' | 'Proyek' | 'Lainnya';

export interface EmailReminderConfig {
  enabled: boolean;
  recipientEmail: string;
  remindOffsets: ('3-days' | '1-day' | '6-hours' | '1-hour')[];
  lastSentAt?: string;
  sentCount: number;
}

export type AlarmTone = 'digital' | 'marimba' | 'radar' | 'shock-siren' | 'voice-alert' | 'airhorn';
export type AlarmOffset = 'at-deadline' | '1-hour' | '3-hours' | '1-day' | 'custom';

export interface AlarmConfig {
  enabled: boolean;
  offset: AlarmOffset;
  customTime?: string; // HH:mm
  customDate?: string; // YYYY-MM-DD
  tone: AlarmTone;
  volume: number; // 0 to 1
  snoozedUntil?: string; // ISO string
  hasTriggered?: boolean;
  shockMode?: boolean; // Extra shocking visual & audio for procrastinators!
}

export interface DeadlineItem {
  id: string;
  title: string;
  category: Category;
  courseName: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  iconType: 'doc' | 'presentation' | 'users' | 'card' | 'code' | 'book' | 'award';
  description?: string;
  location?: string;
  emailReminder: EmailReminderConfig;
  alarm?: AlarmConfig;
  createdAt: string;
}

export interface StudentProfile {
  name: string;
  role: string;
  email: string;
  university: string;
  faculty: string;
  major: string;
  studentId: string;
  avatarUrl: string;
  autoEmailReminders: boolean;
  defaultReminderOffset: '3-days' | '1-day' | '6-hours' | '1-hour';
  browserNotificationEnabled: boolean;
}

export interface EmailLog {
  id: string;
  deadlineId: string;
  deadlineTitle: string;
  courseName: string;
  dueDate: string;
  dueTime: string;
  recipientEmail: string;
  sentAt: string;
  triggerType: 'manual_test' | 'scheduled' | 'h-1' | 'h-3' | 'urgent';
  previewSnippet: string;
}

export type ShortcutCategory = 
  | 'SIAKAD'
  | 'SIPEJAR'
  | 'SIMAWA'
  | 'SIPADU'
  | 'Google Drive file tugas'
  | 'Lainnya';

export interface ShortcutLink {
  id: string;
  title: string;
  url: string;
  category: ShortcutCategory;
  description?: string;
  createdAt: string;
}

export interface UserAccount {
  studentId: string;
  name: string;
  email: string;
  faculty: string;
  major: string;
  password?: string;
  role?: 'mahasiswa' | 'admin';
  isDemo?: boolean;
}

export type MenuIconKey = 
  | 'home' 
  | 'plus' 
  | 'calendar' 
  | 'star' 
  | 'chart' 
  | 'settings' 
  | 'link' 
  | 'book' 
  | 'globe' 
  | 'bell' 
  | 'folder' 
  | 'users' 
  | 'message'
  | 'shield';

export interface AppMenuItem {
  id: string;
  label: string;
  icon: MenuIconKey;
  enabled: boolean;
  isSystem: boolean;
  targetType: 'internal_tab' | 'external_url' | 'custom_view';
  internalTab?: ActiveTab;
  externalUrl?: string;
  customTitle?: string;
  customContent?: string;
  badge?: string;
  order: number;
}

export type FeedbackCategory = 'menu_baru' | 'tampilan_tema' | 'fitur' | 'bug' | 'lainnya';
export type FeedbackStatus = 'pending' | 'reviewing' | 'implemented' | 'declined';

export interface UserFeedback {
  id: string;
  studentId: string;
  studentName: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: FeedbackStatus;
  createdAt: string;
  adminResponse?: string;
  implementedAt?: string;
}

export interface AppDisplayConfig {
  appTitle: string;
  appTagline: string;
  portalSubtitle: string;
  loginBgUrl: string;
  logoUrl?: string;
  bgOverlayDarkness: number; // 0.2 to 0.9
  primaryColorTheme: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';
  announcementBanner: {
    enabled: boolean;
    text: string;
    type: 'info' | 'success' | 'warning';
  };
  visibleWidgets: {
    statCards: boolean;
    shortcuts: boolean;
    calendarMini: boolean;
    activitySummary: boolean;
    weeklyPriority: boolean;
    tipsCard: boolean;
  };
}

export type ActiveTab = 
  | 'dashboard' 
  | 'tambah' 
  | 'kalender' 
  | 'prioritas' 
  | 'progress' 
  | 'pengaturan' 
  | 'admin' 
  | 'saran'
  | string;

