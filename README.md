# Meditation Mood Tracker 🌸

Una aplicación web para rastrear el impacto de la meditación en el estado de ánimo, diseñada para estudios globales sobre los beneficios de la meditación.

## ✨ Características

- **Registro de Sentimientos**: Sistema de calificación de 1-10 para sentimientos antes y después de meditar
- **Dashboard Personal**: Gráficas y estadísticas del progreso individual
- **Panel de Administración**: Gestión de sentimientos, usuarios y analytics globales
- **Estudio Global**: Análisis por país, idioma y región
- **Sistema de Tracking**: Log de todas las actividades de los usuarios
- **Diseño Responsive**: Interfaz moderna con colores pasteles y animaciones
- **Multiidioma**: Soporte para español e inglés
- **Autenticación Segura**: Sistema de login con UserID y JWT

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Gráficas**: Recharts
- **Base de Datos**: MySQL con Prisma ORM
- **Autenticación**: JWT con bcryptjs
- **Estilos**: Tailwind CSS + CSS Modules
- **Formularios**: React Hook Form + Zod
- **Internacionalización**: next-intl

## 📋 Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jhogarcia111/meditation-mood-tracker.git
cd meditation-mood-tracker
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="mysql://username:password@localhost:3306/meditation_tracker"

# JWT
JWT_SECRET="tu-super-secret-jwt-key-cambia-esto-en-produccion"

# NextAuth (opcional)
NEXTAUTH_SECRET="tu-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email (opcional, para notificaciones)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-password-de-aplicacion"
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push

# (Opcional) Abrir Prisma Studio para ver los datos
npm run db:studio
```

### 5. Inicializar datos base

```bash
# Ejecutar el script de inicialización
npx tsx scripts/init-data.ts
```

### 6. Ejecutar el proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Credenciales por Defecto

- **Usuario Admin**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@meditation-tracker.com`

## 🎯 Funcionalidades Principales

### Para Usuarios
1. **Registro/Login**: Sistema de autenticación con UserID
2. **Dashboard Personal**: Visualización del progreso individual
3. **Registro de Sentimientos**: Formulario con stepper para calificar sentimientos
4. **Gráficas de Progreso**: Análisis visual del impacto de la meditación
5. **Perfil de Usuario**: Gestión de información personal

### Para Administradores
1. **Gestión de Sentimientos**: Agregar, editar y eliminar sentimientos
2. **Gestión de Usuarios**: Ver usuarios y sus estadísticas
3. **Analytics Global**: Análisis por país, idioma y región
4. **Sistema de Logs**: Tracking de todas las actividades
5. **Exportación de Datos**: Descarga de datos para análisis

## 🎨 Personalización

### Colores
Los colores principales están definidos en `tailwind.config.js`:

```javascript
colors: {
  primary: '#A8D5E2',    // Azul pastel
  secondary: '#B8E6B8',  // Verde menta
  accent: '#E6E6FA',     // Lavanda
  background: '#FDFDFD', // Blanco crema
}
```

### Sentimientos
Los sentimientos se pueden gestionar desde el panel de administración o modificando `utils/constants.ts`.

## 📊 Analytics y Reportes

La aplicación incluye:

- **Estadísticas por Usuario**: Promedios antes/después, mejora porcentual
- **Análisis Global**: Distribución por países, idiomas, tendencias temporales
- **Sistema de Logs**: Tracking completo de actividades
- **Gráficas Interactivas**: Visualizaciones con Recharts

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar base de datos
npm run db:studio    # Abrir Prisma Studio
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otros Hostings

1. **Build del proyecto**:
   ```bash
   npm run build
   ```

2. **Configurar base de datos MySQL** en tu hosting

3. **Configurar variables de entorno** en el panel de control

4. **Subir archivos** y ejecutar:
   ```bash
   npm start
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisar la documentación
2. Buscar en los issues existentes
3. Crear un nuevo issue con detalles del problema

## 🗺️ Roadmap

- [ ] Notificaciones push
- [ ] App móvil (React Native)
- [ ] Integración con wearables
- [ ] Machine Learning para predicciones
- [ ] Más tipos de meditación
- [ ] Sistema de recordatorios
- [ ] Exportación a PDF
- [ ] API pública para investigadores

---

**Desarrollado con ❤️ para el estudio global de meditación**

**Autor**: [jhogarcia111](https://github.com/jhogarcia111)
