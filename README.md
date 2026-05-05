# ADSUM - Sistema de Gestió d'Assistència
ADSUM és una aplicació per a la gestió d'assistència en temps real mitjançant codis QR i geolocalització.
.
## 🚀 Guia d'Inici Ràpid

### Requisits Previs
- **Node.js** (v18 o superior)
- **Docker** (per a la base de dades MySQL)

### Instal·lació

1. **Base de Dades**:
    ```bash
    docker-compose up -d
    ```

2. **Backend (NestJS)**:
    ```bash
    cd backend
    npm install
    npm run start:dev
    ```

3. **Frontend (Vue/Vite)**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Usuaris de Prova
Pots utilitzar el sistema de *seeding* per generar usuaris de prova:
`POST http://localhost:3000/api/seed`

## 🐳 Despliegue en Producción

Para desplegar en entorno de producción, utiliza el archivo `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Configuración de Secrets
El sistema de producción utiliza Docker secrets para manejar credenciales sensibles:

1. Crea el directorio `secrets` si no existe
2. Coloca los archivos:
   - `secrets/db_root_password.txt` - Contraseña root de MySQL
   - `secrets/db_password.txt` - Contraseña del usuario de base de datos

**IMPORTANTE**: Nunca confirmes estos archivos en el repositorio. El `.gitignore` ya los excluye.

## 🔐 Seguridad

- Los servicios innecesarios (como phpMyAdmin) están comentados en `docker-compose.yml` para desarrollo
- En producción, la base de datos no expone puertos directamente al host
- Las credenciales se manejan mediante variables de entorno y Docker secrets
- Se han implementado roles básicos: admin, profesor, alumno y familia

## 📝 Logging Estructurado

El backend incluye logging estructurado mediante Winston que registra:
- Eventos de login (éxitos y fallos)
- Registro de asistencias
- Errores críticos

Los logs se almacenan en archivos (`logs/error.log` y `logs/combined.log`) y en consola en desarrollo.

## 🛠️ Tecnologies
- **Backend**: NestJS, TypeORM, Socket.io
- **Frontend**: Vue 3, Vite, Tailwind CSS
- **DB**: MySQL