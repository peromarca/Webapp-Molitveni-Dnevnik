# 🐳 Docker Setup - Molitveni Dnevnik

## Brzo pokretanje

```bash
# Pokreni sve servise (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Ili u pozadini
docker-compose up -d --build
```

## Servisi

- **Frontend (React)**: http://localhost:3000
- **Backend (Express API)**: http://localhost:3001  
- **PostgreSQL Database**: localhost:5432

## Osnovne komande

```bash
# Pokreni servise
docker-compose up

# Zaustavi servise
docker-compose down

# Zaustavi i obriši volumes (database data)
docker-compose down -v

# Vidi logove
docker-compose logs -f

# Vidi logove za određeni servis
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Rebuild i restart
docker-compose up --build

# Pristup PostgreSQL shell-u
docker-compose exec postgres psql -U postgres -d dnevnik
```

## Struktura projekta

```
MOLITVENI_DNEVNIK/
├── docker-compose.yml       # Glavni Docker config
├── backend/
│   ├── Dockerfile           # Backend Docker image
│   ├── .dockerignore
│   └── ...
└── frontend/
    ├── Dockerfile           # Frontend Docker image
    ├── .dockerignore
    └── ...
```

## Troubleshooting

**Port već zauzet:**
```bash
# Proveri koji proces koristi port
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# Ubij proces
taskkill /PID <process_id> /F
```

**Database nije spreman:**
- Pričekaj 10-20 sekundi nakon pokretanja
- Healthcheck će osigurati da backend čeka PostgreSQL

**Hot reload ne radi:**
- Volumes su konfigurisani za live reload
- Promjene u kodu automatski se primjenjuju
