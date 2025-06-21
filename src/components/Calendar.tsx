import React, { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { EventModal } from './EventModal';
import { SearchAndFilter } from './SearchAndFilter';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { CalendarEvent, EventFormData } from '../types/calendar';
import { canEventBeMoved } from '../utils/eventUtils';

export const Calendar: React.FC = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    event?: CalendarEvent;
    selectedDate?: Date;
  }>({
    isOpen: false,
    mode: 'create',
  });

  const {
    currentDate,
    selectedDate,
    navigateToNextMonth,
    navigateToPrevMonth,
    goToToday,
    selectDate,
  } = useCalendar();

  const {
    events,
    searchQuery,
    selectedCategories,
    setSearchQuery,
    setSelectedCategories,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    getEventById,
  } = useEvents();

  const { dragState, startDrag, setDragOver, endDrag, cancelDrag } = useDragAndDrop();

  const handleDateClick = (date: Date) => {
    selectDate(date);
    setModalState({
      isOpen: true,
      mode: 'create',
      selectedDate: date,
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      event,
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
    });
  };

  const handleEventSubmit = (formData: EventFormData) => {
    if (modalState.mode === 'create') {
      addEvent(formData);
    } else if (modalState.event) {
      updateEvent(modalState.event.id, formData);
    }
    handleModalClose();
  };

  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId);
    handleModalClose();
  };

  const handleDragStart = (event: CalendarEvent, date: Date) => {
    startDrag(event, date);
  };

  const handleDragOver = (date: Date) => {
    setDragOver(date);
  };

  const handleDragEnd = () => {
    const { draggedEvent, dragOverDate } = endDrag();
    
    if (draggedEvent && dragOverDate) {
      const { canMove, conflicts } = canEventBeMoved(draggedEvent, dragOverDate, events);
      
      if (canMove) {
        moveEvent(draggedEvent.id, dragOverDate);
      } else {
        // Show conflict warning
        console.warn('Cannot move event due to conflicts:', conflicts);
        // You could show a toast or modal here
      }
    }
  };

  const handleDragCancel = () => {
    cancelDrag();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Search and Filter */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
                <p className="text-blue-100">Manage your schedule with ease</p>
              </div>
              <SearchAndFilter
                searchQuery={searchQuery}
                selectedCategories={selectedCategories}
                onSearchChange={setSearchQuery}
                onCategoriesChange={setSelectedCategories}
              />
            </div>
          </div>

          {/* Calendar Header */}
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={navigateToPrevMonth}
            onNextMonth={navigateToNextMonth}
            onToday={goToToday}
          />

          {/* Calendar Grid */}
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            dragState={dragState}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        event={modalState.event}
        selectedDate={modalState.selectedDate}
        onClose={handleModalClose}
        onSubmit={handleEventSubmit}
        onDelete={handleEventDelete}
      />
    </div>
  );
};