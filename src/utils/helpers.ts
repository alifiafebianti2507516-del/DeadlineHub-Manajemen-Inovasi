import { DeadlineItem, Priority } from '../types';

export const monthNamesIndo = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const monthShortIndo = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export const dayNamesIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function formatDeadlineDate(dateStr: string, timeStr: string = '23:59'): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const mShort = monthShortIndo[month - 1] || 'Bln';
    return `${day} ${mShort} ${year} • ${timeStr.replace(':', '.')}`;
  } catch {
    return `${dateStr} • ${timeStr}`;
  }
}

export function formatFullIndoDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const dayName = dayNamesIndo[date.getDay()];
    const [year, month, day] = dateStr.split('-').map(Number);
    const mName = monthNamesIndo[month - 1];
    return `${dayName}, ${day} ${mName} ${year}`;
  } catch {
    return dateStr;
  }
}

export function getDaysRemaining(dueDateStr: string): number {
  const target = new Date(dueDateStr + 'T23:59:59');
  // Anchored to current real-world date: 25 Oktober 2026
  const referenceDate = new Date('2026-10-25T00:00:00');
  const diffTime = target.getTime() - referenceDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPriorityBadgeProps(priority: Priority) {
  switch (priority) {
    case 'sangat-mendesak':
      return {
        label: 'Sangat Mendesak',
        className: 'bg-[#FFF0F2] text-[#E11D48] border border-[#FFE4E6]',
        dotColor: 'bg-[#E11D48]',
      };
    case 'mendesak':
      return {
        label: 'Mendesak',
        className: 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]',
        dotColor: 'bg-[#EA580C]',
      };
    case 'terjadwal':
    default:
      return {
        label: 'Terjadwal',
        className: 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]',
        dotColor: 'bg-[#2563EB]',
      };
  }
}

export function getCategoryBadgeColor(category: string) {
  switch (category) {
    case 'Matakuliah':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'Organisasi':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Administrasi':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'Proyek':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function generateCalendarDays(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 8 = Sep)
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Day of week for 1st day (0 = Sun, 1 = Mon ... 6 = Sat)
  // In Indonesia, week starts on Monday: Sen(0), Sel(1), Rab(2), Kam(3), Jum(4), Sab(5), Min(6)
  let startingDay = firstDayOfMonth.getDay();
  // Convert Sunday (0) to 6, and Monday (1) to 0
  const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

  const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = adjustedStartingDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const mStr = String(prevMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    days.push({
      dayNumber: day,
      dateStr: `${prevYear}-${mStr}-${dStr}`,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    days.push({
      dayNumber: i,
      dateStr: `${year}-${mStr}-${dStr}`,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete full grid (e.g. 35 or 42 cells)
  const remainingCells = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const mStr = String(nextMonth + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    days.push({
      dayNumber: i,
      dateStr: `${nextYear}-${mStr}-${dStr}`,
      isCurrentMonth: false,
    });
  }

  return days;
}

// Mailto URL generator for direct sending from student device
export function generateMailtoUrl(deadline: DeadlineItem, studentEmail: string): string {
  const subject = encodeURIComponent(`[DeadlineHub] Pengingat Tugas: ${deadline.title} (${deadline.courseName})`);
  const body = encodeURIComponent(
`Halo Mahasiswa,

Ini adalah pengingat otomatis dari DeadlineHub untuk tugas kuliah Anda:

📌 Judul Tugas: ${deadline.title}
📚 Matakuliah/Kategori: ${deadline.courseName} (${deadline.category})
⏰ Batas Waktu: ${formatDeadlineDate(deadline.dueDate, deadline.dueTime)}
⚡ Status Prioritas: ${deadline.priority === 'sangat-mendesak' ? 'SANGAT MENDESAK' : deadline.priority.toUpperCase()}
📍 Tempat Pengumpulan: ${deadline.location || 'Portal Kampus / LMS'}

Deskripsi / Catatan:
${deadline.description || 'Tidak ada catatan tambahan.'}

---
Disarankan untuk segera menyelesaikan dan mengunggah tugas sebelum jam batas waktu untuk menghindari server kampus overload. Tetap semangat! 🎓

Salam fokus,
DeadlineHub - Satu Tempat, Semua Deadline`
  );

  return `mailto:${studentEmail}?subject=${subject}&body=${body}`;
}

// Google Calendar URL generator
export function generateGoogleCalendarUrl(deadline: DeadlineItem): string {
  const [year, month, day] = deadline.dueDate.split('-');
  const [hour, minute] = deadline.dueTime.split(':');
  
  // Format YYYYMMDDTHHMMSSZ
  const startTime = `${year}${month}${day}T${hour}${minute}00`;
  const endTime = `${year}${month}${day}T${hour}${minute}00`;

  const title = encodeURIComponent(`[DeadlineHub] ${deadline.title} - ${deadline.courseName}`);
  const details = encodeURIComponent(
    `Tugas: ${deadline.title}\nMatakuliah: ${deadline.courseName}\nPrioritas: ${deadline.priority}\nLokasi: ${deadline.location || '-'}\n\nCatatan:\n${deadline.description || '-'}`
  );
  const location = encodeURIComponent(deadline.location || 'Kampus');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
}

// ICS file generator for offline calendar apps
export function downloadIcsFile(deadline: DeadlineItem) {
  const [year, month, day] = deadline.dueDate.split('-');
  const [hour, minute] = deadline.dueTime.split(':');
  const timestamp = `${year}${month}${day}T${hour}${minute}00`;

  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DeadlineHub//Student Task Reminder//ID
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:[DeadlineHub] ${deadline.title}
DESCRIPTION:${deadline.courseName} - ${deadline.description || ''}
DTSTART:${timestamp}
DTEND:${timestamp}
LOCATION:${deadline.location || 'Kampus'}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Pengingat DeadlineHub: ${deadline.title}
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${deadline.title.replace(/[^a-zA-Z0-9]/g, '_')}_deadline.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
