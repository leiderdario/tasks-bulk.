const Task = require('../models/Task.model');
const { taskSchema } = require('../validators/validators');

// @desc    Crear nueva tarea
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    // Validar datos
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Crear tarea con el usuario autenticado
    const task = await Task.create({
      ...req.body,
      user: req.userId
    });

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: { task }
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy = '-createdAt' } = req.query;

    // Construir filtros
    const filters = { user: req.userId };
    
    if (status) {
      filters.status = status;
    }
    
    if (priority) {
      filters.priority = priority;
    }

    // Obtener tareas
    const tasks = await Task.find(filters)
      .sort(sortBy)
      .populate('user', 'username email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

// @desc    Obtener tarea por ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'username email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar que la tarea pertenezca al usuario
    if (task.user._id.toString() !== req.userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado para ver esta tarea'
      });
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener tarea',
      error: error.message
    });
  }
};

// @desc    Actualizar tarea
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    // Validar datos
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map(detail => detail.message)
      });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar que la tarea pertenezca al usuario
    if (task.user.toString() !== req.userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado para actualizar esta tarea'
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: { task }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

// @desc    Eliminar tarea
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar que la tarea pertenezca al usuario
    if (task.user.toString() !== req.userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado para eliminar esta tarea'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
