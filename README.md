# Helping Hands — MERN

Helping Hands is a JavaScript-only MERN application that connects free item donations with community-reviewed needs.

## Requirements

- Node.js 20+
- MongoDB running locally or a MongoDB Atlas connection

## Setup

1. Install all workspace dependencies:

   ```bash
   npm install
   ```

2. Create `server/.env` from `server/.env.example` and replace `JWT_SECRET` with a long random value.
3. Optionally create `client/.env` from `client/.env.example` when the API is not running at `http://localhost:8000/api`.

## Run

Start both apps:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

The React app runs at `http://localhost:5173` and the Express API at `http://localhost:8000`.

## Authentication API

- `POST /api/auth/register` — `{ name, email, password, role }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/auth/me` — bearer token required
- `GET /api/dashboard` — bearer token required
- `GET /api/needs` — public verified needs
- `GET/PATCH /api/auth/me` — view or update the signed-in profile
- `GET /api/needs/mine` — the signed-in user's help requests
- `POST /api/needs` — submit a help request for verification
- `PATCH/DELETE /api/needs/:id` — edit or cancel an owned request
- `GET /api/donations` — offers made by the signed-in user
- `GET /api/donations/received` — offers received for the user's requests
- `POST /api/donations` — offer help for a verified need
- `GET /api/notifications` — private account notifications
- `GET /api/needs/verification-queue` — admin verification queue
- `PATCH /api/needs/:id/review` — admin approval or rejection
- `GET /api/admin/*` — admin-only platform management and reports

Passwords are hashed with bcrypt and never returned. JWTs expire after seven days. Normal registration permits donor, requester, and community roles; admin accounts must be assigned outside public registration.

## Test register and login

1. Start MongoDB and both applications.
2. Open `http://localhost:5173/register`, select a role, and create an account.
3. Confirm that the browser opens the protected dashboard.
4. Select Logout, open `/login`, and sign in with the same email and password.
5. Confirm that the dashboard loads again.

The home page intentionally shows an empty state until verified needs are stored in MongoDB.

## Application routes

Public visitors can use `/`, `/home`, `/how-it-works`, `/verified-needs`, `/about`, `/safety`, `/privacy`, `/login`, and `/register`.

Signed-in users can use `/dashboard`, `/profile`, `/available-needs`, `/notifications`, and `/settings`. Requesters and community representatives can use `/my-requests` to submit and track needs. Donors can use `/my-donations` to track their offers and contributions.

Community representative accounts can submit and track community needs. Admin accounts can use `/admin`, `/admin/users`, `/admin/requests`, `/admin/verifications`, and `/admin/reports`. Public registration cannot create admin accounts.

## Workflow

1. A requester or community representative submits a help request. It starts as `Pending Verification`.
2. An admin approves or rejects it. Only approved requests become public.
3. A donor offers an item for an approved request.
4. The requester accepts or declines the offer.
5. The helper coordinates the handover and marks it complete. Completed quantities update the request automatically.

Only approximate locations are shown in request and offer screens. Passwords, exact addresses, and private contact details are not included in public need responses.
