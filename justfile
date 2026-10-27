set quiet
set dotenv-load := true

# Show this list
default:
    just --list


# ================ DOCKER ================ #

# Up database container
up-db:
    echo "[Docker] Starting database container..."
    docker compose up -d db > /dev/null 2>&1
    echo "[Docker] Database container started.\n"

# Down database container
down-db:
    echo "[Docker] Stopping database container..."
    docker compose down > /dev/null 2>&1
    echo "[Docker] Database container stopped.\n"

# Up database container and clean volume
up-db-clean:
    echo "[Docker] Starting database container with clean volume..."
    docker compose up -d db -V > /dev/null 2>&1
    echo "[Docker] Database container started with clean volume.\n"

# Down database container and remove volume
down-db-clean:
    echo "[Docker] Stopping database container and removing volume..."
    docker compose down -v > /dev/null 2>&1
    echo "[Docker] Database container stopped and volume removed.\n"


# ================ CLIENT ================ #

# Start frontend
frontend:
    echo "[Frontend] Frontend is running at http://localhost:4200/"
    echo "[Frontend] Press Ctrl+C to stop the frontend."
    cd frontend && npm start > /dev/null 2>&1

# Generate a new Angular component
generate-component location:
    echo "[Angular] Generating {{location}} component"
    cd frontend && npx ng generate component components/{{ location }} > /dev/null 2>&1
    echo "[Angular] Component {{location}} generated\n"


# ================ DJANGO ================ #

# Create migrations 
make-migrations:
    echo "[Django] Creating migrations..."
    cd backend && uv run python manage.py makemigrations > /dev/null 2>&1
    echo "[Django] Migrations created.\n"

# Apply migrations
migrate:
    echo "[Django] Applying migrations..."
    cd backend && uv run python manage.py migrate > /dev/null 2>&1
    echo "[Django] Migrations applied.\n"

# Start superuser creation
superuser:
    cd backend && uv run python manage.py createsuperuser

# Auto create superuser with variables defined in .env file
superuser-auto:
    echo "[Django] Creating superuser..."
    DJANGO_SUPERUSER_USERNAME="${DJANGO_SUPERUSER_USERNAME:-admin}" \
    DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD:-admin}" \
    DJANGO_SUPERUSER_EMAIL="${DJANGO_SUPERUSER_EMAIL:-admin@restaurant.local}" \
    cd backend && uv run python manage.py createsuperuser --no-input #> /dev/null 2>&1
    echo "[Django] Superuser created.\n"

# Start database container and server
server:
    just up-db
    echo "[Django] Server is running at http://localhost:8000/"
    echo "[Django] Press Ctrl+C to stop the server."
    cd backend && uv run python manage.py runserver 0.0.0.0:8000 > /dev/null 2>&1

# Reset database container and apply migrations
reset-db:
    just down-db-clean
    just up-db
    sleep 2
    just make-migrations
    just migrate
    # just superuser-auto

# Start server with clean database
server-clean: reset-db server