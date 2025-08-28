# 🚀 Instrucciones de Deploy - Mi Brújula Emocional

## 📁 Archivos Preparados
- **mibrujulaemocional-deploy.zip** (23.8 MB) - Contiene toda la aplicación

## 🔧 Pasos para Deploy en cPanel

### 1. **Subir Archivos**
1. Ve a **File Manager** en cPanel
2. Navega a la carpeta de tu subdominio: `public_html/mibrujulaemocional/`
3. Sube el archivo `mibrujulaemocional-deploy.zip`
4. Extrae el ZIP en esa carpeta

### 2. **Configurar Base de Datos**
1. Ve a **MySQL Databases** en cPanel
2. Crea una nueva base de datos: `mibrujulaemocional_db`
3. Crea un usuario de base de datos
4. Asigna el usuario a la base de datos con todos los privilegios

### 3. **Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto con:

```env
DATABASE_URL="mysql://excelpar_mibrujula_user:KZ&^NTAJUtQ$@localhost/excelpar_mibrujulaemocional_db"
JWT_SECRET="tu-secreto-jwt-super-seguro-aqui"
NEXTAUTH_SECRET="tu-secreto-nextauth-super-seguro-aqui"
NODE_ENV="production"
```

### 4. **Instalar Dependencias y Configurar BD**
En **Terminal** de cPanel o SSH:

```bash
cd public_html/mibrujulaemocional/
npm install
npx prisma generate
npx prisma db push
npm run build
```

### 5. **Configurar Node.js App**
1. Ve a **Node.js Apps** en cPanel
2. Crea una nueva aplicación:
   - **Node.js version**: 18.x o superior
   - **Application mode**: Production
   - **Application root**: `public_html/mibrujulaemocional/`
   - **Application URL**: `mibrujulaemocional.excelparaejecutivos.net`
   - **Application startup file**: `server.js` (se creará automáticamente)
   - **Passenger port**: Dejar en blanco

### 6. **Crear archivo server.js**
Crea un archivo `server.js` en la raíz:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

### 7. **Configurar Dominio**
1. Ve a **Domains** en cPanel
2. Asegúrate de que `mibrujulaemocional.excelparaejecutivos.net` apunte a la carpeta correcta

### 8. **Inicializar Datos**
Ejecuta en terminal:

```bash
node scripts/init-data.js
node scripts/init-meditation-data.js
```

## 🔍 Verificación
1. Visita `https://mibrujulaemocional.excelparaejecutivos.net`
2. Verifica que la aplicación cargue correctamente
3. Prueba el registro de usuarios
4. Verifica que la base de datos funcione

## 🆘 Solución de Problemas

### Error de Base de Datos
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos esté creada

### Error de Puerto
- Verifica que el puerto en Node.js Apps esté configurado correctamente
- Revisa los logs en cPanel

### Error de Build
- Asegúrate de tener Node.js 18+ instalado
- Verifica que todas las dependencias estén instaladas

## 📞 Soporte
Si tienes problemas, revisa:
1. Logs de error en cPanel
2. Configuración de la base de datos
3. Variables de entorno
4. Permisos de archivos
