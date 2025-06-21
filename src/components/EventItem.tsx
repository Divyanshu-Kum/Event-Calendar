import React from 'react';
import { CalendarEvent } from '../types/calendar';
import { formatTime } from '../utils/dateUtils';

interface EventItemProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  isDragging: boolean;
}

const colorClasses = {
  blue: 'bg-blue-500 text-white',
  purple: 'bg-purple-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-500 text-black',
  pink: 'bg-pink-500 text-white',
  indigo: 'bg-indigo-500 text-white',
};

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onClick,
  onDragStart,
  isDragging,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(event);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart(event);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`
        px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200
        ${colorClasses[event.color]}
        ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'}
        truncate
      `}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={`${event.title} - ${formatTime(event.startDate)}`}
    >
      <div className="flex items-center gap-1">
        <span className="truncate">{event.title}</span>
        {event.isRecurring && (
          <span className="text-xs opacity-75">↻</span>
        )}
      </div>
      <div className="text-xs opacity-75">
        {formatTime(event.startDate)}
      </div>
    </div>
  );
};