import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  addDays,
  addWeeks,
  addMonths as addMonthsToDate,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
} from 'date-fns';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'yyyy-MM-dd\'T\'HH:mm');
};

export const parseDateTime = (dateStr: string, timeStr: string): Date => {
  return parseISO(`${dateStr}T${timeStr}`);
};

export const getCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const isDateInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

export const isDatesSame = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const navigateMonth = (date: Date, direction: 'prev' | 'next'): Date => {
  return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
};

export const getMonthYearString = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getDayOfWeek = (date: Date): string => {
  return format(date, 'EEEE');
};

export const getDayNumber = (date: Date): number => {
  return date.getDate();
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  return !isBefore(dayEnd, start) && !isAfter(dayStart, end);
};

export const areDatesOverlapping = (
  start1: Date, 
  end1: Date, 
  start2: Date, 
  end2: Date
): boolean => {
  return !isBefore(end1, start2) && !isAfter(start1, end2);
};

export const createDateFromString = (dateStr: string): Date => {
  return new Date(dateStr);
};

export const getWeekDays = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};