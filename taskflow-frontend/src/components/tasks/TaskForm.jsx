import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TASK_STATUS, TASK_PRIORITY, STATUS_LABELS, PRIORITY_LABELS } from '@/utils/constants';

const statusOptions = [
  { value: '', label: '-- Seleccionar estado --' },
  ...Object.values(TASK_STATUS).map(status => ({
    value: status,
    label: STATUS_LABELS[status]
  }))
];

const priorityOptions = [
  { value: '', label: '-- Seleccionar prioridad --' },
  ...Object.values(TASK_PRIORITY).map(priority => ({
    value: priority,
    label: PRIORITY_LABELS[priority]
  }))
];

export const TaskForm = ({ task, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.PENDING,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'La fecha no puede ser en el pasado';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const submitData = { ...formData };
    if (submitData.dueDate) {
      submitData.dueDate = new Date(submitData.dueDate).toISOString();
    } else {
      delete submitData.dueDate;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título *"
        name="title"
        placeholder="Ej: Completar informe mensual"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          rows="3"
          placeholder="Detalles de la tarea..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Estado"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />

        <Select
          label="Prioridad"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
      </div>

      <Input
        label="Fecha de vencimiento"
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        error={errors.dueDate}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {task ? 'Actualizar' : 'Crear'} Tarea
        </Button>
      </div>
    </form>
  );
};
