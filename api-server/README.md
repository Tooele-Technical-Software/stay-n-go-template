# Stay N Go API Server

Express + TypeScript API for users, listings, and bookings. Configured for PostgreSQL locally or Amazon RDS, but disabled by default until you connect a database.

## Quick start

**Install dependencies first** (required before any other API commands):

```bash
cd api-server
npm install
```

Then create your environment file and start the server:

```bash
cp .env.example .env   # if .env.example exists; otherwise create .env manually
npm run dev
```

The server starts on `http://localhost:4000` with `DB_ENABLED=false`. Routes return `503` until a database is configured.

## Enable PostgreSQL / Amazon RDS

1. Run `npm install` in `api-server/` if you have not already
2. Copy `.env.example` to `.env` (or create `.env` manually — see the root `README.md`)
3. Set `DB_ENABLED=true`
4. Configure either:
   - **RDS (recommended):** `DATABASE_URL` pointing at your RDS endpoint, plus `DB_SSL=true`
   - **Local Postgres:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
5. Run migrations:

```bash
npm run db:migrate
```

### RDS example

```env
DB_ENABLED=true
DATABASE_URL=postgresql://admin:password@stay-n-go.xxxxx.us-east-1.rds.amazonaws.com:5432/stay_n_go
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=your-long-random-secret
```

## API endpoints

### Users (`/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users/signup` | No | Register a new account |
| POST | `/users/login` | No | Login and receive JWT |

### Listings (`/listings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/listings` | No | Browse all active listings |
| GET | `/listings/:id` | No | Get a single listing |
| GET | `/listings/mine` | Yes | Get listings you host |
| POST | `/listings` | Yes | List a new place |

### Bookings (`/bookings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/bookings` | Yes | Your bookings |
| GET | `/bookings/:id` | Yes | Single booking |
| POST | `/bookings` | Yes | Book a listing |

Pass JWT as `Authorization: Bearer <token>`.

## Example requests

**Sign up**
```json
POST /users/signup
{
  "email": "guest@example.com",
  "password": "securepass",
  "name": "Jane Guest"
}
```

**Create listing**
```json
POST /listings
{
  "title": "Cozy Downtown Apartment",
  "description": "Bright 1-bedroom near the city center.",
  "city": "Austin",
  "country": "USA",
  "price_per_night": 120,
  "max_guests": 2,
  "bedrooms": 1,
  "bathrooms": 1
}
```

**Book a listing**
```json
POST /bookings
{
  "listing_id": "uuid-here",
  "check_in": "2026-07-01",
  "check_out": "2026-07-05"
}
```
