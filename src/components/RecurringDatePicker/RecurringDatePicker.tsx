import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRecurringDateStore } from '@/stores/recurringDateStore';
import { formatRecurrenceDescription } from '@/utils/dateHelpers';
import { RecurrenceOptions } from './RecurrenceOptions';
import { CustomizationPanel } from './CustomizationPanel';
import { DateRangePicker } from './DateRangePicker';
import { MiniCalendarPreview } from './MiniCalendarPreview';
import { RecurrencePreview } from './RecurrencePreview';

interface RecurringDatePickerProps {
  className?: string;
  onDatesChange?: (dates: Date[]) => void;
}

export function RecurringDatePicker({ className, onDatesChange }: RecurringDatePickerProps) {
  const { 
    recurrenceConfig, 
    dateRange, 
    recurringDates, 
    previewDates,
    calculateRecurringDates 
  } = useRecurringDateStore();

  // Trigger calculation on mount
  React.useEffect(() => {
    calculateRecurringDates();
  }, [calculateRecurringDates]);

  // Notify parent of date changes
  React.useEffect(() => {
    if (onDatesChange) {
      onDatesChange(recurringDates);
    }
  }, [recurringDates, onDatesChange]);

  const description = formatRecurrenceDescription(recurrenceConfig, dateRange);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
          Recurring Date Picker
        </h2>
        <p className="text-muted-foreground">
          Configure recurring dates with flexible patterns and preview the results.
        </p>
      </div>

      {/* Main Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Recurrence Type */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Recurrence Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecurrenceOptions />
            </CardContent>
          </Card>

          {/* Customization */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomizationPanel />
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-glow"></div>
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangePicker />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Calendar Preview */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-calendar-selected"></div>
                Calendar Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniCalendarPreview />
            </CardContent>
          </Card>

          {/* Dates Preview */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-calendar-recurring"></div>
                Next Occurrences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecurrencePreview />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Card className="shadow-glow border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recurrence Summary</h3>
              <Badge variant="secondary" className="font-mono">
                {recurringDates.length} dates
              </Badge>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}