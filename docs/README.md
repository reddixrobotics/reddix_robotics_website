# Reddix Robotics 🤖

Welcome to the official repository for the **Reddix Robotics** web platform. This project consists of a modern public-facing website and a secure, feature-rich Admin Dashboard for managing portfolio projects, employees, workshops, and shop orders.

---

## 🏗️ Architecture & Tech Stack

This project is built using a decoupled modern web architecture: a React Single Page Application (SPA) communicating with a NestJS REST API.

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **3D Rendering:** Three.js / React Three Fiber
- **Icons:** Lucide React
- **Media:** React Easy Crop (WhatsApp-style image editor)

### Backend
- **Framework:** NestJS 11 (Node.js)
- **Language:** TypeScript
- **ORM:** Prisma
- **Security:** Helmet, Throttler (Rate Limiting), JWT (JSON Web Tokens), Argon2 (Password Hashing)
- **Payment Gateway:** Razorpay
- **Email Service:** Nodemailer
- **Media Storage:** Cloudinary

### Database & Caching
- **Primary Database:** PostgreSQL
- **Caching & Sessions:** Redis (via `ioredis`)

---

## 📂 Project Structure

```text
raddix_website/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth, etc.)
│   │   ├── features/         # Domain-specific modules (admin, home, shop, etc.)
│   │   ├── pages/            # Page-level components matching routes
│   │   ├── routes/           # Routing configuration
│   │   └── services/         # API client configurations
│   └── package.json
│
└── backend/                  # NestJS API
    ├── prisma/               # Database schemas & migrations
    ├── src/
    │   ├── auth/             # Authentication guards & logic
    │   ├── featured-projects/# API modules for entities
    │   ├── products/
    │   ├── ...               # Other domain modules
    │   └── main.ts           # Backend entry point
    └── package.json
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
Make sure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (running locally or a cloud URL)
- **Redis** (running locally on port 6379)

### 1. Environment Variables Setup

You must create a `.env` file in **both** the frontend and backend directories. *(Note: These files are git-ignored to protect secrets).*

**`backend/.env`**
```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database & Cache
DATABASE_URL="postgresql://user:password@localhost:5432/reddix?schema=public"
REDIS_URL="redis://localhost:6379"

# Security
JWT_SECRET="your-super-secret-jwt-key"

# Integrations
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
RAZORPAY_KEY_ID="your_razorpay_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
```

### 2. Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install

# Generate Prisma Client and apply database schema
npx prisma generate
npx prisma db push

# Start the NestJS development server
npm run start:dev
```
*The backend will now be running on `http://localhost:3000`.*

### 3. Start the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
*The frontend will now be running on `http://localhost:5173`.*

---

## 🛠️ Key Features
*   **Public Site:** Landing pages, 3D interactive elements, product shop, and project portfolios.
*   **Admin Dashboard:** Protected by JWT authentication and Role-Based Access Control (RBAC).
*   **Intelligent Image Cropper:** Built-in WhatsApp-style cropper in the admin panel to strictly enforce image aspect ratios prior to Cloudinary upload.
*   **Secure API:** Helmet-protected headers and Redis-backed rate limiting to prevent brute-force attacks.

## 📦 Deployment Overview
This stack is perfectly suited for modern PaaS platforms:
- **Frontend** compiles down to static HTML/CSS/JS (`npm run build`) and can be hosted on **Vercel** or **Netlify**.
- **Backend** can be deployed as a Web Service on **Railway.app** or **Render**, alongside managed Postgres and Redis instances.
