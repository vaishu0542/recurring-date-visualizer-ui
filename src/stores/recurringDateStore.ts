import { create } from 'zustand';
import { addDays, addWeeks, addMonths, addYears, isSameDay, startOfDay, endOfDay } from 'date-fns';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0, Monday = 1, etc.

export type MonthlyPattern = 'dayOfMonth' | 'dayOfWeek';

export interface RecurrenceConfig {
  type: RecurrenceType;
  interval: number; // Every X days/weeks/months/years
  weekDays?: WeekDay[]; // For weekly recurrence
  monthlyPattern?: MonthlyPattern; // For monthly recurrence
  dayOfMonth?: number; // Specific day of month (1-31)
  weekOfMonth?: number; // Which week of the month (1-4, -1 for last)
  dayOfWeek?: WeekDay; // Which day of the week for monthly pattern
}

export interface DateRange {
  startDate: Date;
  endDate?: Date;
}

export interface RecurringDateState {
  // Configuration
  recurrenceConfig: RecurrenceConfig;
  dateRange: DateRange;
  
  // Computed
  recurringDates: Date[];
  previewDates: Date[];
  
  // Actions
  setRecurrenceType: (type: RecurrenceType) => void;
  setInterval: (interval: number) => void;
  setWeekDays: (weekDays: WeekDay[]) => void;
  setMonthlyPattern: (pattern: MonthlyPattern) => void;
  setDayOfMonth: (day: number) => void;
  setWeekOfMonth: (week: number) => void;
  setDayOfWeek: (day: WeekDay) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | undefined) => void;
  calculateRecurringDates: () => void;
  reset: () => void;
}

const defaultConfig: RecurrenceConfig = {
  type: 'daily',
  interval: 1,
  weekDays: [],
  monthlyPattern: 'dayOfMonth',
  dayOfMonth: 1,
  weekOfMonth: 1,
  dayOfWeek: 1,
};

const defaultDateRange: DateRange = {
  startDate: new Date(),
  endDate: undefined,
};

export const useRecurringDateStore = create<RecurringDateState>((set, get) => ({
  recurrenceConfig: defaultConfig,
  dateRange: defaultDateRange,
  recurringDates: [],
  previewDates: [],

  setRecurrenceType: (type) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, type },
    }));
    get().calculateRecurringDates();
  },

  setInterval: (interval) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, interval },
    }));
    get().calculateRecurringDates();
  },

  setWeekDays: (weekDays) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, weekDays },
    }));
    get().calculateRecurringDates();
  },

  setMonthlyPattern: (monthlyPattern) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, monthlyPattern },
    }));
    get().calculateRecurringDates();
  },

  setDayOfMonth: (dayOfMonth) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, dayOfMonth },
    }));
    get().calculateRecurringDates();
  },

  setWeekOfMonth: (weekOfMonth) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, weekOfMonth },
    }));
    get().calculateRecurringDates();
  },

  setDayOfWeek: (dayOfWeek) => {
    set((state) => ({
      recurrenceConfig: { ...state.recurrenceConfig, dayOfWeek },
    }));
    get().calculateRecurringDates();
  },

  setStartDate: (startDate) => {
    set((state) => ({
      dateRange: { ...state.dateRange, startDate },
    }));
    get().calculateRecurringDates();
  },

  setEndDate: (endDate) => {
    set((state) => ({
      dateRange: { ...state.dateRange, endDate },
    }));
    get().calculateRecurringDates();
  },

  calculateRecurringDates: () => {
    const { recurrenceConfig, dateRange } = get();
    const dates = calculateRecurringDatesLogic(recurrenceConfig, dateRange);
    const previewDates = dates.slice(0, 10); // Show first 10 for preview
    
    set({ recurringDates: dates, previewDates });
  },

  reset: () => {
    set({
      recurrenceConfig: defaultConfig,
      dateRange: defaultDateRange,
      recurringDates: [],
      previewDates: [],
    });
  },
}));

