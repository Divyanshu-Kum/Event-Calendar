import { CalendarEvent } from '../types/calendar';

const STORAGE_KEY = 'calendar-events';

export const saveEventsToStorage = (events: CalendarEvent[]): void => {
  try {
    const serializedEvents = events.map(event => ({
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      recurrence: event.recurrence ? {
        ...event.recurrence,
        endDate: event.recurrence.endDate?.toISOString(),
      } : undefined,
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedEvents));
  } catch (error) {
    console.error('Failed to save events to storage:', error);
  }
};

export const loadEventsFromStorage = (): CalendarEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const serializedEvents = JSON.parse(stored);
    
    return serializedEvents.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      recurrence: event.recurrence ? {
        ...event.recurrence,
        endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : undefined,
      } : undefined,
    }));
  } catch (error) {
    console.error('Failed to load events from storage:', error);
    return [];
  }
};

export const clearEventsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear events from storage:', error);
  }
};