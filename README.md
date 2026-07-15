# Inkwell

A portfolio-grade blog platform built with **Laravel 13**, **Inertia.js**, and **React 19**.

**Live demo:** _your-app.onrender.com_  
**Built by:** [Bello Sulaimon](https://oladimejiportfolio.vercel.app/)

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

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, Fortify auth (2FA, passkeys) |
| Frontend | React 19, Inertia.js v3, Tailwind CSS v4 |
| UI components | shadcn/ui (Radix UI primitives) |
| Type-safe routes | Wayfinder |
| Database | MySQL |
| File storage | Laravel local disk (swappable to S3) |
| Email | EmailJS (client-side) |
| Hosting | Render.com |

---

## Local development

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Oladimeji402/inkwell.git
cd inkwell

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

# 7. Start both servers (in two terminals)
php artisan serve
npm run dev
```

Visit `http://localhost:8000`

Login with the seeded account: `test@example.com` / `password`

---

## EmailJS setup (contact form)

1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Add an **Email Service** (Gmail works — connect your `bellosulaimon177@gmail.com`)
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

6. Rebuild: `npm run build`

---

## Deploying to Render

### One-time setup

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render reads `render.yaml` automatically
4. It will create:
   - A **MySQL database** (`inkwell-db`)
   - A **Web service** (`inkwell`) wired to the database

### Manual environment variables

Set these in the Render dashboard (they're marked `sync: false` in `render.yaml`):

| Key | Value |
|---|---|
| `VITE_EMAILJS_SERVICE_ID` | From EmailJS dashboard |
| `VITE_EMAILJS_TEMPLATE_ID` | From EmailJS dashboard |
| `VITE_EMAILJS_PUBLIC_KEY` | From EmailJS dashboard |

### Build + start commands

These are already in `render.yaml` but for reference:

- **Build command:** `./render-build.sh`
- **Start command:** `php artisan serve --host 0.0.0.0 --port $PORT`

### Important notes

- Render's free tier **spins down** after 15 minutes of inactivity. First load will be slow (~30s). Upgrade to a paid plan for always-on.
- Uploaded files (avatars, cover images) are stored on the **local disk** which resets on every deploy. For persistent uploads, configure an **S3-compatible bucket** and set `FILESYSTEM_DISK=s3` with the AWS env vars.
- Run `php artisan wayfinder:generate` locally after adding new routes, then commit the generated files under `resources/js/actions` and `resources/js/routes`.

---

## Project structure

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
      welcome.tsx   Landing page
      about.tsx     About page
      contact.tsx   Contact page (EmailJS)
      blog/         index, show, create, edit, drafts
      profile/      show (public author profile)
      dashboard.tsx
      settings/     profile, security
      errors/       404
    layouts/
      public-layout.tsx   Nav + footer (public pages)
      app-layout.tsx      Sidebar shell (dashboard, settings)
    components/
      pagination.tsx      Reusable pagination component
```

---

## License

MIT — built by [Bello Sulaimon](https://oladimejiportfolio.vercel.app/)
