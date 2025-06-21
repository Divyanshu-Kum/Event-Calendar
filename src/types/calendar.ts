export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: EventColor;
  category: EventCategory;
  recurrence?: RecurrencePattern;
  isRecurring: boolean;
  originalEventId?: string; // For recurring event instances
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0-6, Sunday to Saturday
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  endAfterOccurrences?: number;
}

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom';

export type EventColor = 
  | 'blue' | 'purple' | 'emerald' | 'orange' 
  | 'red' | 'yellow' | 'pink' | 'indigo';

export type EventCategory = 
  | 'work' | 'personal' | 'health' | 'social' 
  | 'education' | 'family' | 'travel' | 'other';

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: 'month' | 'week' | 'day';
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  searchQuery: string;
  selectedCategories: EventCategory[];
}

export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  color: EventColor;
  category: EventCategory;
  isRecurring: boolean;
  recurrence?: Partial<RecurrencePattern>;
}

export interface DragState {
  isDragging: boolean;
  draggedEvent: CalendarEvent | null;
  dragStartDate: Date | null;
  dragOverDate: Date | null;
}