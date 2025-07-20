import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useRecurringDateStore } from '@/stores/recurringDateStore';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function DateRangePicker() {
  const { dateRange, setStartDate, setEndDate } = useRecurringDateStore();
  const { startDate, endDate } = dateRange;

  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Start Date */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Start Date</Label>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                if (date) {
                  setStartDate(date);
                  setStartOpen(false);
                }
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">End Date (Optional)</Label>
          {endDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEndDate(undefined)}
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>No end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setEndOpen(false);
              }}
              disabled={(date) => startDate ? date < startDate : false}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date Range Summary */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start:</span>
            <span className="font-medium">{format(startDate, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">End:</span>
            <span className="font-medium">
              {endDate ? format(endDate, "MMM dd, yyyy") : "Ongoing"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}