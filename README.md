# Star Wars Search Application

This application allows users to search for Star Wars characters and movies using the SWAPI (Star Wars API). It includes both a React frontend and a Laravel backend.

## Features

- Search for Star Wars characters and movies
- View detailed information about characters and movies
- Search statistics tracking and reporting
- Auto-updating statistics every 5 minutes

## Requirements

- Docker
- Docker Compose

## Setup and Running

1. Clone the repository:
```bash
git clone https://github.com/jbelbo/swapi && cd swapi
```

2. Create the SQLite database file:
```bash
touch backend/database/database.sqlite
```

3. Copy the environment files:
```bash
cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env
```

4. Build and start the application:
```bash
docker compose up -d
```

5. Install PHP dependencies
```bash
docker compose exec backend composer install
```

6. Run the database migrations:
```bash
docker compose exec backend php artisan migrate
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## API Endpoints

- `POST /api/v1/search` - Search for people or movies
- `GET /api/v1/people/{id}` - Get person details
- `GET /api/v1/films/{id}` - Get movie details
- `GET /api/v1/statistics` - Get search statistics

## Architecture

- Frontend: React with TypeScript
- Backend: Laravel 12
- Database: SQLite
- Container: Docker

## Troubleshooting

### Missing Vendor Directory
If you see an error about missing vendor/autoload.php, rebuild the containers:
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
docker compose exec backend composer install
```

### Permission Issues
If you encounter permission issues with storage or cache directories:
```bash
docker compose exec backend chmod -R 775 storage bootstrap/cache
```

### Container Issues
If you need to rebuild the containers:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Development

To run the application in development mode:

1. Start the containers:
```bash
docker compose up -d
```

2. The application uses volume mounts, so any changes to the code will be reflected immediately.

3. To view logs:
```bash
docker compose logs -f
```