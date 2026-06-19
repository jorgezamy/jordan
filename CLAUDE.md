# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (accessible from LAN at 192.168.1.28:3000)
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server
```

No test suite is configured.

## Architecture

This is a Next.js 16 (App Router) + TypeScript project for **Centro Cristiano Jordán**, a Christian church. The site is in a "coming soon" state with one active feature: prayer requests (peticiones de oración).

### Firebase integration

`firebaseConfig.js` (root level, not inside `src/`) initializes Firebase on import. It:
- Connects to Firestore with persistent local cache enabled
- Exports `db` (Firestore) and `auth` (Firebase Auth)
- Signs in anonymously via `onAuthStateChanged` only if no user session is already persisted (prevents overriding a logged-in email/password session)

Import `db` and `auth` from `../../../firebaseConfig` (path relative to component location).

Firebase credentials are loaded from `NEXT_PUBLIC_FIREBASE_*` environment variables (needs a `.env.local` file).

**Required Firebase console settings:**
- Firestore: enabled with appropriate rules
- Authentication: enable **Email/Password** provider and **Anonymous** provider

### Authentication system

Auth state is managed globally via React Context in `src/context/AuthContext.tsx`.

- `AuthProvider` wraps the entire app in `layout.tsx`
- `useAuth()` hook exposes: `user`, `loading`, `login()`, `register()`, `logout()`
- `user` is `null` for anonymous/unauthenticated users; only populated for registered (email/password) users
- `onAuthStateChanged` filters out anonymous users (`u.isAnonymous`) so `user` only reflects real registered accounts

**Registration is invite-only:** the register form requires a secret word (`12345`) before creating the account. This is validated client-side only — it is not enforced in Firebase rules.

**Login modal** lives in `src/components/auth/AuthModal.tsx`:
- Two tabs: "Iniciar sesión" (login) and "Registrarse" (register)
- Register tab fields: email, password, confirm password, secret word
- All password fields use a shared `PasswordInput` component with an eye toggle (show/hide), each field has independent visibility state
- Triggered from the header; closes on success or backdrop click

After logout, the user is automatically signed back in anonymously so Firestore access continues.

### Peticiones (Prayer Requests) feature

The core feature lives entirely in `src/components/peticiones/peticiones.tsx` as a single `"use client"` component. It:

- Reads/writes to the Firestore `peticiones` collection (last 50, ordered by `fechaCreacion` desc)
- Uses a realtime `onSnapshot` listener — no manual refresh needed
- Filters visibility client-side by state: `pendiente` = always visible, `resuelto` = visible for 1 month, `eliminada` = visible for 2 weeks
- Admin actions (mark resolved / delete) are **only visible to logged-in registered users** (`user !== null`)
- Before executing an admin action, an inline confirmation UI replaces the action buttons within the card — no `window.confirm()` used

The `Peticion` document shape:
```ts
{
  nombre: string,
  texto: string,           // HTML from TipTap
  estado: "pendiente" | "resuelto" | "eliminada",
  fechaCreacion: Timestamp,
  fechaResuelta?: Timestamp,
  fechaEliminada?: Timestamp,
  telefono?: string,       // optional, for pastor follow-up only
  correo?: string,         // optional, for pastor follow-up only
}
```

`telefono` and `correo` are filled in the form by anyone (public form), but **only saved to Firestore when non-empty** (conditional spread). They are only displayed in the card list to logged-in users (`user !== null`) — never exposed to public visitors.

### Header (`src/components/header/page.tsx`)

Responsive header designed for a non-tech-savvy audience:

- **"Peticiones" pill button** — always visible on all screen sizes (white pill, high contrast). It's the primary CTA and must never be hidden behind a menu.
- **Auth is admin-only** — regular visitors never need to log in. Auth controls are de-emphasized accordingly:
  - Desktop (not logged in): white text + white border button (`border-white/70`), no background fill, hover adds `bg-white/10`
  - Desktop (logged in): same avatar circle as mobile — click opens an absolute-positioned dropdown popover (`bg-[#002535] rounded-xl shadow-2xl`)
  - Mobile (not logged in): lock icon (`🔒` SVG) — recognizable but unobtrusive (`text-white/80 hover:text-white`)
  - Mobile (logged in): avatar circle with user's email initial, click opens a full-width banner dropdown below the header
- **`UserMenuContent`** — internal component defined at the top of `header/page.tsx` that renders the shared dropdown content (email + logout button). Both desktop popover and mobile banner use it, so styling changes only need to happen in one place. Email is `text-white` (no transparency). Logout button matches the "Iniciar sesión" style (`border-white/70`, `hover:bg-white/10`).
- Hamburger menu is **only used for auth on mobile** — "Peticiones" is never inside it
- `allowedDevOrigins` in `next.config.ts` includes `192.168.1.28` and `192.168.1.29` for LAN testing

### Component conventions

- Components live in `src/components/<feature>/` and are exported through `src/components/index.ts`
- The pattern for component files is `page.tsx` inside a named folder (e.g., `header/page.tsx`), not a flat `Header.tsx`
- Exception: new components like `AuthModal` use `ComponentName.tsx` directly inside `src/components/auth/`
- `reactStrictMode` is disabled in `next.config.ts` (intentional, related to TipTap SSR)

### Styling

Tailwind CSS v3 with a custom `primary` color `#003241` (dark teal, used for the header background). No separate design system — styles are inline Tailwind classes.

**Color palette rule:** use `primary` (and its opacity variants like `primary/5`, `primary/20`, etc.) everywhere instead of Tailwind's built-in `indigo-*` palette. This keeps the UI consistent with the header color. Examples:
- Borders on inputs: `border-primary/40`, focus: `border-primary`
- Focus rings: `ring-primary`
- Subtle section backgrounds: `bg-primary/5`
- Section text: `text-primary`, muted: `text-primary/70`, labels: `text-primary/60`
- Primary action button: `bg-primary hover:bg-[#004d63]`
