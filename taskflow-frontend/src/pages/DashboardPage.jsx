import { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { taskService } from '@/services/taskService';
import toast from 'react-hot-toast';
import { Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TASK_STATUS } from '@/utils/constants';

export const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Error al cargar las tareas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Tarea eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      if (selectedTask) {
        const response = await taskService.updateTask(selectedTask._id, taskData);
        setTasks(tasks.map(t => t._id === selectedTask._id ? response.data.task : t));
        toast.success('Tarea actualizada exitosamente');
      } else {
        const response = await taskService.createTask(taskData);
        setTasks([response.data.task, ...tasks]);
        toast.success('Tarea creada exitosamente');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al guardar la tarea';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TASK_STATUS.PENDING).length,
    inProgress: tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
    completed: tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona y organiza tus tareas
          </p>
        </div>
        <Button onClick={handleCreateTask} className="flex items-center">
          <Plus size={20} className="mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <CheckCircle2 className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertCircle className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">En Progreso</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        title={selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
        size="lg"
      >
        <TaskForm
          task={selectedTask}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
