export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun ... 6=Sat

export type TimeWindow = {
  start: string; // "HH:MM" 24h
  end: string;   // "HH:MM" 24h
};

export type WeeklyAvailability = Record<Weekday, TimeWindow[]>;

export function getDefaultWeeklyAvailability(): WeeklyAvailability {
  // Mon-Fri 9:00-17:00
  return {
    0: [],
    1: [{ start: "09:00", end: "17:00" }],
    2: [{ start: "09:00", end: "17:00" }],
    3: [{ start: "09:00", end: "17:00" }],
    4: [{ start: "09:00", end: "17:00" }],
    5: [{ start: "09:00", end: "17:00" }],
    6: [],
  } as WeeklyAvailability;
}

export function parseHmToMinutes(hm: string): number {
  const [h, m] = hm.split(":").map((v) => parseInt(v, 10));
  return h * 60 + (m || 0);
}

export function formatTime(date: Date, locale = undefined): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(date: Date, locale = undefined): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function getNextDays(count: number, from: Date = new Date()): Date[] {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function generateTimeSlots(
  day: Date,
  weekly: WeeklyAvailability,
  intervalMinutes = 30,
): Date[] {
  const weekday = (day.getDay() as Weekday);
  const windows = weekly[weekday] || [];
  const slots: Date[] = [];
  for (const window of windows) {
    const startMinutes = parseHmToMinutes(window.start);
    const endMinutes = parseHmToMinutes(window.end);
    for (let m = startMinutes; m + intervalMinutes <= endMinutes; m += intervalMinutes) {
      const slot = new Date(day);
      slot.setHours(Math.floor(m / 60), m % 60, 0, 0);
      // Skip past times for today
      if (slot.getTime() < Date.now()) continue;
      slots.push(slot);
    }
  }
  return slots;
}

export function availabilityStorageKey(tenant: string): string {
  return `sh_availability_${tenant}`;
}


