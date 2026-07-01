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

Firebase client credentials are loaded from `NEXT_PUBLIC_FIREBASE_*` environment variables.

**Required Firebase console settings:**
- Firestore: enabled with appropriate rules
- Authentication: enable **Email/Password** provider and **Anonymous** provider

### Resend + Firebase Admin (password reset)

Password reset emails are sent via **Resend** from the API route `src/app/api/reset-password/route.ts`. Firebase Admin SDK generates the secure reset link; Resend delivers the branded email.

- `resetPassword()` in `AuthContext` POSTs to `/api/reset-password` — it no longer calls Firebase client SDK directly
- The API route always returns `{ ok: true }` even when the email doesn't exist (prevents email enumeration)
- The success message in `AuthModal` is intentionally vague: "Si ese correo está registrado, recibirás un enlace en breve."

**Required `.env.local` variables (server-side, no `NEXT_PUBLIC_` prefix):**
```
RESEND_API_KEY=re_xxxxxxxxxxxx
FIREBASE_ADMIN_PROJECT_ID=jordan-85626
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jordan-85626.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Firebase Admin credentials come from Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.

The `from` address is currently `onboarding@resend.dev` (Resend sandbox). To switch to a custom domain, verify it in Resend and update the `from` field in the route.

### Authentication system

Auth state is managed globally via React Context in `src/context/AuthContext.tsx`.

- `AuthProvider` wraps the entire app in `layout.tsx`
- `useAuth()` hook exposes: `user`, `loading`, `login()`, `register()`, `logout()`
- `user` is `null` for anonymous/unauthenticated users; only populated for registered (email/password) users
- `onAuthStateChanged` filters out anonymous users (`u.isAnonymous`) so `user` only reflects real registered accounts

**Registration is invite-only:** the register form requires a secret word (`12345`) before creating the account. This is validated client-side only — it is not enforced in Firebase rules.

**Login modal** lives in `src/components/auth/AuthModal.tsx`:
- Three tabs/views: "Iniciar sesión" (login), "Registrarse" (register), and "forgot" (password reset — no tabs shown)
- Register tab fields: email, password, confirm password, secret word
- Forgot view: email input → calls `resetPassword()` from context → success message or error
- All password fields use a shared `PasswordInput` component with an eye toggle (show/hide), each field has independent visibility state
- Triggered from the header; closes **only via the X button** (backdrop click intentionally disabled — admins must confirm intent to close)

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
  numero: number,          // consecutive integer assigned at creation via Firestore transaction
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

**Consecutive numbering:** `numero` is assigned via a Firestore transaction that atomically reads and increments a counter stored in `metadata/counters` (`peticionesCount` field). Only the raw integer is stored — the `#` prefix and pill styling are applied in the frontend. Cards show the number as a small `#N` badge next to the name.

**Search:** A client-side search bar (below the form, above the list) filters `peticionesFiltradas` by nombre, plain-text content (HTML stripped), or numero. The result count appears as a pill next to the "Lista de Peticiones" heading.

**Migration script:** `scripts/migrar-numeros.js` is a one-time script that assigned `numero` to pre-existing documents ordered by `fechaCreacion` asc. Run with:
```bash
node --env-file=.env.local scripts/migrar-numeros.js
```

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

Tailwind CSS v3. No separate design system — styles are inline Tailwind classes.

**Color tokens** are defined in `tailwind.config.ts` under `theme.extend.colors`. Never use hardcoded hex values or Tailwind's built-in `indigo-*`, `red-*`, `green-*` palettes directly — always use the semantic tokens below.

| Token | Value | Use |
|---|---|---|
| `primary` | `#003241` | Header bg, borders, text, rings |
| `primary-dark` | `#004d63` | Hover state for primary buttons (`hover:bg-primary-dark`) |
| `danger` | `#ef4444` | Delete/cancel buttons (`bg-danger`) |
| `danger-hover` | `#dc2626` | Hover on delete buttons (`hover:bg-danger-hover`) |
| `danger-subtle` | `#fef2f2` | Error alert background (`bg-danger-subtle`) |
| `danger-border` | `#fee2e2` | Error alert border (`border-danger-border`) |
| `danger-text` | `#dc2626` | Error alert text (`text-danger-text`) |
| `success` | `#22c55e` | Resolve/confirm buttons (`bg-success`) |
| `success-hover` | `#16a34a` | Hover on resolve buttons (`hover:bg-success-hover`) |
| `success-subtle` | `#dcfce7` | Success message background (`bg-success-subtle`) |
| `success-border` | `#4ade80` | Success message border (`border-success-border`) |
| `success-text` | `#15803d` | Success message text (`text-success-text`) |

**Usage examples:**
- Input borders: `border-primary/40`, focus: `border-primary`
- Focus rings: `ring-primary` or `ring-primary/20`
- Subtle section backgrounds: `bg-primary/5`
- Section text: `text-primary`, muted: `text-primary/70`, labels: `text-primary/60`
- Primary button: `bg-primary hover:bg-primary-dark`
- Error alert: `bg-danger-subtle border border-danger-border text-danger-text`
- Success alert: `bg-success-subtle border border-success-border text-success-text`

**Text opacity rule:** Never use transparent/muted text (`text-gray-400`, `text-white/50`, etc.) for interactive elements like buttons or links. Use full-opacity colors (`text-gray-600 hover:text-gray-900`, `text-white`, etc.). Transparency on text is reserved for non-interactive decorative or disabled states only.

**Minimum font size rule:** `text-sm` (14px) is the minimum for any readable text — labels, descriptions, dates, links, metadata. `text-xs` (12px) is reserved exclusively for compact UI chips/badges (e.g., the `#N` number badge, status pills) where the surrounding context makes them identifiable without needing to be read in full.
