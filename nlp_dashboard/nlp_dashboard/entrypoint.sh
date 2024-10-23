#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    # Wait for PostgreSQL to be available
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Apply migrations without flushing the database
python manage.py migrate

# Execute the command passed as arguments
exec "$@"