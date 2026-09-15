# 🚀 Barkeeper Client

A modern, high-performance frontend template built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Designed for speed, scalability, and a premium developer experience.

## ✨ Key Features

- **App Router** - Latest Next.js features and patterns.
- **Dark Mode** - Built-in theme support with zero-flash implementation
- **Strict Linting** - Pre-configured ESLint, Prettier, and Husky
- **Optimized UI** - Minimal, black & white focused design system

---

## 📂 Project Structure

```text
├── 📁 app/             # Application routes & layouts
├── 📁 components/      # UI & shared components
│   ├── 📁 ui/          # Atomic components (buttons, inputs)
│   └── 📁 providers/   # Context & high-level providers
├── 📁 hooks/           # Custom React hooks
├── 📁 lib/             # Utilities (cn, formatting, API, env validation)
├── 📁 public/          # Static assets (images, fonts)
├── 📁 types/           # Global TypeScript definitions
└── proxy.ts            # Server-side route protection (Next.js 16's renamed
                         # "middleware" convention)
```

---

## 🛠️ Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment Variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values — see [Environment Variables](#-environment-variables)
   below. `lib/env.ts` validates these at startup and fails fast with a clear
   error if anything required is missing.

3. **Run Development Server:**

   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables

All variables are documented in `.env.example` and validated by `lib/env.ts`.

| Variable               | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Base URL of the backend API this app talks to (no trailing slash).      |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL of this site, used for `robots.txt`/`sitemap.xml`. |

Both are `NEXT_PUBLIC_*`, meaning they're bundled into client-side JS —
never put secrets behind a `NEXT_PUBLIC_` name. Server-only secrets belong in
`.env.local` too, but should be read directly via `process.env` in
server-only code rather than through `lib/env.ts`.

---

## 🔑 Auth Contract

`components/providers/AuthProvider.tsx` and `lib/axios.ts` implement a
frontend-only half of a token-refresh flow; the other half is a contract your
backend must honor:

- The **access token** is returned in the login/refresh response body and is
  kept only in memory on the client (never in a cookie or `localStorage`) —
  see the comment block at the top of `lib/axios.ts`.
- The **refresh token** must be set by the backend as an
  `httpOnly; Secure; SameSite=Strict` cookie on the login and
  `/auth/refresh-token` responses. The frontend never reads or writes this
  cookie directly — it relies on `withCredentials: true` to send it
  automatically.
- `/auth/refresh-token` must read the refresh token from that cookie (not
  the request body), rotate it, and respond with
  `{ data: { accessToken, user } }`.
- `/auth/logout` must clear the httpOnly cookie server-side.
- If the API is on a different origin than the frontend, CORS must allow
  credentials (`Access-Control-Allow-Credentials: true` with an explicit,
  non-wildcard `Access-Control-Allow-Origin`).

`proxy.ts` adds server-side route protection on top of this by checking for
the refresh-token cookie's presence before a protected page is even served —
see the comment in that file for its same-origin/shared-domain requirement.

---

## 🎨 Theme Configuration

Colors are centralized in `app/globals.css` using CSS variables for both light and dark modes. Use Tailwind classes like `bg-primary`, `border-border`, or `text-foreground` to maintain consistency.

---

_Built with ❤️ for rapid development._
!
