const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API REST para gestión de tareas con autenticación JWT',
      contact: {
        name: 'TaskFlow Support',
        email: 'support@taskflow.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'http://localhost:3001',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido del login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único de la tarea'
            },
            title: {
              type: 'string',
              description: 'Título de la tarea',
              minLength: 3,
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Descripción de la tarea',
              maxLength: 500
            },
            status: {
              type: 'string',
              enum: ['pendiente', 'en_progreso', 'completada'],
              default: 'pendiente',
              description: 'Estado de la tarea'
            },
            priority: {
              type: 'string',
              enum: ['baja', 'media', 'alta'],
              default: 'media',
              description: 'Prioridad de la tarea'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de vencimiento'
            },
            completed: {
              type: 'boolean',
              default: false,
              description: 'Indica si la tarea está completada'
            },
            user: {
              type: 'string',
              description: 'ID del usuario propietario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de errores de validación'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints de autenticación y gestión de usuarios'
      },
      {
        name: 'Tareas',
        description: 'Endpoints de gestión de tareas'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
