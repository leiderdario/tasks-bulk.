const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la tarea es obligatorio'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  status: {
    type: String,
    enum: {
      values: ['pendiente', 'en_progreso', 'completada'],
      message: 'El estado debe ser: pendiente, en_progreso o completada'
    },
    default: 'pendiente'
  },
  priority: {
    type: String,
    enum: {
      values: ['baja', 'media', 'alta'],
      message: 'La prioridad debe ser: baja, media o alta'
    },
    default: 'media'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= new Date();
      },
      message: 'La fecha de vencimiento no puede ser en el pasado'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Índice para mejorar las consultas
taskSchema.index({ user: 1, createdAt: -1 });

// Actualizar completedAt cuando se marca como completada
taskSchema.pre('save', function(next) {
  if (this.status === 'completada' && !this.completedAt) {
    this.completedAt = new Date();
    this.completed = true;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
