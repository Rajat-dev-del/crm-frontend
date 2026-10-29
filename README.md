# CRM Workspace frontend

Next.js frontend for the CRM signup and sign-in flow. Authentication requests go directly from the browser to the Express API in `../crm-backend`.

## Run locally

1. Start the backend from `../crm-backend` with `npm run dev`.
2. Keep your existing backend `.env` values. Add the Google client ID, client secret, callback URL, and frontend URL from `../crm-backend/.env.example`; do not overwrite your working database URL or JWT secret.
3. The backend URL is picked by environment from the committed `.env.development` (`http://localhost:4000`, used by `npm run dev`) and `.env.production` (`https://crm-backend-six-umber.vercel.app`, used by `npm run build` and Vercel). To point at another backend, set `NEXT_PUBLIC_API_URL` in `.env.local` or in Vercel's environment variables; those take precedence.
4. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_API_URL` is public frontend configuration. Never put database credentials or JWT secrets in a `NEXT_PUBLIC_` variable.

## Authentication flow

- Signup calls `POST /api/auth/register` with `fullName`, `email`, `password`, and optional `phone`.
- Login calls `POST /api/auth/login` with `email` and `password`.
- Google sign-in starts at `GET /api/auth/google`, uses the backend callback at `GET /api/auth/google/callback`, and returns to `/auth/callback` on the frontend.
- For local Google OAuth, configure `http://localhost:3000` as the authorized JavaScript origin and `http://localhost:4000/api/auth/google/callback` as the authorized redirect URI. For production, add `https://crm-frontend-rho-amber.vercel.app` and `https://crm-backend-six-umber.vercel.app/api/auth/google/callback`. Keep the Google client secret only in the backend `.env`.
- Both success responses provide a user and JWT. The auth provider keeps the session, the API layer supports Bearer authorization for later protected requests, and `/dashboard` displays the returned account details. Sign out clears the local session.

The token is currently stored in browser local storage to keep the user signed in after a refresh. For production, an HttpOnly, Secure, SameSite cookie managed by the backend is preferable.
