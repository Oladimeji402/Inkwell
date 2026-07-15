# Inkwell

A portfolio-grade blog platform built with **Laravel 13**, **Inertia.js**, and **React 19**.

**Built by:** [Bello Sulaimon](https://oladimejiportfolio.vercel.app/)  
**Contact:** [bellosulaimon177@gmail.com](mailto:bellosulaimon177@gmail.com)  
**GitHub:** [github.com/Oladimeji402](https://github.com/Oladimeji402)  
**X:** [@bellosulai756](https://x.com/bellosulai756)

---

## Features

- Full blog CRUD — create, edit, publish/unpublish, delete posts with cover image upload
- Social layer — follow authors, like posts, comment on posts
- Public author profiles with avatar, bio, follower/following/total-likes stats
- Draft management with one-click publish
- Public landing page, About, and Contact pages
- EmailJS-powered contact form (no backend required)
- Dark mode support
- Rate limiting on all write actions
- Custom 404 page
- Proper pagination on all list pages

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, Fortify auth (2FA, passkeys) |
| Frontend | React 19, Inertia.js v3, Tailwind CSS v4 |
| UI components | shadcn/ui (Radix UI primitives) |
| Type-safe routes | Wayfinder |
| Database | MySQL |
| File storage | Laravel local disk |
| Email | EmailJS (client-side) |
| Hosting | Railway |

---

## Local Development

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Oladimeji402/Inkwell.git
cd Inkwell

# 2. Install dependencies
composer install
npm install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Edit .env — set your local DB credentials:
#    DB_DATABASE, DB_USERNAME, DB_PASSWORD

# 5. Run migrations + seed sample data
php artisan migrate --seed

# 6. Link storage for file uploads
php artisan storage:link

# 7. Start both servers (two separate terminals)
php artisan serve
npm run dev
```

Visit `http://localhost:8000`

Login with the seeded account: `test@example.com` / `password`

---

## EmailJS Setup (Contact Form)

1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Add an **Email Service** — connect your Gmail account
3. Create an **Email Template** with these variables:
   - `{{from_name}}` — sender's name
   - `{{from_email}}` — sender's email
   - `{{subject}}` — message subject
   - `{{message}}` — message body
4. Copy your **Service ID**, **Template ID**, and **Public Key**
5. Add them to `.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
```

6. Rebuild assets: `npm run build`

---

## Deploying to Railway

### 1. Create a new project

Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → select **Inkwell**.

### 2. Add a MySQL database

Inside your project → **New Service** → **Database** → **MySQL**.

### 3. Set environment variables

In your web service → **Variables** tab, add the following. Railway auto-fills the `${{MySQL.*}}` references from the database service you created.

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
FILESYSTEM_DISK=local
LOG_LEVEL=error

VITE_APP_NAME=Inkwell
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
```

### 4. Set build and start commands

In your web service → **Settings** tab:

- **Build Command:** `./render-build.sh`
- **Start Command:** `php artisan serve --host 0.0.0.0 --port $PORT`

### 5. Deploy

Click **Deploy**. Railway runs the build script which installs dependencies, compiles assets, caches config/routes, runs migrations, and links storage. First build takes ~3–5 minutes.

Once live, update `APP_URL` to your actual Railway domain.

### Note on file uploads

Uploaded avatars and cover images are stored on Railway's persistent disk — they survive redeploys unlike Render's ephemeral filesystem. For even more reliability, configure an S3-compatible bucket and set `FILESYSTEM_DISK=s3`.

---

## Project Structure

```
app/
  Http/
    Controllers/
      Blog/         PostController, CommentController, LikeController, FollowController
      Settings/     ProfileController, SecurityController
      DashboardController, PublicProfileController, WelcomeController
  Models/           User, Post, Comment, Like, Follow
resources/
  js/
    pages/
      welcome.tsx        Landing page
      about.tsx          About page
      contact.tsx        Contact page (EmailJS)
      blog/              index, show, create, edit, drafts
      profile/           show (public author profile)
      dashboard.tsx
      settings/          profile, security
      errors/            404
    layouts/
      public-layout.tsx  Sticky nav + footer (public pages)
      app-layout.tsx     Sidebar shell (dashboard, settings)
    components/
      pagination.tsx     Reusable pagination component
```

---

## License

MIT — built by [Bello Sulaimon](https://oladimejiportfolio.vercel.app/)
