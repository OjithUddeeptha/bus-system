# Bus.lk - National Bus System Management Platform
### 🚀 System Startup Guide

Follow these steps to successfully run the full-stack application (Database, Backend, and Frontend).

---

## 🏗️ 1. Start the Database and Infrastructure
Ensure you have **Docker Desktop** installed and running.
```bash
# Start Postgres and Redis containers in detached mode
docker-compose up -d
```
- **Postgres Port**: 5432 (mapped to local)
- **Redis Port**: 6379

---

## 🛠️ 2. Start the Backend (NestJS)
This handles the API, authentication, file uploads, and live tracking logic.

Open a new terminal:
```bash
cd apps/backend

# 1. Install dependencies (only if new packages were added)
npm install

# 2. Sync Database Schema
npx prisma generate

# 3. Start the Development Server
npm run start:dev
```
✅ **Success Indicator**: You should see `[NestApplication] Nest application successfully started` in the logs.
- **API URL**: `http://localhost:3002`
- **Uploads Directory**: `apps/backend/uploads/` (Automatically created)

---

## 🎨 3. Start the Frontend (Next.js)
The modern user interface for Passengers and Operators.

Open a new terminal:
```bash
cd apps/frontend

# 1. Install dependencies
npm install

# 2. Start the Development Server
npm run dev
```
✅ **Access the App**: Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

## ✨ New Features (Jan 2026 Update)
- **👤 Profile Management**: 
  - Full **Edit Profile** functionality (Name, Phone).
  - **Photo Upload**: Click your avatar to upload a profile picture.
- **🧭 Modern Navigation**: 
  - Floating, glassmorphic bottom navigation bar for a premium mobile app feel.
- **📅 Dates & Schedule**: 
  - New Calendar view to manage upcoming trips.
- **⚡ Performance**: 
  - Instant page navigation (Client-side caching).
  - Gzip compression enabled for faster data load.

---

## ❓ Troubleshooting

### 🛑 "Port 3002 is already in use" (EADDRINUSE)
If the backend fails to start, an old process might be stuck. Run this command to kill it:
```powershell
# Check what's running on port 3002
netstat -ano | findstr :3002

# Kill the process (Replace PID with the number from above)
taskkill /F /PID <PID>
```

### 🖼️ "Images not loading"
Ensure the backend is running. Images are served statically from `http://localhost:3002/uploads/`.
- If the `uploads` folder is missing, the backend will auto-create it on first upload.

### 🔌 Database Connection Error
- Ensure Docker is running (`docker ps`).
- If schema changes aren't reflected, run `npx prisma generate` in `apps/backend`.
