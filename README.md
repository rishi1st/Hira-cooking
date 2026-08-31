# Shubh Bhoj Catering — Full-Stack MERN Application

A production-ready website and admin panel for an Indian wedding & event
catering business, built with MongoDB, Express, React and Node (MERN).

## What's included

- **Customer website** — bilingual (Hindi/English), premium wedding-themed
  design, browsable food menu with categories, multi-select ordering flow,
  and a WhatsApp enquiry system that generates a Hindi message by default.
- **Admin panel** — secure JWT-based login, full food CRUD (with Cloudinary
  image/video upload), category management, and site settings (WhatsApp
  number, business name, tagline).
- **REST API** — clean Express/Mongoose backend with validation, auth
  middleware, centralized error handling and rate limiting.

## Project structure

```
/server            Express + MongoDB API
  /config           DB & Cloudinary configuration
  /controllers      Route handlers (business logic)
  /middleware       Auth, error handling, file upload
  /models           Mongoose schemas (Food, Category, Admin, Settings)
  /routes           REST endpoints
  /seed             Sample data + seed script
  server.js

/client             React (Vite) frontend
  /src
    /components       Reusable UI (FoodCard, EnquiryForm, Navbar, ...)
    /components/admin Admin-only layout & route guard
    /pages             Route-level pages (Home, Admin* pages)
    /context           Language, Selection (cart) and Auth state
    /services          Axios API client
    /i18n              Hindi/English translation dictionary
    /utils             WhatsApp message builder
```

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env     # fill in MongoDB URI, JWT secret, Cloudinary keys
npm install
npm run seed              # creates sample categories, foods, admin login, settings
npm run dev                # starts API on http://localhost:5000
```

Default seeded admin login (change these in `.env` before seeding):
- Email: `admin@shubhbhoj.com`
- Password: `ChangeThisPassword123!`

> The seed script uses placeholder images (via placehold.co) so the site is
> demo-ready immediately. Replace them with real photos from the Admin Panel
> once Cloudinary is configured.

### 2. Frontend

```bash
cd client
cp .env.example .env      # set VITE_API_URL if not using the Vite proxy
npm install
npm run dev                 # starts the site on http://localhost:5173
```

Visit `http://localhost:5173` for the customer site and
`http://localhost:5173/admin/login` for the admin panel.

### 3. Cloudinary (image/video storage)

Food images and videos are uploaded directly to Cloudinary — large media
files are never stored in MongoDB, only their secure URLs. Create a free
Cloudinary account, then set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`
and `CLOUDINARY_API_SECRET` in `server/.env`.

## Key flows

**Customer:** Browse menu → select dishes (counter stays visible while
browsing) → fill in name, mobile, address and **number of people** (the most
prominent field, since catering quantity depends on it) → tap **"व्हाट्सऐप पर
पूछताछ भेजें" / "Send Enquiry on WhatsApp"** → WhatsApp opens with a
pre-filled Hindi message containing all details and the selected dishes.

**Admin:** Log in → manage categories → add/edit food items with Hindi name,
English name, description, category, image and optional video → update the
business WhatsApp number and site settings — all reflected on the live site
immediately.

## Security notes

- Passwords are hashed with bcrypt; never stored in plaintext.
- Admin routes are protected by JWT middleware (`Authorization: Bearer`).
- Inputs are sanitized against NoSQL injection (`express-mongo-sanitize`).
- `helmet` sets secure HTTP headers; CORS is restricted to `CLIENT_URL`.
- The WhatsApp business number lives in the database (Settings) and env
  fallback — it is never hardcoded in the frontend.
