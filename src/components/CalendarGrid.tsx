import React from 'react';
import { CalendarDay } from './CalendarDay';
import { getCalendarDays, getWeekDays } from '../utils/dateUtils';
import { CalendarEvent, DragState } from '../types/calendar';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  dragState: DragState;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent, date: Date) => void;
  onDragOver: (date: Date) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  events,
  dragState,
  onDateClick,
  onEventClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
}) => {
  const calendarDays = getCalendarDays(currentDate);
  const weekDays = getWeekDays();

  return (
    <div className="p-6">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center font-medium text-gray-600">
            <div className="hidden sm:block">{day}</div>
            <div className="sm:hidden">{day.charAt(0)}</div>
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(date => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            currentMonth={currentDate}
            selectedDate={selectedDate}
            events={events}
            dragState={dragState}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
          />
        ))}
      </div>
    </div>
  );
};