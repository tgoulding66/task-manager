import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(parsedDate)) {
    return 'Today';
  }
  
  if (isTomorrow(parsedDate)) {
    return 'Tomorrow';
  }
  
  if (isYesterday(parsedDate)) {
    return 'Yesterday';
  }
  
  return format(parsedDate, 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

export const formatDateForInput = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
};

export const isOverdue = (dueDate: string | Date): boolean => {
  const parsedDate = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return parsedDate < new Date();
};

export const isDueSoon = (dueDate: string | Date, days: number = 3): boolean => {
  const parsedDate = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const now = new Date();
  const timeDiff = parsedDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff <= days && daysDiff >= 0;
}; 