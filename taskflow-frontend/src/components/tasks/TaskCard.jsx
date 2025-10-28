import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  STATUS_LABELS, 
  PRIORITY_LABELS 
} from '@/utils/constants';
import { formatDate, isOverdue } from '@/utils/helpers';
import { Clock, Edit, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/utils/helpers';

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const isDue = task.dueDate && isOverdue(task.dueDate);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
          <div className="flex space-x-1 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Editar tarea"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Eliminar tarea"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={STATUS_COLORS[task.status]}>
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge className={PRIORITY_COLORS[task.priority]}>
            Prioridad: {PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={cn(
            'flex items-center text-sm',
            isDue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          )}>
            <Calendar size={14} className="mr-1" />
            <span>
              {isDue && '¡Vencida! '}
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
          <Clock size={12} className="mr-1" />
          <span>Creada {formatDate(task.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
};
