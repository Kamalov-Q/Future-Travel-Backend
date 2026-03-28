# Future Travel Backend

A robust backend REST API for the "Future Travel" platform, built with [NestJS](https://nestjs.com/). It handles tour management, public/admin interactions, comment moderation, and integrates with CDN for media storage.

## 🚀 Key Features
- **JWT Authentication** for admin endpoints (custom roles & auth).
- **Tours Management:** Public endpoints for listing/details; Admin endpoints for CRUD operations.
- **Comments & Moderation:** Public submission for tours with an admin approval/rejection flow.
- **Media Uploads:** Image uploads to [Bunny.net CDN](https://bunny.net/) handled asynchronously via [BullMQ](https://docs.nestjs.com/techniques/queues) and Redis.
- **PostgreSQL Database** with TypeORM for robust data management.
- **Swagger UI** for complete and interactive API documentation (Basic Auth protected).

---

## 🛠 Tech Stack

- **Framework:** NestJS (Node.js/TypeScript)
- **Database:** PostgreSQL (with TypeORM)
- **Message Queue:** BullMQ & Redis (for background jobs like image processing/upload)
- **Authentication:** Passport, JWT, Express Basic Auth
- **Storage/CDN:** Bunny.net

---

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for local DB and Redis setup)
- A [Bunny.net](https://bunny.net/) account (for CDN & storage)

---

## 📦 Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd future_travel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 🔧 Configuration

Create a `.env` file in the root directory and configure your environment variables. You can use the following template:

```env
# Application
PORT=3000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=8080
DB_USERNAME=kamal
DB_PASSWORD=kamalov1029
DB_NAME=future_travel

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Initial Admin Credentials (auto-seeded on startup if not present)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
ADMIN_NAME=Super Admin

# Bunny.net CDN Configuration
BUNNY_STORAGE_ZONE_NAME=future-travel
BUNNY_STORAGE_API_KEY=your_bunny_storage_api_key
BUNNY_CDN_HOSTNAME=storage.b-cdn.net
BUNNY_STORAGE_REGION=storage.bunnycdn.com
# Optional alternative:
# BUNNY_STORAGE_HOST=storage.bunnycdn.com

# Redis Configuration (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Swagger Auth
SWAGGER_USERNAME=FutureTravelPass
SWAGGER_PASSWORD=change_me
```

---

## 🐳 Docker Setup (Local dependencies)

If you don't have PostgreSQL and Redis installed locally, you can spin them up using the provided `docker-compose.yml`:

```bash
docker compose up -d
```
*Note: Make sure your `.env` DB and Redis ports match the ones exposed by Docker.*

---

## ▶️ Running the Application

**Development mode:**
```bash
npm run dev
# or 
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:<PORT>/api`

---

## 📖 API Documentation (Swagger)

The project includes automatically generated API documentation using Swagger UI.
It is protected via HTTP Basic Authentication.

- **URL:** `http://localhost:<PORT>/api/docs`
- **Credentials:** Use `SWAGGER_USERNAME` and `SWAGGER_PASSWORD` from your `.env` file.

### Key API Modules
- **Auth:** `POST /api/auth/login`
- **Tours (Public):** `GET /api/tours`, `GET /api/tours/:id`
- **Tours (Admin):** `POST /api/tours/admin`, `PUT /api/tours/admin/:id`, `DELETE /api/tours/admin/:id`
- **Comments:** `POST /api/comments` (Public submission), Admin endpoints under `/api/comments/admin/...`
- **Upload:** `POST /api/upload/image` (Requires Auth, uses `multipart/form-data` with `file` key)

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 💡 Troubleshooting

**Bunny CDN Uploads:**
If the image upload endpoint returns a valid CDN URL, but accessing it returns a `401 Unauthorized` error, your Bunny.net Pull Zone is likely restricted. Ensure that edge/origin pull is allowed publicly in your Bunny.net dashboard settings.

---

## 📝 Scripts Reference

- `npm run dev` - Start the application in watch mode.
- `npm run build` - Build the application for production.
- `npm run lint` - Run ESLint.
- `npm run format` - Format code with Prettier.

---

*Built with [NestJS](https://nestjs.com/).*
