# Recurring Date Picker Component

A powerful and flexible recurring date picker component built with React, TypeScript, Tailwind CSS, and Zustand. This component allows users to create complex recurring date patterns similar to those found in calendar applications like TickTick.

![Recurring Date Picker Demo](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop)

## ✨ Features

### 🔄 Recurrence Types
- **Daily**: Every day or every X days
- **Weekly**: Specific days of the week, every X weeks
- **Monthly**: By day of month or by week pattern (e.g., "second Tuesday")
- **Yearly**: Annual recurrence on the same date

### ⚙️ Customization Options
- **Flexible Intervals**: Every X days/weeks/months/years
- **Weekday Selection**: Choose specific days for weekly recurrence
- **Monthly Patterns**: 
  - Day of month (e.g., 15th of every month)
  - Week pattern (e.g., second Tuesday of every month)
- **Date Range**: Optional start and end dates

### 📅 Visual Preview
- **Mini Calendar**: Visual representation of recurring dates
- **Next Occurrences List**: Preview of upcoming dates
- **Interactive Navigation**: Browse through months
- **Visual Indicators**: Clear marking of recurring dates, today, and start date

### 🎨 Design Features
- **Beautiful UI**: Modern design with smooth animations
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Theme Support**: Light/dark mode compatible
- **Semantic Tokens**: Consistent design system

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing

```bash
npm run test
npm run test:coverage
```

### Build

```bash
npm run build
```

## 📖 Usage

### Basic Usage

```tsx
import { RecurringDatePicker } from '@/components/RecurringDatePicker';

function App() {
  const handleDatesChange = (dates: Date[]) => {
    console.log('Recurring dates:', dates);
  };

  return (
    <RecurringDatePicker onDatesChange={handleDatesChange} />
  );
}
```

### Advanced Usage with Custom Styling

```tsx
import { RecurringDatePicker } from '@/components/RecurringDatePicker';

function App() {
  const handleDatesChange = (dates: Date[]) => {
    // Handle the calculated recurring dates
    // dates is an array of Date objects representing all recurring dates
  };

  return (
    <div className="container mx-auto p-4">
      <RecurringDatePicker 
        onDatesChange={handleDatesChange}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
```

## 🏗️ Architecture

### State Management
The component uses **Zustand** for state management, providing:
- Centralized state for recurrence configuration
- Reactive updates across all components
- Computed values for recurring dates
- Optimized re-renders

### Component Structure
```
RecurringDatePicker/
├── RecurringDatePicker.tsx    # Main container component
├── RecurrenceOptions.tsx      # Recurrence type selection
├── CustomizationPanel.tsx     # Interval and pattern settings
├── DateRangePicker.tsx        # Start/end date selection
├── MiniCalendarPreview.tsx    # Visual calendar with dates
├── RecurrencePreview.tsx      # List of next occurrences
└── index.ts                   # Barrel exports
```

### Core Logic
- **Date Calculation**: Pure functions for generating recurring dates
- **Pattern Matching**: Complex algorithms for weekly and monthly patterns
- **Edge Case Handling**: Leap years, month-end dates, timezone handling

## 🧪 Testing

### Unit Tests
- **Date Helpers**: Utility functions for date manipulation
- **Store Logic**: State management and date calculation algorithms
- **Component Logic**: Individual component functionality

### Integration Tests
- **Full Component**: End-to-end component functionality
- **User Interactions**: Simulated user flows
- **Edge Cases**: Boundary conditions and error handling

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- dateHelpers.test.ts
```

## 🎛️ Configuration Examples

### Daily Recurrence
```typescript
// Every day
{ type: 'daily', interval: 1 }

// Every 3 days
{ type: 'daily', interval: 3 }
```

### Weekly Recurrence
```typescript
// Every Monday and Friday
{ 
  type: 'weekly', 
  interval: 1, 
  weekDays: [1, 5] // Monday = 1, Friday = 5
}

// Every 2 weeks on Tuesday and Thursday
{ 
  type: 'weekly', 
  interval: 2, 
  weekDays: [2, 4] 
}
```

### Monthly Recurrence
```typescript
// 15th of every month
{
  type: 'monthly',
  interval: 1,
  monthlyPattern: 'dayOfMonth',
  dayOfMonth: 15
}

// Second Tuesday of every month
{
  type: 'monthly',
  interval: 1,
  monthlyPattern: 'dayOfWeek',
  weekOfMonth: 2,
  dayOfWeek: 2 // Tuesday
}

// Last Friday of every quarter
{
  type: 'monthly',
  interval: 3,
  monthlyPattern: 'dayOfWeek',
  weekOfMonth: -1, // Last week
  dayOfWeek: 5 // Friday
}
```

### Yearly Recurrence
```typescript
// Every year on the same date
{ type: 'yearly', interval: 1 }

// Every 2 years
{ type: 'yearly', interval: 2 }
```

## 🎨 Customization

### Theme Tokens
The component uses semantic design tokens that can be customized in your CSS:

```css
:root {
  --calendar-selected: 262 87% 68%;
  --calendar-selected-foreground: 0 0% 100%;
  --calendar-recurring: 262 87% 88%;
  --calendar-recurring-foreground: 262 87% 30%;
  --calendar-today: 0 0% 9%;
  --calendar-today-foreground: 0 0% 98%;
}
```

### Component Styling
Override component styles using Tailwind classes:

```tsx
<RecurringDatePicker 
  className="my-custom-styles"
  onDatesChange={handleDatesChange}
/>
```

## 🔧 Technical Details

### Dependencies
- **React 18+**: Modern React with hooks
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **date-fns**: Date manipulation utilities
- **Radix UI**: Accessible component primitives

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- **Optimized Renders**: Minimal re-renders with Zustand
- **Memoized Calculations**: Heavy computations are cached
- **Virtual Scrolling**: Efficient rendering of large date lists
- **Bundle Size**: Tree-shakeable components

## 🐛 Known Issues & Limitations

1. **Maximum Dates**: Limited to 1000 recurring dates for performance
2. **Timezone**: Currently uses local timezone only
3. **Year Range**: Default preview limited to 2 years when no end date

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Use semantic design tokens
- Maintain accessibility standards

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by TickTick's recurring date picker
- Built with modern React patterns
- Uses Radix UI for accessibility
- Styled with Tailwind CSS design system

---

**Built with ❤️ by [Your Name]**