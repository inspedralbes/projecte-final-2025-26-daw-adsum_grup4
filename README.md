# ADSUM - Sistema de Gestió d'Assistència

ADSUM és una aplicació per a la gestió d'assistència en temps real mitjançant codis QR i geolocalització.

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

## 🛠️ Tecnologies
- **Backend**: NestJS, TypeORM, Socket.io
- **Frontend**: Vue 3, Vite, Tailwind CSS
- **DB**: MySQL