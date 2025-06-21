import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventFormData, EventCategory } from '../types/calendar';
import { generateRecurringEvents, createEventFromForm, searchEvents, filterEventsByCategories } from '../utils/eventUtils';
import { saveEventsToStorage, loadEventsFromStorage } from '../utils/storageUtils';
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

export const useEvents = () => {
  const [baseEvents, setBaseEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);

  // Load events from storage on mount
  useEffect(() => {
    const stored = loadEventsFromStorage();
    setBaseEvents(stored);
  }, []);

  // Generate recurring events when base events change
  useEffect(() => {
    const currentDate = new Date();
    const startDate = startOfMonth(subMonths(currentDate, 6));
    const endDate = endOfMonth(addMonths(currentDate, 12));

    const generatedEvents = baseEvents.flatMap(event =>
      generateRecurringEvents(event, startDate, endDate)
    );

    setAllEvents(generatedEvents);
  }, [baseEvents]);

  // Apply filters when events, search query, or categories change
  useEffect(() => {
    let filtered = allEvents;

    if (searchQuery) {
      filtered = searchEvents(filtered, searchQuery);
    }

    if (selectedCategories.length > 0) {
      filtered = filterEventsByCategories(filtered, selectedCategories);
    }

    setFilteredEvents(filtered);
  }, [allEvents, searchQuery, selectedCategories]);

  const addEvent = useCallback((formData: EventFormData) => {
    const newEvent = createEventFromForm(formData);
    const updatedEvents = [...baseEvents, newEvent];
    
    setBaseEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  }, [baseEvents]);

  const updateEvent = useCallback((eventId: string, formData: EventFormData) => {
    const updatedEvents = baseEvents.map(event => {
      if (event.id === eventId || event.originalEventId === eventId) {
        const updatedEvent = createEventFromForm(formData);
        return { ...updatedEvent, id: event.id };
      }
      return event;
    });

    setBaseEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  }, [baseEvents]);

  const deleteEvent = useCallback((eventId: string) => {
    const updatedEvents = baseEvents.filter(event => 
      event.id !== eventId && event.originalEventId !== eventId
    );
    
    setBaseEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  }, [baseEvents]);

  const moveEvent = useCallback((eventId: string, newDate: Date) => {
    const updatedAllEvents = allEvents.map(event => {
      if (event.id === eventId) {
        const eventDuration = event.endDate.getTime() - event.startDate.getTime();
        return {
          ...event,
          startDate: new Date(newDate),
          endDate: new Date(newDate.getTime() + eventDuration),
        };
      }
      return event;
    });

    // Update base events if it's not a recurring instance
    const eventToMove = allEvents.find(e => e.id === eventId);
    if (eventToMove && !eventToMove.originalEventId) {
      const updatedBaseEvents = baseEvents.map(event => {
        if (event.id === eventId) {
          const eventDuration = event.endDate.getTime() - event.startDate.getTime();
          return {
            ...event,
            startDate: new Date(newDate),
            endDate: new Date(newDate.getTime() + eventDuration),
          };
        }
        return event;
      });
      
      setBaseEvents(updatedBaseEvents);
      saveEventsToStorage(updatedBaseEvents);
    } else {
      // For recurring instances, we need to update the all events directly
      setAllEvents(updatedAllEvents);
    }
  }, [allEvents, baseEvents]);

  const getEventById = useCallback((eventId: string) => {
    return allEvents.find(event => event.id === eventId) || 
           baseEvents.find(event => event.id === eventId);
  }, [allEvents, baseEvents]);

  return {
    events: filteredEvents,
    allEvents,
    searchQuery,
    selectedCategories,
    setSearchQuery,
    setSelectedCategories,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    getEventById,
  };
};