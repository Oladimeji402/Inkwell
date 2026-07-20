#!/usr/bin/env bash
set -euo pipefail

# Prefer clearing Railway "Build Command" so nixpacks.toml runs instead.
# This script remains as a fallback if the dashboard still calls ./render-build.sh.

npm ci
npm run build

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link || true
