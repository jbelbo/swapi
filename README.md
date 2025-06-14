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
git clone https://github.com/jbelbo/swapi
cd swapi
```

2. Create the SQLite database file:
```bash
touch backend/database/database.sqlite
```

3. Start the application using Docker Compose:
```bash
docker-compose up -d
```

4. Run the database migrations:
```bash
docker-compose exec backend php artisan migrate
```

5. Generate the application key:
```bash
docker-compose exec backend php artisan key:generate
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

## Development

To run the application in development mode:

1. Start the containers:
```bash
docker-compose up -d
```

2. The application uses volume mounts, so any changes to the code will be reflected immediately.

3. To view logs:
```bash
docker-compose logs -f
```

## Testing

To run the tests:

```bash
# Frontend tests
docker-compose exec frontend npm test

# Backend tests
docker-compose exec backend php artisan test
```

**Notes:**
- Backend tests use an in-memory SQLite database and automatically run all migrations before each test suite.
- If you encounter database errors, ensure the file `backend/database/database.sqlite` exists and has the correct permissions.
- If you see permission errors, you may need to run:
  ```bash
  sudo chown -R $USER:$USER backend/database backend/storage
  sudo chmod -R 775 backend/database backend/storage
  ``` 