# Hotel Booking API (server)

Express + MongoDB (Mongoose) backend for the QuickStay hotel booking React app.
Auth is verified against Clerk (the same provider the React app already uses),
so no separate login system needed to be built.

## Folder structure

```
server/
├── config/
│   └── db.js               # Mongoose connection
├── models/
│   ├── User.js              # keyed by Clerk user id
│   ├── Hotel.js
│   ├── Room.js
│   └── Booking.js
├── middleware/
│   ├── auth.js               # Clerk token verification + user upsert
│   └── errorHandler.js
├── controllers/
│   ├── hotelController.js
│   ├── roomController.js
│   ├── bookingController.js
│   └── userController.js
├── routes/
│   ├── hotelRoutes.js
│   ├── roomRoutes.js
│   ├── bookingRoutes.js
│   └── userRoutes.js
├── seed/
│   ├── seedData.js           # 20 hotels, 2-4 rooms each, demo users
│   └── seed.js               # run with `npm run seed`
├── server.js                 # app entry point
├── package.json
└── .env.example
```

## 1. Install

```bash
cd server
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — e.g. `mongodb://127.0.0.1:27017` for local Mongo, or your Atlas connection string (without a trailing db name — `DB_NAME` is appended for you).
- `CLERK_SECRET_KEY` — from your Clerk dashboard (API Keys). Must be the **same Clerk project** the React app's `VITE_CLERK_PUBLISHABLE_KEY` belongs to, or token verification will fail.
- `CLIENT_URL` — where your React dev server runs (defaults to `http://localhost:5173`).

## 3. Seed the database

```bash
npm run seed
```

This wipes the `User`, `Hotel`, `Room`, and `Booking` collections and inserts:
- 20 hotels across 15 cities (New York, Dubai, Singapore, London, Paris, Tokyo, Rome, Barcelona, Sydney, Bali, Bangkok, Amsterdam, Toronto)
- 2-4 rooms per hotel with randomized room type, price, amenities and images (~50-60 rooms total)
- 3 demo hotel-owner user records + 1 demo traveler
- A few sample bookings for the demo traveler

## 4. Run the server

```bash
npm run dev      # nodemon, auto-restart
# or
npm start
```

Server boots on `http://localhost:5000` (or `PORT` from `.env`).

## API Reference

All responses are JSON: `{ success: boolean, ...data }` on success, `{ success: false, message }` on error.

### Hotels
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/hotels?city=&search=` | Public | List hotels, optional city/text filter |
| GET | `/api/hotels/cities` | Public | Distinct list of cities with hotels |
| GET | `/api/hotels/:id` | Public | Hotel details + its available rooms |
| GET | `/api/hotels/owner/me` | Auth | The logged-in owner's hotel (or `null`) |
| POST | `/api/hotels` | Auth | Register a hotel; promotes user to `hotelOwner` |

### Rooms
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/rooms?city=&search=&roomType=&amenities=&minPrice=&maxPrice=&sort=` | Public | Filterable room listing (AllRooms page) |
| GET | `/api/rooms/:id` | Public | Room details (RoomDetails page) |
| GET | `/api/rooms/owner/mine` | Auth (owner) | Rooms for the logged-in owner's hotel |
| POST | `/api/rooms` | Auth (owner) | Add a room to the owner's hotel |
| PATCH | `/api/rooms/:id` | Auth (owner) | Update a room |
| DELETE | `/api/rooms/:id` | Auth (owner) | Delete a room |

### Bookings
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings` | Auth | Create a booking (price computed server-side, overlap-checked) |
| GET | `/api/bookings/user` | Auth | Logged-in user's bookings (MyBookings page) |
| GET | `/api/bookings/hotel` | Auth (owner) | Owner's bookings + dashboard totals |
| PATCH | `/api/bookings/:id/pay` | Auth | Mark a booking paid (Pay Now button) |

### Users
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | Auth | Local profile (role, recent searches) |
| POST | `/api/users/recent-searches` | Auth | Add a city to recent search history |

## Auth model

The React app already uses `@clerk/react`. Any authenticated request sends
`Authorization: Bearer <clerk session token>`. `middleware/auth.js` verifies
that token with `@clerk/backend`, and on first sight of a given Clerk user
creates a matching row in our own `User` collection (role defaults to
`"user"`; becomes `"hotelOwner"` the moment they register a hotel).
