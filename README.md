# Dynamic Event Calendar

A comprehensive, production-ready event calendar application built with React, TypeScript, and Tailwind CSS. This calendar offers advanced features including recurring events, drag-and-drop rescheduling, event conflict management, and persistent storage.

## ✨ Features

### Core Functionality
- **Monthly Calendar View**: Navigate through months with a clean, intuitive interface
- **Event Management**: Create, edit, and delete events with rich forms
- **Drag & Drop**: Reschedule events by dragging them to different dates
- **Recurring Events**: Support for daily, weekly, monthly, and custom recurrence patterns
- **Event Conflicts**: Automatic detection and prevention of overlapping events
- **Search & Filter**: Find events by title/description and filter by categories
- **Persistent Storage**: Events are saved locally and persist across sessions

### Design & User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Color Coding**: Organize events with customizable colors and categories
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader friendly

### Technical Features
- **TypeScript**: Full type safety and excellent developer experience
- **Modular Architecture**: Clean separation of concerns with focused components
- **Custom Hooks**: Reusable logic for calendar state, events, and drag-and-drop
- **Efficient Rendering**: Optimized performance for large numbers of events
- **Local Storage**: Automatic data persistence without external dependencies

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or set up the project**
   ```bash
   # If starting fresh, the project is already set up
   # If cloning, run: git clone <repository-url>
   cd event-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the calendar

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📅 How to Use

### Creating Events
1. Click on any date in the calendar
2. Fill in the event details in the modal:
   - **Title**: Required event name
   - **Description**: Optional details about the event
   - **Date & Time**: Set start and end date/time
   - **Color**: Choose from 8 color options for visual organization
   - **Category**: Select from predefined categories (Work, Personal, Health, etc.)
   - **Recurrence**: Optional recurring patterns

### Managing Events
- **Edit**: Click on any existing event to modify its details
- **Delete**: Use the delete button in the edit modal
- **Move**: Drag and drop events to reschedule them
- **Search**: Use the search bar to find events by title or description
- **Filter**: Toggle categories to show/hide specific types of events

### Recurring Events
The calendar supports several recurrence patterns:
- **Daily**: Every N days
- **Weekly**: Every N weeks, with optional specific days
- **Monthly**: Every N months
- **Custom**: Custom interval in days

### Conflict Management
The calendar automatically detects overlapping events and prevents scheduling conflicts. When attempting to create or move an event that would conflict with existing events, you'll receive appropriate warnings.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Calendar.tsx     # Main calendar container
│   ├── CalendarHeader.tsx # Month navigation
│   ├── CalendarGrid.tsx # Calendar layout
│   ├── CalendarDay.tsx  # Individual day cells
│   ├── EventItem.tsx    # Event display components
│   ├── EventModal.tsx   # Event creation/editing form
│   └── SearchAndFilter.tsx # Search and filtering UI
├── hooks/               # Custom React hooks
│   ├── useCalendar.ts   # Calendar state management
│   ├── useEvents.ts     # Event management logic
│   └── useDragAndDrop.ts # Drag and drop functionality
├── types/               # TypeScript type definitions
│   └── calendar.ts      # Event and calendar types
├── utils/               # Utility functions
│   ├── dateUtils.ts     # Date manipulation helpers
│   ├── eventUtils.ts    # Event-related utilities
│   └── storageUtils.ts  # Local storage management
└── App.tsx             # Application root component
```

## 🛠️ Technical Details

### Dependencies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **date-fns**: Lightweight date manipulation library
- **Lucide React**: Beautiful, customizable icons

### Key Features Implementation

#### Event Storage
Events are stored in browser localStorage and automatically synchronized. The storage system handles:
- Serialization/deserialization of Date objects
- Automatic backup and recovery
- Performance optimization for large event sets

#### Recurring Events
The recurring event system generates individual event instances based on recurrence patterns. It supports:
- Complex recurrence rules with intervals
- End conditions (date or occurrence count)
- Efficient generation within visible date ranges

#### Drag and Drop
Custom drag-and-drop implementation that:
- Provides visual feedback during dragging
- Handles conflict detection in real-time
- Supports both mouse and touch interactions
- Maintains event data integrity during moves

## 🎨 Customization

### Colors and Themes
Event colors can be customized by modifying the `colorClasses` object in `EventItem.tsx`. The application uses a consistent color system with:
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Accent: Emerald (#10B981)
- Additional colors for categories and states

### Adding New Categories
To add new event categories:
1. Update the `EventCategory` type in `types/calendar.ts`
2. Add the new category to the options in `SearchAndFilter.tsx` and `EventModal.tsx`
3. Optionally add category-specific colors or icons

### Extending Recurrence Patterns
New recurrence patterns can be added by:
1. Extending the `RecurrenceType` type
2. Updating the `generateRecurringEvents` function in `eventUtils.ts`
3. Adding UI options in the `EventModal.tsx` component

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint for code quality checks

### Code Quality
The project includes:
- ESLint configuration for code consistency
- TypeScript strict mode for type safety
- Modular architecture with clear separation of concerns
- Comprehensive error handling and edge case management

## 📱 Browser Support

The calendar supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code style and TypeScript conventions
2. Keep components focused and under 200 lines when possible
3. Add proper type definitions for new features
4. Test drag-and-drop functionality across different browsers
5. Ensure responsive design works on mobile devices

## 📄 License

This project is open source and available under the MIT License.