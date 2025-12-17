# 🙏 Molitveni Dnevnik

Full-stack aplikacija za upravljanje molitvenim zapisima.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router
- Context API (user state)

**Backend:**
- Node.js + Express
- PostgreSQL
- bcrypt (password hashing)
- express-session (authentication)

## 🚀 Pokretanje (Lokalno)

### 1. PostgreSQL
```bash
# Kreiraj bazu:
CREATE DATABASE dnevnik;
CREATE TABLE DnevnikUser (
   idnum SERIAL PRIMARY KEY,
   username VARCHAR(100),
   email VARCHAR(100) UNIQUE,
   hashpass VARCHAR(255)
);
```

### 2. Backend
```bash
cd backend
npm install
node main.js
# Runs on http://localhost:3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## 🐳 Pokretanje (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

## 📁 Struktura

```
MOLITVENI_DNEVNIK/
├── backend/
│   ├── main.js              # Express server
│   └── routes/
│       └── api.routes.js    # API endpoints
├── frontend/
│   └── src/
│       ├── components/      # React komponente
│       └── context/         # UserContext (global state)
└── docker-compose.yml
```

## 🔑 API Endpoints

```
POST   /register         # Registracija
POST   /login            # Login (kreira session)
POST   /logout           # Logout (briše session)
GET    /check-session    # Provjera aktivne sesije
GET    /users?email=...  # Dohvati user podatke
```

## 🔐 Autentifikacija

- **Session-based** sa cookies
- **bcrypt** za password hashing
- **Context API** za frontend user state

## 📝 Features

✅ Registracija/Login  
✅ Session management  
✅ Protected routes  
✅ Responsive design  
⏳ CRUD za molitvene zapise (u izradi)

## 🔧 Environment Variables

```env
# Backend
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=oblak333
DB_NAME=dnevnik
DB_PORT=5432
```

---

**Autor:** Petar  
**Verzija:** 1.0.0