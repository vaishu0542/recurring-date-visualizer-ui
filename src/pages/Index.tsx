import React from 'react';
import { RecurringDatePicker } from '@/components/RecurringDatePicker';

const Index = () => {
  const handleDatesChange = (dates: Date[]) => {
    console.log('Recurring dates updated:', dates);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <RecurringDatePicker 
          onDatesChange={handleDatesChange}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  );
};

export default Index;
