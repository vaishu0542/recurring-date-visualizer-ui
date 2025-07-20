import React from 'react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useRecurringDateStore } from '@/stores/recurringDateStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export function RecurrencePreview() {
  const { previewDates, recurringDates } = useRecurringDateStore();
  const [showAll, setShowAll] = React.useState(false);

  // Separate dates into categories
  const today = new Date();
  const pastDates = recurringDates.filter(date => isPast(date) && !isToday(date));
  const todayDates = recurringDates.filter(date => isToday(date));
  const futureDates = recurringDates.filter(date => isFuture(date));

  const displayDates = showAll ? recurringDates : previewDates;
  const hasMoreDates = recurringDates.length > previewDates.length;

  const DateItem = ({ date, index }: { date: Date; index: number }) => {
    const isDateToday = isToday(date);
    const isDatePast = isPast(date) && !isDateToday;
    const isDateFuture = isFuture(date);

    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg border transition-colors",
          isDateToday && "bg-calendar-today/10 border-calendar-today",
          isDatePast && "bg-muted/50 border-muted",
          isDateFuture && "bg-calendar-recurring/10 border-calendar-recurring/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isDateToday ? (
              <div className="w-8 h-8 rounded-full bg-calendar-today text-calendar-today-foreground flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-medium",
                isDatePast && "text-muted-foreground line-through"
              )}>
                {format(date, 'EEEE, MMMM d, yyyy')}
              </span>
              {isDateToday && (
                <Badge variant="default" className="text-xs">
                  Today
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(date, 'h:mm a')} • {format(date, 'EEEE')}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-muted-foreground">
            #{index + 1}
          </div>
        </div>
      </div>
    );
  };

  if (recurringDates.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <Calendar className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No recurring dates configured
        </p>
        <p className="text-xs text-muted-foreground">
          Configure your recurrence settings to see preview dates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-muted/50 rounded">
          <div className="text-lg font-semibold">{pastDates.length}</div>
          <div className="text-xs text-muted-foreground">Past</div>
        </div>
        <div className="text-center p-2 bg-calendar-today/10 rounded">
          <div className="text-lg font-semibold">{todayDates.length}</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        <div className="text-center p-2 bg-calendar-recurring/10 rounded">
          <div className="text-lg font-semibold">{futureDates.length}</div>
          <div className="text-xs text-muted-foreground">Future</div>
        </div>
      </div>

      {/* Dates List */}
      <Collapsible open={showAll} onOpenChange={setShowAll}>
        <div className="space-y-3">
          {/* Always show preview dates */}
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-2">
              {(showAll ? recurringDates : previewDates).map((date, index) => (
                <DateItem key={date.toISOString()} date={date} index={index} />
              ))}
            </div>
          </ScrollArea>

          {/* Show more/less toggle */}
          {hasMoreDates && (
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Less ({previewDates.length} of {recurringDates.length})
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show All {recurringDates.length} Dates
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
      </Collapsible>

      {/* Quick Summary */}
      <div className="p-3 bg-gradient-subtle rounded-lg border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total occurrences:</span>
          <Badge variant="secondary" className="font-mono">
            {recurringDates.length}
          </Badge>
        </div>
        {futureDates.length > 0 && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Next occurrence:</span>
            <span className="font-medium">
              {format(futureDates[0], 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}