const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
      'string.max': 'El nombre de usuario no puede tener más de 50 caracteres',
      'any.required': 'El nombre de usuario es obligatorio'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe proporcionar un email válido',
      'any.required': 'El email es obligatorio'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es obligatoria'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe proporcionar un email válido',
      'any.required': 'El email es obligatorio'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es obligatoria'
    })
});

const taskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'El título debe tener al menos 3 caracteres',
      'string.max': 'El título no puede tener más de 100 caracteres',
      'any.required': 'El título es obligatorio'
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'La descripción no puede tener más de 500 caracteres'
    }),
  status: Joi.string()
    .valid('pendiente', 'en_progreso', 'completada')
    .messages({
      'any.only': 'El estado debe ser: pendiente, en_progreso o completada'
    }),
  priority: Joi.string()
    .valid('baja', 'media', 'alta')
    .messages({
      'any.only': 'La prioridad debe ser: baja, media o alta'
    }),
  dueDate: Joi.date()
    .min('now')
    .messages({
      'date.min': 'La fecha de vencimiento no puede ser en el pasado',
      'date.base': 'Debe proporcionar una fecha válida'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  taskSchema
};
