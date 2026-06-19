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
- Automatically signs in the user anonymously via Firebase Auth on load

Import `db` and `auth` from `../../../firebaseConfig` (path relative to component location). The anonymous sign-in is a side effect of importing the module.

Firebase credentials are loaded from `NEXT_PUBLIC_FIREBASE_*` environment variables (needs a `.env.local` file).

### Peticiones (Prayer Requests) feature

The core feature lives entirely in `src/components/peticiones/peticiones.tsx` as a single `"use client"` component. It:

- Reads/writes to the Firestore `peticiones` collection (last 50, ordered by `fechaCreacion` desc)
- Uses a realtime `onSnapshot` listener — no manual refresh needed
- Filters visibility client-side by state: `pendiente` = always visible, `resuelto` = visible for 1 month, `eliminada` = visible for 2 weeks
- Admin actions (mark resolved / delete) are gated by a hardcoded password prompt (`PASSWORD_ADMIN = "12345"`)
- Uses **TipTap** (rich text editor) for the prayer text input; content is stored and rendered as HTML

The `Peticion` document shape:
```ts
{
  nombre: string,
  texto: string,           // HTML from TipTap
  estado: "pendiente" | "resuelto" | "eliminada",
  fechaCreacion: Timestamp,
  fechaResuelta?: Timestamp,
  fechaEliminada?: Timestamp,
}
```

### Component conventions

- Components live in `src/components/<feature>/` and are exported through `src/components/index.ts`
- The pattern for component files is `page.tsx` inside a named folder (e.g., `header/page.tsx`), not a flat `Header.tsx`
- `reactStrictMode` is disabled in `next.config.ts` (intentional, related to TipTap SSR)

### Styling

Tailwind CSS v3 with a custom `primary` color `#003241` (dark teal, used for the header background). No separate design system — styles are inline Tailwind classes.
