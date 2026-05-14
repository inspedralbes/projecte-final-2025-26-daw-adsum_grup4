# 🎓 ADSUM - Sistema de Gestió d'Assistència Intel·ligent

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-42B883?style=for-the-badge&logo=vue.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

ADSUM és una solució tecnològica d'avantguarda dissenyada per digitalitzar i optimitzar el control d'assistència en centres educatius. Utilitzant una combinació de **codis QR dinàmics** i **geolocalització**, el sistema garanteix que el fitxatge sigui real, instantani i segur.

## ✨ Característiques Principals

- **🔐 Autenticació Segura**: Gestió de sessions mitjançant JWT i control d'accés basat en rols (RBAC) per a Administr ladors, Professors, Alumnes i Famílies.
- **📱 Hub Digital de l'Alumne**: Interfaci interactiva ("Orbital Hub") per al fitxatge ràpid, consulta de rendiment i accés a recursos.
- **⚡ Fitxatge en Temps Real**: Implementació de WebSockets (Socket.io) per a una sincronització instantània entre el professor i els alumnes.
- **📊 Analítica de Rendiment**: Calculadora de notes intel·ligent i traçabilitat de ratxes d'assistència per motivar l'alumne.
- **🛠️ Gestió Docent**: Eines per al professor per generar codis de classe, gestionar llistes d'alumnes i crear grups aleatoris automàticament.
- **🛡️ Seguretat i Auditoria**: Sistema de logs estructurats amb Winston per registrar cada moviment crític i seguretat basada en Docker Secrets.

## 🏗️ Arquitectura Tècnica

El projecte segueix una arquitectura desacoblada de **Frontend i Backend** per garantir l'escalabilitat i el manteniment:

### Backend (NestJS)
- **Framework**: NestJS (Node.js) amb arquitectura modular.
- **Persistència**: MySQL amb TypeORM per a la gestió de l'esquema i migracions.
- **Comunicació**: REST API per a dades estructurades i WebSockets per a la comunicació bidireccional en temps real.
- **Seguretat**: Passport.js per a la validació de tokens JWT i guards per a la protecció de rutes segons el rol.

### Frontend (Vue 3)
- **Framework**: Vue 3 amb Vite per a un desenvolupament ultra-ràpid.
- **Estils**: Tailwind CSS per a un disseny responsive, modern i amb focus en l'accessibilitat (WCAG 2.1).
- **Estat**: Gestió reactiva de la interfície per a una experiència d'usuari fluida (SPA).

---

## 🚀 Guia d'Inici Ràpid

### Requisits Previs
- **Node.js** (v18 o superior)
- **Docker** i **Docker Compose**

### Instal·lació i Desenvolupament

1. **Llançar Base de Dades**:
   ```bash
   docker-compose up -d
   ```

2. **Configurar i iniciar el Backend**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Configurar i iniciar el Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 🧪 Usuaris de Prova
Per accelerar el desenvolupament, pots poblar la base de dades amb dades simulades:
`POST http://localhost:3000/api/seed`

---

## 🐳 Despliegue en Producción

Per a un entorn de producció, utilitzem la configuració optimitzada `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 🔒 Gestió de Secrets
El sistema utilitza **Docker Secrets** per evitar l'exposició de credencials en el codi:
1. Crea el directori `secrets/` a la arrel del projecte.
2. Crea els fitxers `db_root_password.txt` i `db_password.txt`.
3. El sistema carregarà aquests valors automàticament durant l'arrencada del contenidor.

---

## 📖 Documentació de l'API (Resum)

| Endpoint | Mètode | Descripció | Accés |
| :--- | :---: | :--- | :---: |
| `/auth/login` | `POST` | Autenticació i generació de token JWT | Públic |
| `/attendance/generate` | `POST` | Genera un codi QR dinàmic per a una sessió | Professor |
| `/attendance/register` | `POST` | Registra l'assistència de l'alumne | Alumne |
| `/api/usuaris/stats` | `GET` | Obté les mètriques de rendiment i assistència | Alumne/Prof |
| `/api/usuaris/modul/:id/students`| `GET` | Llista d'alumnes assignats a un mòdul | Professor |

---

## 👥 Equip de Desenvolupament

| Membre | Rol | Responsabilitats |
| :--- | :---: | :--- |
| **Andreia López** | Fullstack Lead | Arquitectura, Frontend (Vue), Implementació WCAG |
| **[Nom Membre 2]** | Backend Dev | API Design, DB Schema, TypeORM |
| **[Nom Membre 3]** | DevOps/Security | Docker, CI/CD, Security Auditing |
| **[Nom Membre 4]** | QA/Docs | Testing, Documentation, UX Design |
