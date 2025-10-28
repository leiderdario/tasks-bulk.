const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User.model');
const Task = require('../src/models/Task.model');

describe('Task Endpoints', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Conectar a base de datos de prueba
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    // Limpiar y cerrar conexión
    await Task.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });

  beforeEach(async () => {
    // Limpiar datos
    await Task.deleteMany({});
    await User.deleteMany({});

    // Crear usuario y obtener token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = res.body.data.token;
    userId = res.body.data.user.id;
  });

  describe('POST /api/tasks', () => {
    it('Debe crear una nueva tarea correctamente', async () => {
      const newTask = {
        title: 'Tarea de prueba',
        description: 'Descripción de la tarea',
        status: 'pendiente',
        priority: 'alta',
        dueDate: new Date(Date.now() + 86400000).toISOString() // Mañana
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Tarea creada exitosamente');
      expect(res.body.data.task.title).toBe(newTask.title);
      expect(res.body.data.task.status).toBe('pendiente');
      expect(res.body.data.task.priority).toBe('alta');
    });

    it('Debe fallar sin token de autenticación', async () => {
      const newTask = {
        title: 'Tarea de prueba',
        description: 'Descripción'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar si falta el título', async () => {
      const invalidTask = {
        description: 'Descripción sin título'
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar con título muy corto', async () => {
      const invalidTask = {
        title: 'AB' // Menos de 3 caracteres
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar con fecha en el pasado', async () => {
      const invalidTask = {
        title: 'Tarea con fecha pasada',
        dueDate: new Date('2020-01-01').toISOString()
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Crear varias tareas de prueba
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Tarea 1', status: 'pendiente', priority: 'alta' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Tarea 2', status: 'en_progreso', priority: 'media' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Tarea 3', status: 'completada', priority: 'baja' });
    });

    it('Debe obtener todas las tareas del usuario', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(3);
      expect(res.body.data.tasks).toHaveLength(3);
    });

    it('Debe filtrar tareas por estado', async () => {
      const res = await request(app)
        .get('/api/tasks?status=pendiente')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data.tasks[0].status).toBe('pendiente');
    });

    it('Debe filtrar tareas por prioridad', async () => {
      const res = await request(app)
        .get('/api/tasks?priority=alta')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data.tasks[0].priority).toBe('alta');
    });

    it('Debe fallar sin autenticación', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      // Crear tarea de prueba
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Tarea a eliminar' });

      taskId = res.body.data.task._id;
    });

    it('Debe eliminar una tarea correctamente', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Tarea eliminada exitosamente');

      // Verificar que la tarea fue eliminada
      const getRes = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('Debe fallar al eliminar tarea inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar sin autenticación', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          title: 'Tarea original',
          status: 'pendiente',
          priority: 'media'
        });

      taskId = res.body.data.task._id;
    });

    it('Debe actualizar una tarea correctamente', async () => {
      const updates = {
        title: 'Tarea actualizada',
        status: 'completada',
        priority: 'alta'
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.task.title).toBe(updates.title);
      expect(res.body.data.task.status).toBe('completada');
    });

    it('Debe fallar con datos inválidos', async () => {
      const invalidUpdate = {
        title: 'AB' // Muy corto
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUpdate)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });
});
