# Reddix Robotics 🤖

Welcome to the **Reddix Robotics** monorepo. This project powers the frontend and serverless backend infrastructure for the Reddix Robotics application.

## 🏗️ Architecture

The application is built on a modern, fully serverless stack leveraging Supabase. The legacy NestJS/Prisma/Railway backend has been permanently decommissioned.

### Frontend
- **React 18**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Three.js / React Three Fiber** (For 3D Robot Models and Hero Animations)

### Backend (Supabase Native)
- **Supabase Auth**: Manages users, sessions, and roles.
- **Supabase PostgreSQL**: Serverless database for products, users, applications, and orders.
- **Row Level Security (RLS)**: Enforces all access controls and tenant isolation natively in the database.
- **Supabase Storage**: Hosts `public-media` (images) and `application-documents` (private resumes via signed URLs).
- **Supabase Edge Functions**: Deno-based serverless functions for third-party integrations and secure operations.

### Integrations (Edge Functions)
All external service interactions are securely processed via Supabase Edge Functions:
- **Razorpay**: Order creation and payment verification.
- **Shiprocket**: Logistics and shipment generation.
- **Resend**: Transactional emails.

## 🔐 Authentication & Roles

The system uses **Supabase Auth** natively. 

### Multi-Factor Authentication
Admin users are required to configure and use **native Supabase TOTP MFA**. The frontend challenges any user with admin privileges to enroll or verify their TOTP token.

### RBAC (`app_metadata.role`)
Roles are injected directly into the user's JWT (`app_metadata.role`) to drive both Frontend UI rendering and Database RLS policies. The supported roles are:
- `SUPER_ADMIN`
- `ADMIN`
- `CONTENT_MANAGER`
- `ORDER_MANAGER`
- `CAREER_MANAGER`
- `USER` (Default)

> **⚠️ CRITICAL SECURITY RULE:** Frontend code must NEVER contain Supabase service-role keys or third-party secret credentials (e.g. Razorpay, Shiprocket, or Resend API keys). These secrets MUST ONLY live in the Edge Functions environment variables on the Supabase Dashboard.

## 📂 Project Structure

```
.
├── frontend/             # Vercel Deployment Root (React/Vite Application)
├── supabase/             # Supabase Configuration & Edge Functions
│   ├── functions/        # Deno Edge Functions (Razorpay, Shiprocket, Resend, etc.)
│   ├── migrations/       # Local database migrations
│   └── config.toml       # Local Supabase configuration
├── docs/                 # General project documentation
│   └── legacy-backend/   # Historical documentation from the NestJS decommissioning
```

*(Note: `docs/legacy-backend/` contains historical migration documentation only. It has no runtime effect on the application.)*

## 🚀 Development & Deployment

### Local Frontend Development
The frontend application lives entirely within the `frontend/` directory. Vercel is configured to build directly from this folder.

```bash
cd frontend
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
Builds the output to `frontend/dist/`. Type-checking is strictly enforced during builds.

### Supabase Edge Functions Development
```bash
npx supabase start
npx supabase functions serve
```

## 🧹 Legacy Extracted Directories
You may notice historically extracted directories in the repository root (e.g., `extracted_update_patch_v4`, `extracted_raddix_website`, `production`). These are **not used** by the current runtime application and are candidates for future cleanup. The single source of truth for the codebase is `frontend/` and `supabase/`.
