import { describe, it, expect, beforeEach } from 'vitest';
import { calculateRecurringDatesLogic } from '@/stores/recurringDateStore';
import type { RecurrenceConfig, DateRange } from '@/stores/recurringDateStore';

describe('Recurring Date Store Logic', () => {
  describe('calculateRecurringDatesLogic', () => {
    it('should calculate daily recurrence correctly', () => {
      const config: RecurrenceConfig = {
        type: 'daily',
        interval: 2, // Every 2 days
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1), // Jan 1, 2024
        endDate: new Date(2024, 0, 10),  // Jan 10, 2024
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include Jan 1, 3, 5, 7, 9
      expect(dates).toHaveLength(5);
      expect(dates[0].getDate()).toBe(1);
      expect(dates[1].getDate()).toBe(3);
      expect(dates[2].getDate()).toBe(5);
      expect(dates[3].getDate()).toBe(7);
      expect(dates[4].getDate()).toBe(9);
    });

    it('should calculate weekly recurrence with specific days', () => {
      const config: RecurrenceConfig = {
        type: 'weekly',
        interval: 1,
        weekDays: [1, 5], // Monday and Friday
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1), // Jan 1, 2024 (Monday)
        endDate: new Date(2024, 0, 15),  // Jan 15, 2024
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include Mondays and Fridays within the range
      expect(dates.length).toBeGreaterThan(0);
      
      // All dates should be either Monday (1) or Friday (5)
      dates.forEach(date => {
        expect([1, 5]).toContain(date.getDay());
      });
    });

    it('should calculate monthly recurrence by day of month', () => {
      const config: RecurrenceConfig = {
        type: 'monthly',
        interval: 1,
        monthlyPattern: 'dayOfMonth',
        dayOfMonth: 15,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 15), // Jan 15, 2024
        endDate: new Date(2024, 3, 30),   // Apr 30, 2024
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include 15th of Jan, Feb, Mar, Apr
      expect(dates).toHaveLength(4);
      dates.forEach(date => {
        expect(date.getDate()).toBe(15);
      });
    });

    it('should calculate monthly recurrence by day of week', () => {
      const config: RecurrenceConfig = {
        type: 'monthly',
        interval: 1,
        monthlyPattern: 'dayOfWeek',
        weekOfMonth: 2, // Second week
        dayOfWeek: 1,   // Monday
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),  // Jan 1, 2024
        endDate: new Date(2024, 2, 31),   // Mar 31, 2024
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include second Monday of each month
      expect(dates.length).toBeGreaterThan(0);
      dates.forEach(date => {
        expect(date.getDay()).toBe(1); // Monday
      });
    });

    it('should handle yearly recurrence', () => {
      const config: RecurrenceConfig = {
        type: 'yearly',
        interval: 1,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 15), // Jan 15, 2024
        endDate: new Date(2026, 11, 31),  // Dec 31, 2026
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include Jan 15 for 2024, 2025, 2026
      expect(dates).toHaveLength(3);
      expect(dates[0].getFullYear()).toBe(2024);
      expect(dates[1].getFullYear()).toBe(2025);
      expect(dates[2].getFullYear()).toBe(2026);
      
      dates.forEach(date => {
        expect(date.getMonth()).toBe(0);  // January
        expect(date.getDate()).toBe(15);  // 15th
      });
    });

    it('should respect end date limits', () => {
      const config: RecurrenceConfig = {
        type: 'daily',
        interval: 1,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1), // Jan 1, 2024
        endDate: new Date(2024, 0, 5),   // Jan 5, 2024
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include Jan 1, 2, 3, 4, 5
      expect(dates).toHaveLength(5);
      expect(dates[dates.length - 1].getDate()).toBe(5);
    });

    it('should handle no end date by defaulting to 2 years', () => {
      const config: RecurrenceConfig = {
        type: 'yearly',
        interval: 1,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1), // Jan 1, 2024
        endDate: undefined,
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should include Jan 1 for 2024, 2025
      expect(dates).toHaveLength(2);
      expect(dates[0].getFullYear()).toBe(2024);
      expect(dates[1].getFullYear()).toBe(2025);
    });

    it('should prevent infinite loops with max iterations', () => {
      const config: RecurrenceConfig = {
        type: 'daily',
        interval: 1,
      };
      const dateRange: DateRange = {
        startDate: new Date(2024, 0, 1),
        endDate: undefined, // This could theoretically run forever
      };

      const dates = calculateRecurringDatesLogic(config, dateRange);
      
      // Should be limited by max iterations (1000) or 2-year default
      expect(dates.length).toBeLessThanOrEqual(1000);
    });
  });
});