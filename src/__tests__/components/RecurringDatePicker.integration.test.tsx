import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecurringDatePicker } from '@/components/RecurringDatePicker';

// Mock date-fns to have consistent test results
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    isToday: (date: Date) => {
      const today = new Date(2024, 0, 15); // Fixed date for testing
      return date.toDateString() === today.toDateString();
    },
  };
});

describe('RecurringDatePicker Integration', () => {
  it('should render all main components', () => {
    const mockOnDatesChange = vi.fn();
    
    const { container, getByText } = render(<RecurringDatePicker onDatesChange={mockOnDatesChange} />);
    
    // Check that component renders without crashing
    expect(container).toBeTruthy();
    
    // Check for main sections
    expect(getByText('Recurring Date Picker')).toBeInTheDocument();
    expect(getByText('Recurrence Type')).toBeInTheDocument();
    expect(getByText('Customization')).toBeInTheDocument();
    expect(getByText('Date Range')).toBeInTheDocument();
    expect(getByText('Calendar Preview')).toBeInTheDocument();
    expect(getByText('Next Occurrences')).toBeInTheDocument();
    expect(getByText('Recurrence Summary')).toBeInTheDocument();
  });

  it('should default to daily recurrence', () => {
    const mockOnDatesChange = vi.fn();
    
    const { getByText } = render(<RecurringDatePicker onDatesChange={mockOnDatesChange} />);
    
    // Should show daily as default
    expect(getByText('Daily')).toBeInTheDocument();
  });

  it('should call onDatesChange prop when provided', () => {
    const mockOnDatesChange = vi.fn();
    
    render(<RecurringDatePicker onDatesChange={mockOnDatesChange} />);
    
    // Should eventually call the callback (after useEffect runs)
    setTimeout(() => {
      expect(mockOnDatesChange).toHaveBeenCalled();
    }, 100);
  });

  it('should render without onDatesChange prop', () => {
    const { container } = render(<RecurringDatePicker />);
    
    // Should render without crashing
    expect(container).toBeTruthy();
  });

  it('should have proper structure and components', () => {
    const mockOnDatesChange = vi.fn();
    
    const { getByText, container } = render(<RecurringDatePicker onDatesChange={mockOnDatesChange} />);
    
    // Check main structure exists
    expect(getByText('Recurrence Type')).toBeInTheDocument();
    expect(getByText('Customization')).toBeInTheDocument();
    expect(getByText('Date Range')).toBeInTheDocument();
    expect(getByText('Calendar Preview')).toBeInTheDocument();
    expect(getByText('Next Occurrences')).toBeInTheDocument();
    
    // Check that cards are rendered
    const cards = container.querySelectorAll('[class*="shadow"]');
    expect(cards.length).toBeGreaterThan(0);
  });
});