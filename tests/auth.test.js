const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User.model');

describe('Auth Endpoints', () => {
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
    await User.deleteMany({});
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });

  beforeEach(async () => {
    // Limpiar usuarios antes de cada prueba
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('Debe registrar un nuevo usuario correctamente', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Usuario registrado exitosamente');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(newUser.email);
      expect(res.body.data.user.username).toBe(newUser.username);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('Debe fallar si falta el nombre de usuario', async () => {
      const invalidUser = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Error de validación');
    });

    it('Debe fallar si el email es inválido', async () => {
      const invalidUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar si la contraseña es muy corta', async () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar si el usuario ya existe', async () => {
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Registrar usuario por primera vez
      await request(app).post('/api/auth/register').send(user);

      // Intentar registrar el mismo usuario
      const res = await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('Debe iniciar sesión correctamente con credenciales válidas', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login exitoso');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
    });

    it('Debe fallar con credenciales incorrectas', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Credenciales inválidas');
    });

    it('Debe fallar con email no registrado', async () => {
      const credentials = {
        email: 'noexiste@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeEach(async () => {
      // Registrar y obtener token
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      authToken = res.body.data.token;
    });

    it('Debe obtener información del usuario autenticado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('Debe fallar sin token de autenticación', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('Debe fallar con token inválido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
