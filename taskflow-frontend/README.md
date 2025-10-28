# TaskFlow Frontend 🎨

Frontend React moderno para la API TaskFlow - Sistema de gestión de tareas con interfaz intuitiva y diseño responsivo.

## 🚀 Características

- ✅ **Autenticación completa** - Login y registro con JWT
- ✅ **Dashboard interactivo** - Vista general de tareas y estadísticas
- ✅ **CRUD de tareas** - Crear, leer, actualizar y eliminar tareas
- ✅ **Filtros y búsqueda** - Filtrar por estado, prioridad y búsqueda en tiempo real
- ✅ **Modo oscuro** - Toggle entre tema claro y oscuro
- ✅ **Diseño responsivo** - Optimizado para móvil, tablet y desktop
- ✅ **Validación de formularios** - Validación en tiempo real
- ✅ **Notificaciones** - Toast notifications para feedback visual
- ✅ **UI/UX moderno** - Diseño limpio con TailwindCSS

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **TailwindCSS** - Estilos y diseño
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Zustand** - Estado global
- **React Query** - Cache y sincronización
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

## 📋 Requisitos Previos

- Node.js 14+
- npm o yarn
- API TaskFlow corriendo en `http://localhost:3000`

## 🔧 Instalación

1. **Navegar a la carpeta del frontend**
```powershell
cd taskflow-frontend
```

2. **Instalar dependencias**
```powershell
npm install
```

3. **Configurar variables de entorno**
```powershell
copy .env.example .env
```

El archivo `.env` debe contener:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Iniciar el servidor de desarrollo**
```powershell
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
taskflow-frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Componentes de autenticación
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── tasks/             # Componentes de tareas
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── ui/                # Componentes UI reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Select.jsx
│   │   └── ProtectedRoute.jsx # HOC para rutas protegidas
│   ├── context/               # Contextos de React
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/                 # Páginas principales
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/              # Servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── taskService.js
│   ├── utils/                 # Utilidades
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Entry point
│   └── index.css              # Estilos globales
├── public/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Funcionalidades Principales

### Autenticación
- **Login**: Inicia sesión con email y contraseña
- **Registro**: Crea una nueva cuenta
- **Logout**: Cierra sesión de forma segura
- **Persistencia**: El token se guarda en localStorage

### Dashboard
- **Vista general**: Estadísticas de tareas (total, pendientes, en progreso, completadas)
- **Tarjetas de tareas**: Vista en grid con toda la información
- **Filtros**: Por estado y prioridad
- **Búsqueda**: Buscar por título o descripción

### Gestión de Tareas
- **Crear tarea**: Formulario completo con validaciones
- **Editar tarea**: Modificar cualquier campo
- **Eliminar tarea**: Con confirmación
- **Estados**: Pendiente, En Progreso, Completada
- **Prioridades**: Baja, Media, Alta
- **Fecha de vencimiento**: Con validación de fechas futuras

### UI/UX
- **Modo oscuro**: Toggle para cambiar entre tema claro y oscuro
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Animaciones**: Transiciones suaves
- **Notificaciones**: Feedback visual para todas las acciones
- **Loading states**: Indicadores de carga

## 🎨 Paleta de Colores

```css
/* Tema Claro */
- Primary: #3b82f6 (Azul)
- Background: #f9fafb (Gris claro)
- Surface: #ffffff (Blanco)
- Text: #111827 (Gris oscuro)

/* Tema Oscuro */
- Primary: #60a5fa (Azul claro)
- Background: #111827 (Gris oscuro)
- Surface: #1f2937 (Gris)
- Text: #f9fafb (Blanco)

/* Estados */
- Success: #10b981 (Verde)
- Warning: #f59e0b (Amarillo)
- Error: #ef4444 (Rojo)
- Info: #3b82f6 (Azul)
```

## 📱 Responsive Breakpoints

```css
- sm: 640px   /* Móviles grandes */
- md: 768px   /* Tablets */
- lg: 1024px  /* Laptops */
- xl: 1280px  /* Desktops */
```

## 🔐 Autenticación

El sistema de autenticación utiliza JWT tokens almacenados en localStorage. 

**Flujo:**
1. Usuario se registra o inicia sesión
2. API devuelve token JWT
3. Token se guarda en localStorage
4. Todas las peticiones incluyen el token en headers
5. Middleware valida el token en cada request
6. Token expira en 24h

## 🚦 Estados de las Tareas

| Estado | Color | Descripción |
|--------|-------|-------------|
| Pendiente | Amarillo | Tarea creada pero no iniciada |
| En Progreso | Azul | Tarea en desarrollo |
| Completada | Verde | Tarea finalizada |

## ⚡ Prioridades

| Prioridad | Color | Uso |
|-----------|-------|-----|
| Baja | Gris | Tareas no urgentes |
| Media | Naranja | Tareas normales |
| Alta | Rojo | Tareas urgentes |

## 🧪 Scripts Disponibles

```powershell
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🌐 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| VITE_API_URL | URL de la API TaskFlow | http://localhost:3000/api |

## 📦 Build para Producción

```powershell
# Generar build optimizado
npm run build

# Los archivos se generan en la carpeta /dist
```

## 🔧 Configuración de Proxy

El proyecto usa proxy de Vite para evitar CORS en desarrollo:

```javascript
// vite.config.js
server: {
  port: 3001,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

## 🎓 Componentes Reutilizables

### Button
```jsx
<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

### Input
```jsx
<Input 
  label="Email" 
  type="email" 
  error="Error message"
/>
```

### Modal
```jsx
<Modal isOpen={true} onClose={handleClose} title="Modal Title">
  Content here
</Modal>
```

### Card
```jsx
<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

## 🎯 Próximas Mejoras

- [ ] Vista Kanban con drag & drop
- [ ] Vista de calendario
- [ ] Estadísticas con gráficos
- [ ] Filtros avanzados
- [ ] Exportar tareas (PDF, CSV)
- [ ] Notificaciones push
- [ ] Modo offline con PWA
- [ ] Etiquetas personalizadas
- [ ] Subtareas

## 🐛 Troubleshooting

**Error de CORS:**
- Verifica que el backend esté corriendo
- Revisa la configuración de CORS en el backend
- Asegúrate que VITE_API_URL sea correcta

**Error 401 Unauthorized:**
- El token ha expirado, vuelve a iniciar sesión
- Verifica que el token se esté enviando correctamente

**Estilos no cargan:**
- Ejecuta `npm install` nuevamente
- Borra node_modules y reinstala

## 📄 Licencia

MIT

## 👨‍💻 Desarrollo

Desarrollado como parte del proyecto TaskFlow

---

**¡Disfruta usando TaskFlow!** 🎉