// Pure function for calculating recurring dates
export function calculateRecurringDatesLogic(
  config: RecurrenceConfig,
  dateRange: DateRange
): Date[] {
  const { type, interval, weekDays, monthlyPattern, dayOfMonth, weekOfMonth, dayOfWeek } = config;
  const { startDate, endDate } = dateRange;
  
  const dates: Date[] = [];
  const maxIterations = 1000; // Prevent infinite loops
  let currentDate = startOfDay(startDate);
  let iterations = 0;

  const endLimit = endDate ? endOfDay(endDate) : addYears(startDate, 2); // Default 2 years if no end date

  while (currentDate <= endLimit && iterations < maxIterations) {
    iterations++;

    if (shouldIncludeDate(currentDate, config, startDate)) {
      dates.push(new Date(currentDate));
    }

    // Move to next occurrence
    switch (type) {
      case 'daily':
        currentDate = addDays(currentDate, interval);
        break;
      case 'weekly':
        if (weekDays && weekDays.length > 0) {
          // Find next occurrence of any selected weekday
          currentDate = getNextWeeklyOccurrence(currentDate, weekDays, interval);
        } else {
          currentDate = addWeeks(currentDate, interval);
        }
        break;
      case 'monthly':
        currentDate = getNextMonthlyOccurrence(currentDate, config);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, interval);
        break;
    }
  }

  return dates;
}

function shouldIncludeDate(date: Date, config: RecurrenceConfig, startDate: Date): boolean {
  const { type, weekDays } = config;
  
  // Always include start date if it matches the pattern
  if (isSameDay(date, startDate)) {
    return true;
  }

  switch (type) {
    case 'daily':
      return true; // Daily recurrence includes all dates in the sequence
    case 'weekly':
      if (weekDays && weekDays.length > 0) {
        return weekDays.includes(date.getDay() as WeekDay);
      }
      return true;
    case 'monthly':
    case 'yearly':
      return true; // Monthly and yearly logic is handled in the next occurrence calculation
    default:
      return false;
  }
}

function getNextWeeklyOccurrence(currentDate: Date, weekDays: WeekDay[], interval: number): Date {
  const currentWeekDay = currentDate.getDay() as WeekDay;
  const sortedWeekDays = [...weekDays].sort((a, b) => a - b);
  
  // Find next occurrence in the same week
  const nextInWeek = sortedWeekDays.find(day => day > currentWeekDay);
  
  if (nextInWeek !== undefined) {
    // Next occurrence is in the same week
    return addDays(currentDate, nextInWeek - currentWeekDay);
  } else {
    // Move to the next interval and start with the first selected weekday
    const daysToAdd = (7 - currentWeekDay) + (sortedWeekDays[0]) + (interval - 1) * 7;
    return addDays(currentDate, daysToAdd);
  }
}

function getNextMonthlyOccurrence(currentDate: Date, config: RecurrenceConfig): Date {
  const { interval, monthlyPattern, dayOfMonth, weekOfMonth, dayOfWeek } = config;
  
  if (monthlyPattern === 'dayOfMonth') {
    // Next occurrence on specific day of month
    let nextMonth = addMonths(currentDate, interval);
    
    // Adjust for day of month
    if (dayOfMonth) {
      const lastDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
      const targetDay = Math.min(dayOfMonth, lastDayOfMonth);
      nextMonth.setDate(targetDay);
    }
    
    return nextMonth;
  } else {
    // Next occurrence on specific week and day (e.g., second Tuesday)
    let nextMonth = addMonths(currentDate, interval);
    
    if (weekOfMonth && dayOfWeek !== undefined) {
      // Find the specific week and day
      const firstDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
      const firstWeekDay = firstDayOfMonth.getDay();
      
      // Calculate the date of the target occurrence
      let targetDate: Date;
      
      if (weekOfMonth === -1) {
        // Last occurrence of the day in the month
        const lastDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
        const lastWeekDay = lastDayOfMonth.getDay();
        const daysFromEnd = (lastWeekDay >= dayOfWeek) ? (lastWeekDay - dayOfWeek) : (7 - dayOfWeek + lastWeekDay);
        targetDate = addDays(lastDayOfMonth, -daysFromEnd);
      } else {
        // Specific week of the month
        const daysFromStart = (dayOfWeek >= firstWeekDay) ? (dayOfWeek - firstWeekDay) : (7 - firstWeekDay + dayOfWeek);
        targetDate = addDays(firstDayOfMonth, daysFromStart + (weekOfMonth - 1) * 7);
      }
      
      return targetDate;
    }
    
    return nextMonth;
  }
}