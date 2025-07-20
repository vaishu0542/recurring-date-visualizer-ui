import { describe, it, expect } from 'vitest';
import { formatRecurrenceDescription, isDayRecurring, generateCalendarDays } from '@/utils/dateHelpers';
import { RecurrenceConfig, DateRange } from '@/stores/recurringDateStore';

describe('Date Helpers', () => {
  describe('formatRecurrenceDescription', () => {
    it('should format daily recurrence correctly', () => {
      const config: RecurrenceConfig = {
        type: 'daily',
        interval: 1,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),
        endDate: undefined,
      };

      const result = formatRecurrenceDescription(config, dateRange);
      expect(result).toContain('Every day');
      expect(result).toContain('starting Jan 01, 2024');
    });

    it('should format weekly recurrence with specific days', () => {
      const config: RecurrenceConfig = {
        type: 'weekly',
        interval: 1,
        weekDays: [1, 3, 5], // Monday, Wednesday, Friday
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),
        endDate: undefined,
      };

      const result = formatRecurrenceDescription(config, dateRange);
      expect(result).toContain('Every week on Mon, Wed, Fri');
    });

    it('should format monthly recurrence with day of month', () => {
      const config: RecurrenceConfig = {
        type: 'monthly',
        interval: 2,
        monthlyPattern: 'dayOfMonth',
        dayOfMonth: 15,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),
        endDate: undefined,
      };

      const result = formatRecurrenceDescription(config, dateRange);
      expect(result).toContain('Every 2 months on the 15th');
    });

    it('should format monthly recurrence with day of week pattern', () => {
      const config: RecurrenceConfig = {
        type: 'monthly',
        interval: 1,
        monthlyPattern: 'dayOfWeek',
        weekOfMonth: 2,
        dayOfWeek: 1, // Monday
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),
        endDate: undefined,
      };

      const result = formatRecurrenceDescription(config, dateRange);
      expect(result).toContain('Every month on the second Monday');
    });

    it('should include end date when provided', () => {
      const config: RecurrenceConfig = {
        type: 'daily',
        interval: 1,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 11, 31),
      };

      const result = formatRecurrenceDescription(config, dateRange);
      expect(result).toContain('until Dec 31, 2024');
    });
  });

  describe('isDayRecurring', () => {
    it('should return true for matching dates', () => {
      const date = new Date(2024, 0, 15);
      const recurringDates = [
        new Date(2024, 0, 10),
        new Date(2024, 0, 15),
        new Date(2024, 0, 20),
      ];

      expect(isDayRecurring(date, recurringDates)).toBe(true);
    });

    it('should return false for non-matching dates', () => {
      const date = new Date(2024, 0, 16);
      const recurringDates = [
        new Date(2024, 0, 10),
        new Date(2024, 0, 15),
        new Date(2024, 0, 20),
      ];

      expect(isDayRecurring(date, recurringDates)).toBe(false);
    });

    it('should handle empty recurring dates array', () => {
      const date = new Date(2024, 0, 15);
      const recurringDates: Date[] = [];

      expect(isDayRecurring(date, recurringDates)).toBe(false);
    });
  });

  describe('generateCalendarDays', () => {
    it('should generate 42 days for calendar grid', () => {
      const currentMonth = new Date(2024, 0, 1); // January 2024
      const days = generateCalendarDays(currentMonth);

      expect(days).toHaveLength(42);
    });

    it('should start with Sunday before the first day of month', () => {
      const currentMonth = new Date(2024, 0, 1); // January 2024 (starts on Monday)
      const days = generateCalendarDays(currentMonth);

      // First day should be the Sunday before January 1st
      expect(days[0].getDay()).toBe(0); // Sunday
      expect(days[0].getDate()).toBe(31); // Dec 31, 2023
    });

    it('should include all days of the target month', () => {
      const currentMonth = new Date(2024, 0, 1); // January 2024
      const days = generateCalendarDays(currentMonth);

      // Should include January 1st
      const jan1 = days.find(day => 
        day.getMonth() === 0 && day.getDate() === 1 && day.getFullYear() === 2024
      );
      expect(jan1).toBeDefined();

      // Should include January 31st
      const jan31 = days.find(day => 
        day.getMonth() === 0 && day.getDate() === 31 && day.getFullYear() === 2024
      );
      expect(jan31).toBeDefined();
    });
  });
});