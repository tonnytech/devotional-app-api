#!/bin/sh
set -e

echo "Running pending migrations..."
npx prisma migrate deploy

echo "Starting app..."
exec node server.js