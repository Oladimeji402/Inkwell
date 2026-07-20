#!/usr/bin/env bash
set -euo pipefail

# Railway may still call this legacy build command.
# Railpack often prunes npm devDependencies before build — reinstall so Vite is available.
npm ci
npm run build

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link || true
