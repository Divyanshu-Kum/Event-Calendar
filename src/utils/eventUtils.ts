import { CalendarEvent, RecurrencePattern, EventFormData } from '../types/calendar';
import {
  addDays,
  addWeeks,
  addMonths,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  isSameDay,
} from 'date-fns';
import { areDatesOverlapping } from './dateUtils';

export const generateRecurrenceId = (): string => {
  return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createEventFromForm = (formData: EventFormData): CalendarEvent => {
  const startDate = new Date(`${formData.startDate}T${formData.startTime}`);
  const endDate = new Date(`${formData.endDate}T${formData.endTime}`);

  return {
    id: generateRecurrenceId(),
    title: formData.title,
    description: formData.description,
    startDate,
    endDate,
    color: formData.color,
    category: formData.category,
    isRecurring: formData.isRecurring,
    recurrence: formData.isRecurring ? (formData.recurrence as RecurrencePattern) : undefined,
  };
};

export const generateRecurringEvents = (
  baseEvent: CalendarEvent,
  startDate: Date,
  endDate: Date
): CalendarEvent[] => {
  if (!baseEvent.isRecurring || !baseEvent.recurrence) {
    return [baseEvent];
  }

  const events: CalendarEvent[] = [];
  const { type, interval, daysOfWeek, dayOfMonth, endDate: recurrenceEndDate, endAfterOccurrences } = baseEvent.recurrence;
  
  let currentDate = new Date(baseEvent.startDate);
  let occurrenceCount = 0;
  const maxOccurrences = endAfterOccurrences || 365; // Prevent infinite loops

  while (
    isBefore(currentDate, endDate) &&
    occurrenceCount < maxOccurrences &&
    (!recurrenceEndDate || isBefore(currentDate, recurrenceEndDate))
  ) {
    if (!isBefore(currentDate, startDate)) {
      const eventDuration = baseEvent.endDate.getTime() - baseEvent.startDate.getTime();
      const newEvent: CalendarEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-${occurrenceCount}`,
        startDate: new Date(currentDate),
        endDate: new Date(currentDate.getTime() + eventDuration),
        originalEventId: baseEvent.id,
      };
      events.push(newEvent);
    }

    // Calculate next occurrence
    switch (type) {
      case 'daily':
        currentDate = addDays(currentDate, interval);
        break;
      case 'weekly':
        if (daysOfWeek && daysOfWeek.length > 0) {
          // Find next occurrence in the week
          let nextDate = addDays(currentDate, 1);
          let found = false;
          for (let i = 0; i < 7; i++) {
            if (daysOfWeek.includes(nextDate.getDay())) {
              currentDate = nextDate;
              found = true;
              break;
            }
            nextDate = addDays(nextDate, 1);
          }
          if (!found) {
            currentDate = addWeeks(currentDate, interval);
          }
        } else {
          currentDate = addWeeks(currentDate, interval);
        }
        break;
      case 'monthly':
        if (dayOfMonth) {
          const nextMonth = addMonths(currentDate, interval);
          currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(dayOfMonth, 31));
        } else {
          currentDate = addMonths(currentDate, interval);
        }
        break;
      case 'custom':
        currentDate = addDays(currentDate, interval);
        break;
    }

    occurrenceCount++;
  }

  return events;
};

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  return events.filter(event => 
    areDatesOverlapping(event.startDate, event.endDate, dayStart, dayEnd)
  );
};

export const getEventConflicts = (
  newEvent: CalendarEvent,
  existingEvents: CalendarEvent[]
): CalendarEvent[] => {
  return existingEvents.filter(event => 
    event.id !== newEvent.id &&
    areDatesOverlapping(newEvent.startDate, newEvent.endDate, event.startDate, event.endDate)
  );
};

export const canEventBeMoved = (
  event: CalendarEvent,
  newDate: Date,
  existingEvents: CalendarEvent[]
): { canMove: boolean; conflicts: CalendarEvent[] } => {
  const eventDuration = event.endDate.getTime() - event.startDate.getTime();
  const newStartDate = new Date(newDate);
  const newEndDate = new Date(newDate.getTime() + eventDuration);

  const tempEvent: CalendarEvent = {
    ...event,
    startDate: newStartDate,
    endDate: newEndDate,
  };

  const conflicts = getEventConflicts(tempEvent, existingEvents);
  
  return {
    canMove: conflicts.length === 0,
    conflicts,
  };
};

export const moveEvent = (event: CalendarEvent, newDate: Date): CalendarEvent => {
  const eventDuration = event.endDate.getTime() - event.startDate.getTime();
  
  return {
    ...event,
    startDate: new Date(newDate),
    endDate: new Date(newDate.getTime() + eventDuration),
  };
};

export const searchEvents = (events: CalendarEvent[], query: string): CalendarEvent[] => {
  if (!query.trim()) return events;
  
  const lowercaseQuery = query.toLowerCase();
  
  return events.filter(event =>
    event.title.toLowerCase().includes(lowercaseQuery) ||
    (event.description && event.description.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterEventsByCategories = (
  events: CalendarEvent[],
  categories: string[]
): CalendarEvent[] => {
  if (categories.length === 0) return events;
  
  return events.filter(event => categories.includes(event.category));
};