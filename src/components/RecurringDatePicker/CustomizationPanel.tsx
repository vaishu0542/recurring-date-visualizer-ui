import React from 'react';
import { useRecurringDateStore, WeekDay, MonthlyPattern } from '@/stores/recurringDateStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WEEKDAY_NAMES, WEEKDAY_FULL_NAMES } from '@/utils/dateHelpers';

export function CustomizationPanel() {
  const {
    recurrenceConfig,
    setInterval,
    setWeekDays,
    setMonthlyPattern,
    setDayOfMonth,
    setWeekOfMonth,
    setDayOfWeek,
  } = useRecurringDateStore();

  const { type, interval, weekDays, monthlyPattern, dayOfMonth, weekOfMonth, dayOfWeek } = recurrenceConfig;

  const handleWeekDayToggle = (day: WeekDay) => {
    const current = weekDays || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => a - b);
    setWeekDays(updated);
  };

  return (
    <div className="space-y-6">
      {/* Interval Setting */}
      <div className="space-y-3">
        <Label htmlFor="interval" className="text-sm font-medium">
          Repeat every
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="interval"
            type="number"
            min="1"
            max="999"
            value={interval}
            onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">
            {type === 'daily' && (interval === 1 ? 'day' : 'days')}
            {type === 'weekly' && (interval === 1 ? 'week' : 'weeks')}
            {type === 'monthly' && (interval === 1 ? 'month' : 'months')}
            {type === 'yearly' && (interval === 1 ? 'year' : 'years')}
          </span>
        </div>
      </div>

      {/* Weekly Customization */}
      {type === 'weekly' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Repeat on</Label>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_NAMES.map((name, index) => (
              <Button
                key={index}
                variant={weekDays?.includes(index as WeekDay) ? 'default' : 'outline'}
                size="sm"
                className={`h-10 text-xs font-medium transition-all ${
                  weekDays?.includes(index as WeekDay)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleWeekDayToggle(index as WeekDay)}
              >
                {name}
              </Button>
            ))}
          </div>
          {weekDays && weekDays.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selected: {weekDays.map(day => WEEKDAY_FULL_NAMES[day]).join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Monthly Customization */}
      {type === 'monthly' && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Monthly pattern</Label>
          <RadioGroup
            value={monthlyPattern}
            onValueChange={(value) => setMonthlyPattern(value as MonthlyPattern)}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dayOfMonth" id="dayOfMonth" />
                <Label htmlFor="dayOfMonth" className="flex-1">
                  On day of month
                </Label>
              </div>
              
              {monthlyPattern === 'dayOfMonth' && (
                <div className="ml-6 flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">of every month</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dayOfWeek" id="dayOfWeek" />
                <Label htmlFor="dayOfWeek" className="flex-1">
                  On specific week and day
                </Label>
              </div>
              
              {monthlyPattern === 'dayOfWeek' && (
                <div className="ml-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={weekOfMonth?.toString()}
                      onValueChange={(value) => setWeekOfMonth(parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First</SelectItem>
                        <SelectItem value="2">Second</SelectItem>
                        <SelectItem value="3">Third</SelectItem>
                        <SelectItem value="4">Fourth</SelectItem>
                        <SelectItem value="-1">Last</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={dayOfWeek?.toString()}
                      onValueChange={(value) => setDayOfWeek(parseInt(value) as WeekDay)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WEEKDAY_FULL_NAMES.map((name, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: "Second Tuesday of every month"
                  </p>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Yearly Customization */}
      {type === 'yearly' && (
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Yearly recurrence will repeat on the same date each year based on your selected start date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}