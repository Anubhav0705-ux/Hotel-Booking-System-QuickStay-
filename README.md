# QuickStay — Hotel Booking (MERN)

Full-stack hotel booking app: React (Vite) frontend + Express/MongoDB backend,
with Clerk for authentication.

```
project/
├── client/     # your existing React frontend (now wired to the API)
└── server/     # new Express + MongoDB backend
```

## Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)
- A Clerk application (free tier is fine) — https://dashboard.clerk.com

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017      # or your Atlas URI
DB_NAME=hotel-booking
CLERK_SECRET_KEY=sk_test_...               # same Clerk project as the frontend
CLERK_PUBLISHABLE_KEY=pk_test_...
CLIENT_URL=http://localhost:5173
```

> **Important:** `CLERK_SECRET_KEY` must belong to the *same* Clerk application
> as `VITE_CLERK_PUBLISHABLE_KEY` in `client/.env`, otherwise token
> verification will always fail with 401s.

Seed the database with 20 hotels / ~50-60 rooms / demo users:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

You should see:
```
MongoDB connected -> hotel-booking
Server listening on http://localhost:5000
```

## 2. Frontend setup

```bash
cd client
npm install
```

`client/.env` already has (added for you):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...     # was already there
VITE_BACKEND_URL=http://localhost:5000     # newly added
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 3. Try it out

1. Browse hotels on the homepage / "Hotels" page — this data now comes from MongoDB via the seed script.
2. Sign in with Clerk (top-right "Login").
3. Click **List Your Hotel** in the navbar → fill out the form → you're now a hotel owner and land on `/owner`.
4. Add a room with real uploaded images (**Add Room**) — files are stored under `server/uploads/rooms` and served at `http://localhost:5000/uploads/...`.
5. Browse to `/rooms`, open a room, pick check-in/out dates, and book it.
6. Check `/my-bookings` to see it, and `/owner` (Dashboard) to see it show up in the owner's stats.

## What changed vs. the original frontend

- All data that used to come from `src/assets/assets.js` (`hotelDummyData`, `roomsDummyData`, `userDummyData`, `userBookingsDummyData`, `dashboardDummyData`) is now fetched from the API through a new `src/context/AppContext.jsx`.
- `assets.js` still exports icons, `cities` (used as a fallback in the destination datalist / hotel-registration city dropdown), `exclusiveOffers`, `testimonials`, `facilityIcons`, and `roomCommonData` — these are presentational/marketing content, not booking data, so they're left as-is.
- Every page that previously read dummy arrays directly now has a loading state and calls the API: `Home` → `FeaturedDestination`, `AllRooms`, `RoomDetails`, `MyBookings`, `HotelReg`, and the owner pages `Dashboard`, `AddRoom`, `ListRoom`.
- Booking price and date-overlap checks are computed **server-side** — the client sends `roomId`, dates, and guest count, and the server rejects overlapping bookings and computes `totalPrice` itself.
- Auth: the frontend already used `@clerk/react`; the backend now verifies the same Clerk session token (`Authorization: Bearer <token>`) via `@clerk/backend`, and auto-creates/looks up a matching local `User` document.

See `server/README.md` for the full API reference.
