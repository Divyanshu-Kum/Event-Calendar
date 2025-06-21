import React from 'react';
import { EventItem } from './EventItem';
import { 
  isDateInCurrentMonth, 
  isDateToday, 
  isDatesSame, 
  getDayNumber 
} from '../utils/dateUtils';
import { getEventsForDate } from '../utils/eventUtils';
import { CalendarEvent, DragState } from '../types/calendar';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
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

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
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
  const dayEvents = getEventsForDate(events, date);
  const isCurrentMonth = isDateInCurrentMonth(date, currentMonth);
  const isToday = isDateToday(date);
  const isSelected = selectedDate && isDatesSame(date, selectedDate);
  const isDragOver = dragState.dragOverDate && isDatesSame(date, dragState.dragOverDate);
  
  const handleClick = () => {
    onDateClick(date);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(date);
  };

  const handleDragLeave = () => {
    onDragOver(date);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnd();
  };

  return (
    <div
      className={`
        min-h-[120px] border border-gray-200 p-2 cursor-pointer transition-all duration-200
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'ring-2 ring-blue-500' : ''}
        ${isSelected ? 'bg-blue-50' : ''}
        ${isDragOver ? 'bg-emerald-50 ring-2 ring-emerald-500' : ''}
        hover:bg-gray-50
      `}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`
            text-sm font-medium
            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
            ${isToday ? 'text-blue-600 font-bold' : ''}
          `}
        >
          {getDayNumber(date)}
        </span>
      </div>

      <div className="space-y-1">
        {dayEvents.slice(0, 3).map(event => (
          <EventItem
            key={event.id}
            event={event}
            onClick={onEventClick}
            onDragStart={(e) => onDragStart(e, date)}
            isDragging={dragState.draggedEvent?.id === event.id}
          />
        ))}
        
        {dayEvents.length > 3 && (
          <div className="text-xs text-gray-500 px-2 py-1">
            +{dayEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};