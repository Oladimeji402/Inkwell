#!/usr/bin/env bash
# Render.com build script for Inkwell (Laravel + Inertia + React)
# Set this as the Build Command in your Render web service.
set -e

echo "==> Building frontend assets..."
npm run build

echo "==> Caching Laravel config + routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Linking storage..."
php artisan storage:link || true

echo "==> Build complete."
