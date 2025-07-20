import React from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecurringDateStore } from '@/stores/recurringDateStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  generateCalendarDays,
  isDayRecurring,
  isDayToday,
  isDayInCurrentMonth,
  WEEKDAY_NAMES
} from '@/utils/dateHelpers';

export function MiniCalendarPreview() {
  const { recurringDates, dateRange } = useRecurringDateStore();
  const [currentMonth, setCurrentMonth] = React.useState(() => 
    new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), 1)
  );

  const calendarDays = generateCalendarDays(currentMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const goToStartDate = () => {
    setCurrentMonth(new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), 1));
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          onClick={goToStartDate}
          className="font-semibold hover:bg-muted"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isToday = isDayToday(day);
            const isRecurring = isDayRecurring(day, recurringDates);
            const isCurrentMonth = isDayInCurrentMonth(day, currentMonth);
            const isStartDate = day.getTime() === dateRange.startDate.getTime();

            return (
              <div
                key={index}
                className={cn(
                  "h-8 flex items-center justify-center text-xs relative rounded transition-colors",
                  // Base styles
                  "border border-transparent",
                  // Current month vs other months
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                  // Today styling
                  isToday && "bg-calendar-today text-calendar-today-foreground font-semibold",
                  // Recurring date styling
                  isRecurring && !isToday && "bg-calendar-recurring text-calendar-recurring-foreground font-medium",
                  // Start date special styling
                  isStartDate && "ring-2 ring-primary ring-offset-1",
                  // Hover effect
                  "hover:bg-muted"
                )}
              >
                {format(day, 'd')}
                
                {/* Indicators */}
                {isRecurring && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 rounded-full bg-current opacity-60"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Legend:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToStartDate}
            className="h-6 px-2 text-xs"
          >
            Go to start
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-calendar-today"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-calendar-recurring"></div>
            <span>Recurring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-primary"></div>
            <span>Start date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-foreground"></div>
            <span>Has occurrence</span>
          </div>
        </div>
      </div>
    </div>
  );
}