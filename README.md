# Scalable Auth + Task API

Full-stack app with a **Node.js / Express** REST API and a **React (Vite)** client. The backend is suitable to host on **GitHub** with this README as the single entry point for setup, endpoints, and deployment notes.

| Platform | URL |
|----------|-----|
| **Frontend (production)** | [Live Frontend](https://scalable-auth-crud-api.vercel.app/) |
| **Backend (production)** | [Live Backend](https://scalable-auth-crud-api.onrender.com) |
| **API Documentation (Postman)** | [View Docs](https://documenter.getpostman.com/view/43708069/2sBXqCPPoN) |
| **GitHub repository** | [GitHub Repo](https://github.com/sathvik89/scalable-auth-crud-api) |

Local defaults: API `http://localhost:5001`, health check `http://localhost:5001/`.

---

## Features

- JWT authentication (register / login)
- Role-based access (`admin` / `user`) encoded in the token
- Task CRUD APIs scoped to the authenticated user
- Protected task routes and protected UI routes in the React app

---

## Tech stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend:** React, Vite, React Router, Ant Design

---

## Project layout

```
backend/    # Express API
frontend/   # Vite + React SPA
```

---

## Setup

### Prerequisites

- Node.js
- MongoDB instance and connection string

## Clone the Repository

```bash
git clone https://github.com/sathvik89/scalable-auth-crud-api.git
cd scalable-auth-crud-api
```

### Backend

1. `cd backend`
2. `npm install`
3. Create a `.env` file in `backend/` (see [Environment variables](#environment-variables))
4. `npm run dev` — server uses `PORT` from env or **5001** by default

Optional demo data (creates demo users and tasks; see `backend/scripts/seed.js`):

```bash
npm run seed
```

### Frontend

1. `cd frontend`
2. `npm install`
3. Create `frontend/.env` with `VITE_API_BASE_URL` pointing at your API base (see [Environment variables](#environment-variables))
4. `npm run dev` — default Vite dev URL is shown in the terminal (often `http://localhost:5173`)

Production build: `npm run build`, then serve the `dist/` folder with your host.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs |
| `PORT` | No | HTTP port (default **5001**) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Base URL for the API, including `/api/v1` (example: `http://localhost:5001/api/v1`) |

---

## API endpoints

Base path: `/api/v1`. JSON request/response bodies unless noted.

### Health

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/` | No — returns API status |

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/register` | Create account |
| `POST` | `/api/v1/auth/login` | Obtain JWT |

### Tasks

All task routes require a valid JWT.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/tasks` | List current user’s tasks |
| `POST` | `/api/v1/tasks` | Create task |
| `PUT` | `/api/v1/tasks/:id` | Update task |
| `DELETE` | `/api/v1/tasks/:id` | Delete task |

---

## JWT usage

Send the token on every protected request:

```http
Authorization: Bearer <token>
```

Use the `token` field from the `POST /api/v1/auth/login` response. Registration does not return a JWT; sign in after registering.

---

## Scripts reference

| Location | Command | Purpose |
|----------|---------|---------|
| `backend` | `npm run dev` | Development server (nodemon) |
| `backend` | `npm start` | Production-style run (`node server.js`) |
| `backend` | `npm run seed` | Seed demo users and tasks |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production build |
