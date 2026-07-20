# Inkwell

A portfolio-grade blog platform for long-form writing — built with **Laravel 13**, **Inertia.js v3**, and **React 19**.

**Built by:** [Bello Sulaimon](https://oladimejiportfolio.vercel.app/)  
**Contact:** [bellosulaimon177@gmail.com](mailto:bellosulaimon177@gmail.com)  
**GitHub:** [github.com/Oladimeji402/Inkwell](https://github.com/Oladimeji402/Inkwell)  
**X:** [@bellosulai756](https://x.com/bellosulai756)

---

## Features

- Full blog CRUD — create, edit, publish/unpublish, delete posts with cover uploads
- Social layer — follow authors, like posts, comment on posts
- Public author profiles with avatar, bio, followers / following / likes
- Draft management with one-click publish
- Public landing, About, and Contact pages
- EmailJS-powered contact form
- Fortify auth with 2FA and passkeys
- Cloudinary media storage
- Dark mode, rate limiting, custom 404, pagination

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, Fortify (2FA, passkeys) |
| Frontend | React 19, Inertia.js v3, Tailwind CSS v4 |
| UI | shadcn/ui |
| Routes | Wayfinder |
| Database | MySQL |
| Media | Cloudinary |
| Contact | EmailJS |
| Hosting | Railway (Nixpacks) |

---

## Local Development

### Prerequisites

- PHP 8.4+
- Composer
- Node.js 20+
- MySQL 8+
- Cloudinary account (for covers / avatars)

### Setup

```bash
git clone https://github.com/Oladimeji402/Inkwell.git
cd Inkwell

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Edit `.env` with your local MySQL credentials and Cloudinary keys, then:

```bash
php artisan migrate --seed
php artisan storage:link

php artisan serve
npm run dev
```

Visit `http://localhost:8000`

Seeded demo login: `test@example.com` / `password`  
*(Local only — change or remove before a public production seed.)*

---

## EmailJS Setup (Contact Form)

1. Create an account at [emailjs.com](https://www.emailjs.com)
2. Add an email service and a template with: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
3. Put Service ID, Template ID, and Public Key in `.env` as `VITE_EMAILJS_*`
4. Run `npm run build` (or restart `npm run dev`)

On Railway, set the `VITE_EMAILJS_*` variables **before** the build — Vite embeds them at compile time.

---

## Deploying to Railway

Build/start default to Nixpacks via `nixpacks.toml` + `railway.toml`.

If your Railway service still has a custom **Build Command**, either:

- clear it (recommended), or
- keep `./render-build.sh` (compat script in the repo)

Do **not** leave Build Command pointing at a missing script.

### 1. Create the project

[railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select **Inkwell**.

### 2. Add MySQL

**New Service** → **Database** → **MySQL**.

### 3. Environment variables

On the web service → **Variables**:

```env
APP_NAME=Inkwell
APP_ENV=production
APP_DEBUG=false
APP_KEY=                        # php artisan key:generate --show
APP_URL=https://your-app.up.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=cloudinary
LOG_LEVEL=error

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_SECURE_URL=true

VITE_APP_NAME=Inkwell
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

### 4. Deploy

Push to `main` (or click Deploy). First build takes a few minutes. Then set `APP_URL` to the real Railway domain and redeploy if needed.

### Production content

Prefer publishing posts from the app (or a one-time seed with **rotated** passwords). Do not leave the local demo password on a public URL.

---

## Project Structure

```
app/Http/Controllers/Blog/     Posts, comments, likes, follows
app/Http/Controllers/Settings/ Profile, security
resources/js/pages/            Welcome, about, contact, blog, profile, dashboard, settings
resources/js/layouts/          Public shell + app sidebar
database/seeders/              Human demo content + cover generator
```

---

## License

MIT — built by [Bello Sulaimon](https://oladimejiportfolio.vercel.app/)
