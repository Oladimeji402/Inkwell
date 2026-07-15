#!/usr/bin/env bash
# Render.com build script for Inkwell (Laravel + Inertia + React)
# Set this as the Build Command in your Render web service.
set -e

echo "==> Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Installing Node dependencies..."
npm ci

echo "==> Building frontend assets..."
npm run build

echo "==> Caching Laravel config + routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Linking storage..."
php artisan storage:link

echo "==> Build complete."
