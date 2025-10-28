import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(new Date(date));
};

export const isUpcoming = (date) => {
  if (!date) return false;
  return isFuture(new Date(date));
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
