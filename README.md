# Stay N Go

A full-stack Airbnb-style booking app built with **Next.js** (frontend) and **Express + PostgreSQL** (API server). Browse listings, host your own place, manage trips, and complete demo checkout.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/) (for the API database)
- [Git](https://git-scm.com/downloads)

---

## 1. Download the app

> **Important:** Use the **`broken`** branch for this project. A normal `git clone` checks out **`main`** by default — that is not the refactor exercise version. Follow the steps below.

The **`broken`** branch contains intentional junior-level code patterns for refactoring practice. See [`FIXME.md`](FIXME.md) for what to fix and how to run unit tests.

### Clone the `broken` branch (recommended)

Clone and check out `broken` in one step:

```bash
git clone -b broken <your-repo-url>
cd stay-n-go-airbnb
```

Confirm you are on the right branch:

```bash
git branch --show-current
```

You should see `broken`.

### If you already cloned `main` by mistake

Switch to `broken` and pull the latest:

```bash
cd stay-n-go-airbnb
git fetch origin
git checkout broken
git pull origin broken
```

### Optional — clean `main` branch

Only use `main` if you want the non-exercise version of the app:

```bash
git clone -b main <your-repo-url>
cd stay-n-go-airbnb
```

---

## 2. Install modules

This project has two separate `package.json` files — one for the Next.js frontend and one for the API server. Install dependencies in both.

### Frontend (Next.js)

From the project root:

```bash
npm install
```

### API server

```bash
cd api-server
npm install
cd ..
```

---

## 3. App routes

The frontend runs at `http://localhost:3000` by default.

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/explore` | Browse active listings with filters |
| `/login` | Sign up or log in |
| `/dashboard` | User dashboard (requires login) |
| `/dashboard?tab=profile` | Edit profile, email, password, and theme |
| `/dashboard?tab=trips` | View upcoming and past trips |
| `/dashboard?tab=hosting` | Manage your listings (draft / active toggle) |
| `/host` | Create a new listing |
| `/host/[id]` | Edit one of your listings |
| `/listings/[id]` | Listing detail page with booking card |
| `/listings/[id]/checkout` | Confirm and pay (demo payment) |

**Checkout query parameters**

| Parameter | Example | Description |
|-----------|---------|-------------|
| `check_in` | `2026-07-01` | Check-in date (`YYYY-MM-DD`) |
| `check_out` | `2026-07-05` | Check-out date (`YYYY-MM-DD`) |
| `guests` | `2` | Number of guests |

Example:

```
/listings/abc-123/checkout?check_in=2026-07-01&check_out=2026-07-05&guests=2
```

**Optional frontend environment variable**

Create a `.env.local` file in the project root if you need to point at a non-default API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 4. API server setup

The API server lives in the `api-server/` folder and runs at `http://localhost:4000` by default.

### Step 1 — Install API dependencies

From the project root, open the `api-server` folder and install packages. **You must run this before starting the server or running database commands.**

```bash
cd api-server
npm install
```

### Step 2 — Create environment file

Inside `api-server/`, create a `.env` file:

```env
PORT=4000
NODE_ENV=development

# Enable the database (required for auth, listings, and bookings)
DB_ENABLED=true

# Local PostgreSQL (use one of these approaches)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stay_n_go
DB_USER=postgres
DB_PASSWORD=your_password

# Or use a single connection string (e.g. Amazon RDS)
# DATABASE_URL=postgresql://user:password@host:5432/stay_n_go
# DB_SSL=true

JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Step 3 — Create the database

With PostgreSQL running:

```bash
cd api-server
npm run db:create
```

### Step 4 — Run migrations

```bash
npm run db:migrate
```

### Step 5 — (Optional) Seed sample data

```bash
npm run db:seed
```

### Step 6 — Start the API server

```bash
npm run dev
```

You should see:

```
Stay N Go API running on http://localhost:4000
```

**Health check:** `GET http://localhost:4000/health`

> **Note:** If `DB_ENABLED=false`, the server will start but API routes return `503` until a database is configured.

---

## 5. API routes

Base URL: `http://localhost:4000`

Authenticated routes require a JWT in the header:

```
Authorization: Bearer <token>
```

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Server and database status |

### Users (`/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users/signup` | No | Register a new account |
| POST | `/users/login` | No | Log in and receive a JWT |
| GET | `/users/me` | Yes | Get current user profile |
| PATCH | `/users/me` | Yes | Update name or email |
| PATCH | `/users/me/password` | Yes | Change password |

### Listings (`/listings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/listings` | No | Browse all active listings |
| GET | `/listings/:id` | No | Get a single active listing |
| GET | `/listings/mine` | Yes | Get listings you host |
| GET | `/listings/mine/:id` | Yes | Get one of your listings (including drafts) |
| POST | `/listings` | Yes | Create a new listing |
| PATCH | `/listings/:id` | Yes | Update a listing you own |
| PATCH | `/listings/:id/status` | Yes | Toggle draft / active (`{ "is_active": true \| false }`) |

### Bookings (`/bookings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/bookings` | Yes | List your bookings |
| GET | `/bookings/:id` | Yes | Get a single booking |
| POST | `/bookings` | Yes | Create a booking (demo payment on the frontend) |

**Example — sign up**

```json
POST /users/signup
{
  "email": "guest@example.com",
  "password": "securepass",
  "name": "Jane Guest"
}
```

**Example — create a home listing**

```json
POST /listings
{
  "title": "Cozy Downtown Apartment",
  "description": "Bright 1-bedroom near the city center.",
  "city": "Austin",
  "country": "USA",
  "address": "123 Main St",
  "zip_code": "78701",
  "home_type": "apartment",
  "price_per_night": 120,
  "max_guests": 2,
  "bedrooms": 1,
  "bathrooms": 1,
  "listing_type": "homes",
  "category": "homes"
}
```

**Example — book a listing**

```json
POST /bookings
{
  "listing_id": "uuid-here",
  "check_in": "2026-07-01",
  "check_out": "2026-07-05"
}
```

---

## 6. Run the full app locally

Open two terminals:

**Terminal 1 — API server**

```bash
cd api-server
npm install   # first time only — installs API dependencies
npm run dev
```

**Terminal 2 — Frontend**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo checkout test card:** `4242 4242 4242 4242` with any future expiry and any CVC.

---

## Project structure

```
stay-n-go-airbnb/
├── src/                    # Next.js frontend (pages, components, lib)
├── api-server/
│   ├── src/
│   │   ├── routes/         # Express route handlers
│   │   ├── db/migrations/  # SQL migrations
│   │   └── config/         # Database and env config
│   └── package.json
├── package.json
└── README.md
```

---

## Issues

We will add to this later.
