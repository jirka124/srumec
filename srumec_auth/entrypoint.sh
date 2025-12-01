#!/bin/sh

set -e

echo "Waiting for database to be ready..."
python -c "
import socket
import time
while True:
    try:
        with socket.create_connection(('auth-postgres', 5432), timeout=5):
            break
    except OSError:
        time.sleep(1)
"
echo "Database is ready."

# databázové migrace
echo "Running database migrations..."
alembic upgrade head
echo "Migrations finished."

exec "$@"
