# QuickStay – Full-Stack Hotel Booking Platform

> A modern, production-ready hotel booking platform built with the **MERN Stack**, featuring secure authentication with **Clerk**, role-based access control, real-time booking management, and a dedicated dashboard for hotel owners.

---

## 📖 Overview

**QuickStay** is a comprehensive hotel reservation platform designed for both **Guests** and **Hotel Owners**.

The application follows a modern **RESTful Client-Server Architecture**, where a React frontend communicates with a secure Express backend. Authentication is handled through **Clerk**, while MongoDB stores all application data including users, hotels, rooms, and bookings.

The platform provides a seamless booking experience for guests while enabling hotel owners to efficiently manage their properties through a dedicated dashboard.

---

# ✨ Features

## 👤 Guest Features

- Browse available hotels and rooms
- Secure authentication using Clerk
- View detailed room information
- Book rooms with date selection
- View booking history
- Responsive user interface
- Real-time room availability

---

## 🏨 Hotel Owner Features

- Dedicated Owner Dashboard
- Register as a Hotel Owner
- Add new hotels
- Add and manage rooms
- Upload room images
- Track bookings
- View dashboard statistics
- Manage hotel inventory

---

## 🔒 Authentication & Security

- Clerk Authentication Integration
- JWT-based request verification
- Protected API routes
- Role-based authorization
- Secure session management
- Server-side booking validation
- Secure local image uploads

---

## ⚙️ Booking Engine

- Prevents double bookings
- Date overlap validation
- Automatic pricing calculation
- Server-side price verification
- Booking history management

---

## 🔄 Dynamic Data Management

- React Context API
- Live API integration
- Loading states
- Centralized state management
- Real-time data fetching
- Eliminated legacy dummy data

---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User Interface |
| Vite | Fast Development & Build Tool |
| React Context API | Global State Management |
| Clerk React SDK | Authentication |
| Axios | API Requests |
| React Router DOM | Client-side Routing |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| Clerk Backend SDK | Token Verification |
| Multer | Image Upload Handling |
| JWT | Authentication |

---

## Database

- MongoDB
- Mongoose Models

Collections include:

- Users
- Hotels
- Rooms
- Bookings

---

# 🏗 System Architecture

```
                  +----------------------+
                  |      React Client    |
                  |       (Vite)         |
                  +----------+-----------+
                             |
                    REST API Requests
                             |
                 Authorization: Bearer Token
                             |
                             ▼
                 +--------------------------+
                 |     Express Server       |
                 |        Node.js           |
                 +-----------+--------------+
                             |
            +----------------+----------------+
            |                                 |
            ▼                                 ▼
     Clerk Authentication              MongoDB Database
     (JWT Verification)         Users • Hotels • Rooms • Bookings
                             |
                             ▼
                  Local File Storage
                  (/server/uploads)
```

---

# 📂 Project Structure

```
QuickStay/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── assets/
│   └── .env
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── uploads/
│   ├── seed/
│   └── .env
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Clerk Account
- npm

---

# 🔑 Environment Variables

## Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `CLERK_SECRET_KEY` | Clerk Secret Key |
| `CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `CLIENT_URL` | Frontend URL |

Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=hotel-booking

CLERK_SECRET_KEY=sk_test_xxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxx

CLIENT_URL=http://localhost:5173
```

---

## Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `VITE_BACKEND_URL` | Backend API URL |

Example:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxx
VITE_BACKEND_URL=http://localhost:5000
```

---

> **Important**
>
> Clerk authentication will return **401 Unauthorized** if the **Secret Key** and **Publishable Key** are not generated from the **same Clerk application**.

---

# ⚡ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/QuickStay.git

cd QuickStay
```

---

## 2️⃣ Backend Setup

```bash
cd server

npm install
```

Create your environment file.

```bash
cp .env.example .env
```

Fill in all required environment variables.

Seed the database:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

Open another terminal.

```bash
cd client

npm install

npm run dev
```

---

The application should now be running at:

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 👨‍💻 Usage

## Guest Workflow

1. Browse hotels from the homepage.
2. Sign in using Clerk.
3. Navigate to **Rooms**.
4. Select check-in and check-out dates.
5. Book a room.
6. View booking history under **My Bookings**.

---

## Hotel Owner Workflow

1. Login with Clerk.
2. Click **List Your Hotel**.
3. Complete owner registration.
4. Access the **Owner Dashboard**.
5. Add hotels and rooms.
6. Upload room images.
7. Track bookings and statistics.

---

# 📌 REST API Features

- User Authentication
- Hotel Management
- Room Management
- Booking Management
- Owner Dashboard APIs
- Image Upload APIs

---

# 🔥 Technical Highlights

### API Migration

Migrated completely from static dummy data (`assets.js`) to a fully functional Express API.

### Optimized State Management

- React Context API
- Loading states
- Centralized data fetching
- Improved user experience

### Booking Validation

- Date overlap checks
- Double-booking prevention
- Server-side price calculation

### Secure Image Uploads

- Local filesystem storage
- Multer integration
- Secure file handling

### Static Asset Optimization

Static assets like:

- Icons
- Testimonials
- Marketing content
- City data

remain isolated from database queries for improved performance.

---

# 🔒 Security

- Clerk Authentication
- JWT Verification
- Protected Routes
- Role-Based Authorization
- Server-side Validation
- Secure File Uploads
- Price Manipulation Prevention

---

# 📈 Future Improvements

- Online Payment Integration (Stripe/Razorpay)
- Email Notifications
- Hotel Reviews & Ratings
- Wishlist Feature
- Search & Filters
- Google Maps Integration
- Admin Dashboard
- Cloud Image Storage (Cloudinary/S3)
- Booking Cancellation & Refunds
- Availability Calendar

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/YourFeature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature/YourFeature
```


# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Anubhav**

Full Stack Developer | MERN Stack | C++ | DSA

---

## ⭐ If you found this project useful, consider giving it a star!
