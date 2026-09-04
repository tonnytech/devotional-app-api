#!/bin/sh
set -e

echo "Running pending migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Starting app..."
exec node server.js