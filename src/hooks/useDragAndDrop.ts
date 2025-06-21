import { useState, useCallback } from 'react';
import { CalendarEvent, DragState } from '../types/calendar';

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedEvent: null,
    dragStartDate: null,
    dragOverDate: null,
  });

  const startDrag = useCallback((event: CalendarEvent, startDate: Date) => {
    setDragState({
      isDragging: true,
      draggedEvent: event,
      dragStartDate: startDate,
      dragOverDate: null,
    });
  }, []);

  const setDragOver = useCallback((date: Date | null) => {
    setDragState(prev => ({
      ...prev,
      dragOverDate: date,
    }));
  }, []);

  const endDrag = useCallback(() => {
    const result = {
      draggedEvent: dragState.draggedEvent,
      dragStartDate: dragState.dragStartDate,
      dragOverDate: dragState.dragOverDate,
    };

    setDragState({
      isDragging: false,
      draggedEvent: null,
      dragStartDate: null,
      dragOverDate: null,
    });

    return result;
  }, [dragState]);

  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedEvent: null,
      dragStartDate: null,
      dragOverDate: null,
    });
  }, []);

  return {
    dragState,
    startDrag,
    setDragOver,
    endDrag,
    cancelDrag,
  };
};