import React from 'react';
import { useRecurringDateStore, RecurrenceType } from '@/stores/recurringDateStore';
import { Button } from '@/components/ui/button';
import { Calendar, Repeat, RotateCcw, Clock } from 'lucide-react';

const recurrenceOptions: { type: RecurrenceType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    type: 'daily',
    label: 'Daily',
    icon: <Clock className="w-4 h-4" />,
    description: 'Repeats every day or every few days'
  },
  {
    type: 'weekly',
    label: 'Weekly',
    icon: <Calendar className="w-4 h-4" />,
    description: 'Repeats on specific days of the week'
  },
  {
    type: 'monthly',
    label: 'Monthly',
    icon: <Repeat className="w-4 h-4" />,
    description: 'Repeats monthly on specific dates or patterns'
  },
  {
    type: 'yearly',
    label: 'Yearly',
    icon: <RotateCcw className="w-4 h-4" />,
    description: 'Repeats annually on the same date'
  }
];

export function RecurrenceOptions() {
  const { recurrenceConfig, setRecurrenceType } = useRecurringDateStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {recurrenceOptions.map((option) => (
          <Button
            key={option.type}
            variant={recurrenceConfig.type === option.type ? 'default' : 'outline'}
            className={`h-auto p-4 flex flex-col items-start gap-2 transition-all duration-200 ${
              recurrenceConfig.type === option.type
                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                : 'hover:bg-muted hover:scale-[1.02]'
            }`}
            onClick={() => setRecurrenceType(option.type)}
          >
            <div className="flex items-center gap-2 w-full">
              {option.icon}
              <span className="font-medium">{option.label}</span>
            </div>
            <span className="text-xs opacity-80 text-left leading-tight">
              {option.description}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
        <strong className="text-foreground">Selected:</strong> {' '}
        {recurrenceOptions.find(opt => opt.type === recurrenceConfig.type)?.label}
        {' - '}
        {recurrenceOptions.find(opt => opt.type === recurrenceConfig.type)?.description}
      </div>
    </div>
  );
}