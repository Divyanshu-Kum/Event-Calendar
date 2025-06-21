import { useState, useCallback } from 'react';
import { navigateMonth } from '../utils/dateUtils';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigateToNextMonth = useCallback(() => {
    setCurrentDate(prev => navigateMonth(prev, 'next'));
  }, []);

  const navigateToPrevMonth = useCallback(() => {
    setCurrentDate(prev => navigateMonth(prev, 'prev'));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return {
    currentDate,
    selectedDate,
    navigateToNextMonth,
    navigateToPrevMonth,
    goToToday,
    selectDate,
  };
};