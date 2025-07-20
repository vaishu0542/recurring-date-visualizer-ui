import { format, isToday, isSameMonth, isSameDay } from 'date-fns';

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAY_FULL_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function formatRecurrenceDescription(config: any, dateRange: any): string {
  const { type, interval, weekDays, monthlyPattern, dayOfMonth, weekOfMonth, dayOfWeek } = config;
  const { startDate, endDate } = dateRange;

  let description = '';

  switch (type) {
    case 'daily':
      description = interval === 1 ? 'Every day' : `Every ${interval} days`;
      break;
    case 'weekly':
      if (weekDays && weekDays.length > 0) {
        const dayNames = weekDays.map((day: number) => WEEKDAY_NAMES[day]).join(', ');
        description = interval === 1 
          ? `Every week on ${dayNames}`
          : `Every ${interval} weeks on ${dayNames}`;
      } else {
        description = interval === 1 ? 'Every week' : `Every ${interval} weeks`;
      }
      break;
    case 'monthly':
      if (monthlyPattern === 'dayOfMonth') {
        const suffix = getOrdinalSuffix(dayOfMonth);
        description = interval === 1
          ? `Every month on the ${dayOfMonth}${suffix}`
          : `Every ${interval} months on the ${dayOfMonth}${suffix}`;
      } else {
        const weekName = weekOfMonth === -1 ? 'last' : getOrdinalName(weekOfMonth);
        const dayName = WEEKDAY_FULL_NAMES[dayOfWeek];
        description = interval === 1
          ? `Every month on the ${weekName} ${dayName}`
          : `Every ${interval} months on the ${weekName} ${dayName}`;
      }
      break;
    case 'yearly':
      description = interval === 1 ? 'Every year' : `Every ${interval} years`;
      break;
  }

  // Add date range info
  const startFormatted = format(startDate, 'MMM dd, yyyy');
  description += `, starting ${startFormatted}`;
  
  if (endDate) {
    const endFormatted = format(endDate, 'MMM dd, yyyy');
    description += ` until ${endFormatted}`;
  }

  return description;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function getOrdinalName(week: number): string {
  switch (week) {
    case 1: return 'first';
    case 2: return 'second';
    case 3: return 'third';
    case 4: return 'fourth';
    default: return 'last';
  }
}

export function isDayRecurring(date: Date, recurringDates: Date[]): boolean {
  return recurringDates.some(recurringDate => isSameDay(date, recurringDate));
}

export function isDayToday(date: Date): boolean {
  return isToday(date);
}

export function isDayInCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

export function generateCalendarDays(currentMonth: Date): Date[] {
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  // Start from the first Sunday of the calendar view
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  // Generate 42 days (6 weeks) to fill the calendar grid
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  
  return days;
}

export function getNextMonth(currentMonth: Date): Date {
  return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
}

export function getPreviousMonth(currentMonth: Date): Date {
  return new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
}