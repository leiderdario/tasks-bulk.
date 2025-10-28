export const TASK_STATUS = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en_progreso',
  COMPLETED: 'completada',
};

export const TASK_PRIORITY = {
  LOW: 'baja',
  MEDIUM: 'media',
  HIGH: 'alta',
};

export const STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pendiente',
  [TASK_STATUS.IN_PROGRESS]: 'En Progreso',
  [TASK_STATUS.COMPLETED]: 'Completada',
};

export const PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Baja',
  [TASK_PRIORITY.MEDIUM]: 'Media',
  [TASK_PRIORITY.HIGH]: 'Alta',
};

export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [TASK_PRIORITY.MEDIUM]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [TASK_PRIORITY.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
