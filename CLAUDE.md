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

`npm run lint` (`next lint`) is broken on Next.js 16 in this repo (removed from the CLI) — use `npx eslint src --max-warnings=0` instead.

## Development guidelines

Apply these on **every** new feature or change, not only when explicitly asked:

- **Reuse before creating.** Check `src/components/ui/` (see [Component conventions](#component-conventions)) for an existing primitive — `Button`, `Alert`, `TextInput`, `SegmentedControl`, `Switch`, `LockIcon`, `GearIcon`, `ArrowLeftIcon`, `BackHomeLink`, `BellIcon`, `BookIcon`, `LogoutIcon`, `CloseIcon` — before writing new button/input/alert/pill-toggle/icon markup. If a UI pattern will appear more than once, extract it into `src/components/ui/` instead of duplicating it.
- **Colors always come from tokens.** Never hardcode a hex value (`bg-[#...]`) or use Tailwind's built-in palettes (`indigo-*`, `red-*`, `green-*`, etc.). Use the semantic tokens in `tailwind.config.ts` (see [Styling](#styling)); add a new token there if a genuinely new color is needed, so every future palette change happens in one file.
- **No emojis in newer features.** Avisos, Citas Bíblicas, Configuración, Novedades, and the header/user-menu use plain text + SVG icons instead of emoji, for a more modern look (an explicit user request). `peticiones/` still uses its original emoji status badges (✅/⏳/🚫/↺/🗑) — that's pre-existing and intentionally left alone, not a pattern to extend elsewhere.
- **Security first.** Validate and authorize on the server, not just the client — client-only checks (like the register secret word) are UX gates, not security boundaries, and should not be relied on for anything sensitive. Keep Firestore rules in sync with what the UI assumes is protected (see [Firestore collections & rules](#firestore-collections--rules)). Never expose admin-only fields (`telefono`, `correo`, the `eliminada`/"Cancelada" state) to unauthenticated users. Keep secrets in `.env.local`; server-only vars must never use the `NEXT_PUBLIC_` prefix.
- **Separate logic from presentation.** A component file should stay close to pure JSX. Pull out: type/interface definitions → `types.ts`, fixed values → `constants.ts`, pure helper functions → `utils.ts`, and stateful/data logic (Firestore reads/writes, form state, derived data) → a `useXxx.ts` hook. This applies everywhere in `src/` — not just `components/<feature>/` folders, also `app/*/page.tsx` and any other file — and to **any** module-scope array/object literal defined above the component, however small (e.g. a list of `{ href, icon, label }` social links), not only "real" business logic. If a value never changes at runtime and isn't JSX, it belongs in `constants.ts`, full stop — don't leave it "since it's just a few items." See the `peticiones/`, `avisos/`, and `citaBiblica/` folders under [Architecture](#architecture) for the pattern to follow — a feature component should mostly just call its hook(s) and render.
- Before calling a change done, run `npx tsc --noEmit` (and `npm run build` for anything non-trivial).
- **After editing `firestore.rules`, deploy it** — see [Firestore collections & rules](#firestore-collections--rules). Editing the file alone changes nothing in production.

## Architecture

This is a Next.js 16 (App Router) + TypeScript project for **Centro Cristiano Jordán**, a Christian church. The site is in a "coming soon" state for most content, but has several active features: prayer requests (peticiones de oración), church announcements (avisos), a daily Bible verse (cita bíblica), user-configurable push notifications/theme, and an in-app "what's new" announcement modal.

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
- Cloud Messaging (FCM): needed for push notifications — see [Push notifications](#push-notifications-fcm)

**Firebase Storage is deliberately NOT used.** Since late 2024, provisioning the default Storage bucket requires the project to be on the Blaze (pay-as-you-go) billing plan, even though actual usage would likely stay in the free tier. To avoid that requirement, the avisos banner feature uses a plain image-URL text field instead of file upload — see [Avisos](#avisos-announcements-feature).

### Firestore collections & rules

`firestore.rules` is the single source of truth for four collections — `peticiones`, `avisos`, `citas`, `metadata/counters` — plus `rateLimits` (write-only from the Admin SDK, never client-readable). Each public-facing collection follows the same shape: `allow read: if true`; `allow create` gated by a per-collection `isValidXCreate()` structural + size validator (keeps writes narrow even where create is public, e.g. `peticiones`); `allow update, delete: if isAdmin()`. `isAdmin()` checks `request.auth.token.admin == true`, a custom claim set on every registered user at signup (registration is invite-only — see [Authentication system](#authentication-system)), so "logged in" and "admin" are the same thing in this app.

**After editing `firestore.rules`, you must deploy it** — editing the file alone does nothing to the live project:
```bash
npx firebase-tools deploy --only firestore:rules --project jordan-85626
```
Forgetting this is the most common cause of a brand-new feature failing with `FirebaseError: Missing or insufficient permissions` in the browser console right after adding a new collection.

### Resend + Firebase Admin (password reset)

Password reset emails are sent via **Resend** from the API route `src/app/api/reset-password/route.ts`. Firebase Admin SDK generates the secure reset link; Resend delivers the branded email.

- `resetPassword()` in `AuthContext` POSTs to `/api/reset-password` — it no longer calls Firebase client SDK directly
- The API route always returns `{ ok: true }` even when the email doesn't exist (prevents email enumeration)
- The success message in `AuthModal` is intentionally vague: "Si ese correo está registrado, recibirás un enlace en breve."
- The HTML email itself is a pure template function, `buildResetPasswordEmail(resetLink)` in `src/lib/emails/resetPasswordEmail.ts` — the route only calls it and sends the result, it doesn't build markup inline

**Required `.env.local` variables (server-side, no `NEXT_PUBLIC_` prefix):**
```
RESEND_API_KEY=re_xxxxxxxxxxxx
FIREBASE_ADMIN_PROJECT_ID=jordan-85626
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jordan-85626.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
The same Admin credentials are also used by every `/api/*/notify` route (FCM push) and by `firestore:rules` deploys via `firebase-tools` (separately authenticated via `firebase login`).

Firebase Admin credentials come from Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.

The `from` address is currently `onboarding@resend.dev` (Resend sandbox). To switch to a custom domain, verify it in Resend and update the `from` field in the route.

### Authentication system

Auth state is managed globally via React Context in `src/context/AuthContext.tsx`.

- `AuthProvider` wraps the entire app in `layout.tsx`
- `useAuth()` hook exposes: `user`, `loading`, `login()`, `register()`, `logout()`
- `user` is `null` for anonymous/unauthenticated users; only populated for registered (email/password) users
- `onAuthStateChanged` filters out anonymous users (`u.isAnonymous`) so `user` only reflects real registered accounts

**Registration is invite-only:** the register form requires a secret word (`12345`) before creating the account. This is validated client-side only — it is not enforced in Firebase rules. On success, the API route (`/api/register`) also sets the `admin: true` custom claim on the new user — every registered user is an admin (see [Firestore collections & rules](#firestore-collections--rules)).

**Login modal** — `src/components/auth/AuthModal.tsx` is presentation-only; all state and submit handlers live in `useAuthModal.ts` (same folder), which the component calls and destructures:
- Three tabs/views: "Iniciar sesión" (login), "Registrarse" (register), and "forgot" (password reset — no tabs shown)
- Register tab fields: email, password, confirm password, secret word
- Forgot view: email input → calls `resetPassword()` from context → success message or error
- Firebase error codes are mapped to Spanish copy by `getFirebaseError()` in `authErrors.ts`
- All password fields use the shared `ui/PasswordInput` component (built on `ui/TextInput` + `ui/EyeIcon`) with an eye toggle (show/hide), each field has independent visibility state
- Triggered from the header; closes **only via the X button** (backdrop click intentionally disabled — admins must confirm intent to close). Contrast with `NovedadesModal` below, which is informational and *does* close on backdrop click.

After logout, the user is automatically signed back in anonymously so Firestore access continues.

### Peticiones (Prayer Requests) feature

The feature lives in `src/components/peticiones/`, split by concern rather than as one file. `peticiones.tsx` itself is a ~35-line orchestrator: it calls the three hooks and composes the three section components, nothing else.

**Hooks (logic/state):**

| File | Responsibility |
|---|---|
| `types.ts` | `Peticion`, `EstadoPeticion`, `EstadoFiltro`, `AccionPeticion`, `Confirmacion` |
| `constants.ts` | `ESTADO_ORDEN`, `ORDEN_OPCIONES` |
| `utils.ts` | `formatFecha`, `stripHtml` |
| `useNuevaPeticion.ts` | Create-petition form state (nombre/anonimo/telefono/correo, TipTap `editor`) + `guardarPeticion()` (Firestore transaction), fires `/api/peticiones/notify` on success |
| `usePeticionesData.ts` | Realtime Firestore subscription, visibility filtering by `user`, and moderation actions (`pedirConfirmacion`/`ejecutarAccion`) |
| `usePeticionesFiltro.ts` | Search/estado-filter/sort UI state and the derived `peticionesFiltradas` list |

Both `useNuevaPeticion` and `usePeticionesData` report success text through a `mostrarMensaje` callback — `peticiones.tsx` owns a single `useMensajeTemporal()` (`src/hooks/useMensajeTemporal.ts`, reusable anywhere a transient success/status message is needed) and passes `mostrarMensaje` into both hooks, so creation and moderation share one message slot exactly like before the split.

**Components (presentation):**

| File | Renders | Props |
|---|---|---|
| `NuevaPeticionForm.tsx` | The whole "Nueva petición" section (tipo, nombre, editor, contacto, botón, mensaje de éxito) | `form: ReturnType<typeof useNuevaPeticion>`, `mensajeExito: string` |
| `FiltrosPeticiones.tsx` | The "Buscar y filtrar" section (search input + the two `SegmentedControl`s) | `filtro: ReturnType<typeof usePeticionesFiltro>`, `user` |
| `ListaPeticiones.tsx` | Heading/count pill, loading/empty/no-results states, and maps to `PeticionCard` | `data: ReturnType<typeof usePeticionesData>`, `filtro`, `user` |
| `PeticionCard.tsx` | One `<li>`: badge/estado, texto, fecha, contacto (admin-only), moderation buttons + inline confirm | `p: Peticion`, `user`, `confirmando`, `pedirConfirmacion`, `cancelarConfirmacion`, `ejecutarAccion` |

Section components take the **whole hook return value** as a single prop (`form`, `filtro`, `data` — typed via `ReturnType<typeof useXxx>` so the prop type always tracks the hook) rather than each individual field, to avoid long prop-drilling signatures; `PeticionCard` takes individual props since it's a plain list item, not a hook consumer. This same shape (hook(s) in `<feature>.tsx`/`useXxx.ts`, one component per visual section, list items as their own component, an inline `confirmando`/`pedirX`/`ejecutarAccion` confirm flow for anything destructive or edit-like) is followed by `avisos/` and `citaBiblica/` too — treat it as the house style for any feature component that grows past a couple hundred lines or mixes multiple visual sections.

Behavior:

- Reads/writes to the Firestore `peticiones` collection (last 50, ordered by `fechaCreacion` desc)
- Uses a realtime `onSnapshot` listener (raw docs kept in `peticionesRaw`) — no manual refresh needed
- Visibility is computed client-side in a `useMemo` keyed on `[peticionesRaw, user]`, filtering by state: `pendiente` = always visible, `resuelto` = visible for 1 month, `eliminada` = **only visible to logged-in registered users**, and additionally only within 2 weeks of `fechaEliminada`
- The `eliminada` state is shown in the UI as **"Cancelada"** (status pill, date label, messages) — only the display label changed, the Firestore `estado` value and field names (`fechaEliminada`, etc.) are still `"eliminada"`
- Admin actions are **only visible to logged-in registered users** (`user !== null`), one set per state:
  - `pendiente` → mark resolved (✔) or cancel (✕ icon on `bg-danger`)
  - `resuelto` → "↺ Devolver a pendientes" (sets `estado` back to `pendiente`)
  - `eliminada` → "↺ Devolver a pendientes" (same restore action) or "🗑 Eliminar permanentemente" (`deleteDoc` — hard delete, not reversible)
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
  notificado?: boolean,    // set by /api/peticiones/notify, prevents duplicate push
}
```

`telefono` and `correo` are filled in the form by anyone (public form), but **only saved to Firestore when non-empty** (conditional spread). They are only displayed in the card list to logged-in users (`user !== null`) — never exposed to public visitors.

**Consecutive numbering:** `numero` is assigned via a Firestore transaction that atomically reads and increments a counter stored in `metadata/counters` (`peticionesCount` field). Only the raw integer is stored — the `#` prefix and pill styling are applied in the frontend. Cards show the number as a small `#N` badge next to the name.

**Search, filter and sort:** Below the form, above the list, a "Buscar y filtrar" section (divider + label, no background wrapper — a wrapped card was tried and reverted for squeezing controls to 2 lines on mobile) holds:
- A search input filtering by nombre, plain-text content (HTML stripped), or numero
- A segmented pill control (`estadoOpciones`) to filter by estado: Todas / Pendientes / Resueltas / and Canceladas (Canceladas tab only rendered when `user` is logged in, matching the visibility rule above; resets to "Todas" on logout)
- A segmented pill control to sort by `fechaCreacion`: "Más reciente" / "Más antigua" — both options always rendered so the active one is visually obvious (single toggle buttons were tried and rejected as unclear)

All three combine in the `peticionesFiltradas` memo, which still groups by `ESTADO_ORDEN` first and sorts by date within each group. The result count pill next to the "Lista de Peticiones" heading shows whenever a search term or non-"todos" filter is active. The heading row uses `flex-wrap` with `shrink-0` on the `<h2>` so the count pill wraps to its own line on mobile instead of squeezing the title into two lines.

**Migration script:** `scripts/migrar-numeros.js` is a one-time script that assigned `numero` to pre-existing documents ordered by `fechaCreacion` asc. Run with:
```bash
node --env-file=.env.local scripts/migrar-numeros.js
```

### Avisos (Announcements) feature

Lives in `src/components/avisos/`, same hooks/components split as `peticiones/`.

**Hooks (logic/state):**

| File | Responsibility |
|---|---|
| `types.ts` | `Aviso`, `AccionAviso`, `ConfirmacionAviso` |
| `constants.ts` | `EXPIRACION_DIAS` (7), `AVISOS_LIMITE` (50) |
| `utils.ts` | `formatFecha` (see date/time note below), `formatRangoFecha`, `esVisible`, `ordenarAvisos`, `inputValueAFechaHora`/`fechaAInputValue`/`horaAInputValue` |
| `useAvisos.ts` | Public realtime read (home carousel) — subscribes, filters by `esVisible`, sorts by `ordenarAvisos` |
| `useAvisosAdmin.ts` | Admin CRUD: form state, create/update/delete, inline confirm flow, fires `/api/avisos/notify` on create |

**Components (presentation):**

| File | Renders |
|---|---|
| `AvisosCarousel.tsx` | Public homepage carousel — autoplay (6s, pauses on hover/focus, respects `prefers-reduced-motion`), manual prev/next, and an Instagram-stories-style **segmented progress bar** (one bar per aviso, fills over the autoplay duration, doubles as a position indicator and is clickable to jump) instead of dots |
| `GestionAvisos.tsx` | `/avisos` page orchestrator — gates on `user` (`Alert` "Esta sección es solo para administradores" if logged out), else renders `AvisoForm` + `ListaAvisosAdmin` |
| `AvisoForm.tsx` | Create/edit form: título, banner URL (with a live `<img>` preview that falls back to an error message if the link doesn't load), descripción, fecha/hora de inicio, fecha/hora de fin (each date/time pair progressively disclosed only once the prior field has a value), "importante" checkbox, inline "¿Guardar cambios?" confirm (edits only — first-time publish saves directly) |
| `ListaAvisosAdmin.tsx` | Admin history list — banner thumbnail if set, edit/delete buttons, inline "¿Eliminar?" confirm |

Behavior:

- Reads/writes the Firestore `avisos` collection (last 50, ordered by `fechaCreacion` desc)
- **Ordering on the public carousel** (`ordenarAvisos`): `importante` avisos first (sorted by `fechaCreacion` asc among themselves) → avisos with no `fecha` ("permanent", sorted by `fechaCreacion` asc) → avisos with a `fecha` (sorted by `fecha` asc — soonest first)
- **Expiration** (`esVisible`): an aviso with no `fecha` never expires. One with a `fecha` (and optional `fechaFin`) stops appearing `EXPIRACION_DIAS` (7) days after `fechaFin ?? fecha`
- **Date and time are independent, both optional, captured as separate `<input type="date">` + `<input type="time">` fields** (not a combined `datetime-local`) — an aviso can have a date with no specific time ("all day"). Internally a date-with-no-time is stored as local midnight, and `formatFecha` treats exactly-midnight as "no time was set" and omits the time from the formatted output. This is a deliberate heuristic rather than a new "has time" boolean field — accepted because a real event starting at exactly 00:00 is essentially never going to happen for this church.
- All date/time ↔ `<input>` string conversion goes through `inputValueAFechaHora`/`fechaAInputValue`/`horaAInputValue`, which build/read `Date` objects from local (not UTC) components — using `new Date("YYYY-MM-DD")` directly is a real bug here (it parses as UTC midnight, which displays as the *previous* day in any timezone behind UTC, as this project's `America/Mexico_City` is)
- Clearing the start date auto-clears the end date/time; an end date always requires a start date (enforced client-side and in `firestore.rules`)
- **Banner (optional, URL only — no file upload, see [Firebase integration](#firebase-integration))**: when set, the carousel renders the image edge-to-edge with a `bg-gradient-to-t from-black/85` scrim and título/"Importante" badge/descripción/fecha overlaid in white at the bottom. If the URL fails to load, it falls back to the plain-text layout automatically (tracked per-aviso-id in local component state, not persisted)
- **Descripción is optional once a banner is set** (título is always required) — enforced both client-side (`useAvisosAdmin.guardarAviso`) and in `firestore.rules` (`descripcion.size() > 0 || bannerUrl present`)
- Editing or deleting an existing aviso requires the inline "¿Confirmar?" step; publishing a **new** aviso does not
- Publishing a new aviso fires `/api/avisos/notify` (fire-and-forget) — see [Push notifications](#push-notifications-fcm)

The `Aviso` document shape:
```ts
{
  titulo: string,
  descripcion: string,      // required unless bannerUrl is set
  importante: boolean,
  fecha?: Timestamp,        // start; optional
  fechaFin?: Timestamp,     // end; only valid together with fecha
  bannerUrl?: string,       // must be http(s), validated in firestore.rules
  fechaCreacion: Timestamp,
  notificado?: boolean,
}
```

### Citas Bíblicas (Bible Verses) feature

Lives in `src/components/citaBiblica/`, same split pattern.

| File | Responsibility |
|---|---|
| `types.ts` | `Cita`, `AccionCita`, `ConfirmacionCita` |
| `constants.ts` | `CITAS_LIMITE` (100), `VERSIONES_BIBLICAS` (`NVI`, `RVR1960`, `LBLA`, `NTV`, `DHH`, `RVC`) — **keep this list in sync with the `d.version in [...]` whitelist in `firestore.rules`** |
| `useCitaBiblica.ts` | Public read — `orderBy(fechaCreacion, desc) limit(1)`; only the single most recent cita is ever shown on the homepage |
| `useCitasAdmin.ts` | Admin CRUD (create/edit/delete), same inline-confirm pattern as avisos; fires `/api/citas/notify` on create |
| `CitaBiblicaCard.tsx` | Public "Dios te habla hoy" hero card on the homepage — decorative oversized quotation mark, serif italic verse text, `— Referencia (VERSIÓN)` |
| `CitaForm.tsx` | Texto, referencia, versión (`<select>` over `VERSIONES_BIBLICAS`) |
| `ListaCitasAdmin.tsx` | History list (all past citas; the most recent one is tagged "Actual") with edit/delete + inline confirm |

The `Cita` document shape:
```ts
{
  texto: string,
  referencia: string,       // e.g. "Juan 3:16"
  version: string,          // one of VERSIONES_BIBLICAS
  fechaCreacion: Timestamp,
  notificado?: boolean,
}
```

Editing an existing cita goes through `updateDoc`, covered by `allow update: if isAdmin();` in the `citas` match block (same as avisos/peticiones) — verified end-to-end with a real authenticated admin client, not just that the rules file compiles. "Current" is purely derived from `orderBy desc limit 1` — there's no separate "is this the active one" flag.

### Push notifications (FCM)

Topic-based, generalized across all three content features in `src/lib/fcm.ts`:

```ts
TOPICS = {
  peticiones: "nuevas-peticiones",
  avisos: "nuevos-avisos",
  citas: "nueva-cita-biblica",
}
```

- `/api/fcm/subscribe` and `/api/fcm/unsubscribe` — accept `{ token, topic }`, validate `topic` against `esTopicValido()` (whitelist check) before calling the Admin SDK, so a client can't subscribe a token to an arbitrary topic string
- `/api/{peticiones,avisos,citas}/notify` — each triggered client-side (fire-and-forget) right after a Firestore create. Re-reads the doc via Admin SDK, checks it's recent (created <30s ago) and not already `notificado`, sends to the matching topic, then marks `notificado: true` to make the whole flow idempotent (protects against double-invocation, retries, etc.)
- `useFcm(topic)` (`src/hooks/useFcm.ts`) — per-topic subscribe/unsubscribe + status (`unsupported`/`idle`/`subscribing`/`subscribed`/`error`). Subscribed topics are tracked client-side in `localStorage` (`fcm-topics-suscritos`) so status survives reloads without a server round-trip
- `useFcmForeground()` (`src/hooks/useFcmForeground.ts`) — **mounted exactly once**, inside `HeaderPage` (present on every page). Shows a local `Notification` for any foreground FCM message and applies the sound/vibration preferences below. This is deliberately *not* per-topic: mounting one instance per active topic would register duplicate `onMessage` listeners and fire the same foreground notification multiple times.
- Sound (`PREF_SONIDO_KEY`) and vibration (`PREF_VIBRACION_KEY`) preferences live in `localStorage`, read via `leerPrefBooleana`/written via `guardarPrefBooleana` (both in `lib/fcm.ts`), default `true`. **These only apply to foreground messages** — a background push is rendered by `public/firebase-messaging-sw.js`, and the OS/browser controls its sound and vibration; there is no supported way to pass a page-side preference into that context without IndexedDB, which was deliberately not built for this (the limitation is shown to the user as help text in Configuración, not hidden).
- `NotificationPrompt.tsx` (`src/components/notifications/`) is the pre-existing peticiones-specific inline opt-in banner, parametrized as `useFcm(TOPICS.peticiones)`.

### Configuración page (`/configuracion`)

A dedicated page (not a modal/popover — a popover version was built and replaced per explicit user preference for a full page), reachable via the gear icon in the header (`ui/GearIcon.tsx`). Visible to **every** visitor, not admin-gated — theme and notification preferences are for everyone, unlike Avisos/Citas management.

`src/components/settings/Configuracion.tsx` renders three cards:
- **Tema** — `SegmentedControl` over Claro/Oscuro/Sistema, backed by `ThemeContext`
- **Notificaciones** — one `ui/Switch` per topic, sourced from `SECCION_PETICIONES`/`SECCION_AVISOS`/`SECCION_CITAS` in `settings/constants.ts`, each backed by its own `useFcm(topic)` instance via `settings/useNotificationSettings.ts`
- **Alertas** — Sonido / Vibración `ui/Switch`es, with the foreground-only caveat (see [Push notifications](#push-notifications-fcm)) shown as help text underneath

`ThemeContext` (`src/context/ThemeContext.tsx`) is a 3-way theme, not a binary toggle:
- `type Theme = "light" | "dark" | "system"`; `theme` is the user's stored choice, `themeAplicado` is the resolved `"light"|"dark"` actually in effect
- When `theme === "system"`, a `matchMedia("(prefers-color-scheme: dark)")` `change` listener keeps `themeAplicado` (and the `dark` class on `<html>`) in sync live with OS changes, not just read once on mount
- The inline `themeInitScript` in `layout.tsx` (prevents flash-of-wrong-theme before hydration) mirrors this logic: `dark = stored === "dark" || (stored !== "light" && systemPrefersDark)`
- `ui/Switch.tsx` is a reusable toggle-switch primitive (`role="switch"` button, not a styled checkbox) — use it for any future on/off setting instead of a bare `<input type="checkbox">`

### Novedades ("what's new") modal

`src/components/novedades/`, mounted exactly once, globally, in `layout.tsx` (`<NovedadesModal />`, sibling to `HeaderPage`/`FooterPage`) so it can appear no matter which page a visitor lands on first.

- `constants.ts` — `VERSION_NOVEDADES` (a date string) and `NOVEDADES` (an array of `{ titulo, descripcion }`). **To announce a new release: bump `VERSION_NOVEDADES` and prepend the new items to the top of the `NOVEDADES` list** (keep the older entries below — it reads as a running changelog, most recent first, not a one-shot list that gets wiped each time). The modal reappears for everyone automatically, since it compares this version against what's stored per-visitor.
- `useNovedades.ts` — tracks `{ version, veces, cerrado }` as one JSON blob in `localStorage` (`novedades-estado`). Shows automatically on load whenever the stored `version` doesn't match `VERSION_NOVEDADES`. If a visitor never actively closes it, it stops showing itself after `NOVEDADES_MAX_VECES` (4, in `constants.ts`) separate page loads, so it doesn't nag forever — but actively closing it (X button, "Entendido", or clicking the backdrop) stops it immediately regardless of that count.
- Animated open (fade + spring-scale in, the `modal-in` keyframe in `globals.css`) and a **real** animated close: closing sets a `cerrando` flag and delays the actual unmount by `EXIT_MS` (220ms) so the `modal-out`/`fade-out` exit animation gets to play instead of the modal just vanishing.
- This is a low-stakes, informational surface — unlike `AuthModal`, backdrop click **is** enabled to close it.
- Notifying people about a new release: there is no dedicated "novedades" FCM topic (a new topic would launch with zero subscribers). The established path is to also publish a normal, `importante`-flagged Aviso announcing the release — it reaches everyone already subscribed to the `avisos` topic. A dedicated topic can be added later once that's proven useful.

### Header (`src/components/header/page.tsx`)

Responsive header designed for a non-tech-savvy audience:

- **"Peticiones" pill button** — always visible on all screen sizes, uses the `accent` token (`bg-accent hover:bg-accent-hover`, not the old plain white pill) so it reads as part of the same modern visual language as the rest of the redesigned site. It's the primary CTA and must never be hidden behind a menu.
- **Gear icon → `/configuracion`** — a plain `Link` (not a popover), visible to everyone regardless of login state, since theme/notifications are for all visitors, not just admins.
- **Auth is admin-only** — regular visitors never need to log in. Auth controls are de-emphasized accordingly:
  - Desktop (not logged in): white text + white border button (`border-white/70`), no background fill, hover adds `bg-white/10`
  - Desktop (logged in): avatar circle — click opens an absolute-positioned dropdown popover (`bg-primary-darker rounded-xl shadow-2xl`)
  - Mobile (not logged in): `ui/LockIcon.tsx` — recognizable but unobtrusive (`text-white/80 hover:text-white`)
  - Mobile (logged in): avatar circle with user's email initial, click opens a full-width banner dropdown below the header
- **`UserMenuContent`** (`header/UserMenuContent.tsx`) renders the shared dropdown content; both desktop popover and mobile banner use it. Structured as a proper account menu rather than stacked bordered buttons: an avatar-circle + email "profile" row, a divider, icon-led nav rows (`ui/BellIcon.tsx` "Gestionar avisos", `ui/BookIcon.tsx` "Gestionar citas"), another divider, then "Cerrar sesión" (`ui/LogoutIcon.tsx`). No emoji anywhere in this menu (see the no-emoji guideline above).
- **`UserAvatarButton`** (`header/UserAvatarButton.tsx`) is the circular initial-avatar trigger, reused for both the desktop and mobile logged-in states.
- `useFcmForeground()` is called once here — see [Push notifications](#push-notifications-fcm) for why it must not be duplicated per-page.
- Hamburger menu is **only used for auth on mobile** — "Peticiones" is never inside it
- `allowedDevOrigins` in `next.config.ts` includes `192.168.1.28` and `192.168.1.29` for LAN testing

### Back-to-home navigation

`ui/BackHomeLink.tsx` (+ `ui/ArrowLeftIcon.tsx`) is a small reusable "← Inicio" link. It's used at the top of every page that isn't the homepage: `/peticiones`, `/avisos`, `/citas`, `/configuracion`, `/politica-privacidad`. Add it the same way to any new top-level page — don't hand-roll another back link.

### Home page (`src/app/page.tsx`)

No longer a static "coming soon" page. Renders `<CitaBiblicaCard />` and `<AvisosCarousel />` (both self-contained `"use client"` components; the page itself stays a server component) above a single "Síguenos" card that merges what used to be two separate blocks (a row of social icons + a standalone WhatsApp card) — don't re-split them, the merge was intentional (both said essentially the same thing).

- The layout is a plain `flex flex-col`. **Do not** reintroduce a `grid-rows-[1fr_auto_1fr]` / `min-h-screen` "vertically centered hero" trick here, and don't put `mt-auto` back on `<footer>` (`src/components/footer/page.tsx`). Both were tried together as a "sticky footer" pattern and left a large empty gap between content and the footer whenever the page was short (e.g. before any avisos/citas had been published) — the footer should always directly follow content, never be force-pinned to the viewport bottom.
- The tagline ("Estamos trabajando para el reino de los cielos.") and the "Seguir canal de WhatsApp" button both intentionally combine `whitespace-nowrap` with a smaller mobile font size (`text-sm`/`text-base` vs. the `sm:` desktop size) specifically to guarantee one line on real phones (~340px width and up) — this was a reported bug fix, not arbitrary styling. The tagline also has `max-w-[92vw] sm:max-w-none` as a safety net, so on any narrower/legacy viewport it degrades to wrapping instead of causing horizontal page scroll.

### Component conventions

- Components live in `src/components/<feature>/` and are exported through `src/components/index.ts`
- The pattern for component files is `page.tsx` inside a named folder (e.g., `header/page.tsx`), not a flat `Header.tsx`
- Exception: new components like `AuthModal` use `ComponentName.tsx` directly inside `src/components/auth/`
- `reactStrictMode` is disabled in `next.config.ts` (intentional, related to TipTap SSR)
- **Feature folders stay flat** (see `peticiones/`, `avisos/`, `citaBiblica/`: components, hooks, `types.ts`, `constants.ts`, `utils.ts` all directly inside the folder, no subfolders) as long as the folder is easy to scan at a glance. Don't preemptively add `components/`/`hooks/` subfolders — only introduce that split once a single feature folder grows considerably beyond its current size (rule of thumb: comfortably more than ~10-12 files) and flat listing genuinely gets hard to read. When that split does happen, keep `types.ts`, `constants.ts`, and `utils.ts` at the feature folder's root (they're shared by both components and hooks) and only move components into `components/` and hooks into `hooks/`.

**Shared UI primitives** live in `src/components/ui/` (`ComponentName.tsx`, imported directly — not re-exported through `index.ts`). Reuse these instead of re-writing button/input/alert/toggle/icon markup:

| Component | Purpose | Notes |
|---|---|---|
| `Button` | All colored buttons | `variant`: `primary` (default) / `secondary` / `success` / `danger`. Only supplies color + transition + disabled styling — pass padding/radius/width via `className` |
| `Alert` | Success/error message boxes | `variant`: `success` / `danger`. Only supplies color + border + rounded + text size — pass padding/alignment via `className` |
| `TextInput` | Text/email/password/date/time/url inputs | `variant`: `modal` (neutral gray border, used in `AuthModal`) / `form` (default, thicker primary-colored border, used in Peticiones/Avisos/Citas). Pass width/radius/padding via `className` |
| `SegmentedControl<T>` | Pill toggle groups | Generic over `options`/`value`/`onChange`; pass container layout via `className` and per-option sizing via `optionClassName`. Assumes a light-surface container that flips with the page's `dark` class (see `Configuracion.tsx`'s Tema control) — don't use it inside a container that's permanently dark regardless of site theme, like the header's user-menu popover; build a manual pill row there instead |
| `Switch` | On/off toggle | `role="switch"` button, not a styled checkbox. Used throughout `Configuracion.tsx` |
| `FieldLabel` | Form field label | The `text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5` label style used across `AuthModal`/`AvisoForm`/`CitaForm` |
| `LockIcon` | Shared lock SVG | Used by the header's mobile auth trigger and `AuthModal`'s header badge; `strokeWidth` prop |
| `EyeIcon` | Show/hide-password SVG | `open` prop toggles between the two states |
| `PasswordInput` | Password field with visibility toggle | Wraps `TextInput` (`variant="modal"`) + `EyeIcon`; owns its own visibility state |
| `GearIcon` | Settings gear SVG | Header link to `/configuracion` |
| `ArrowLeftIcon` | Back-arrow SVG | Used by `BackHomeLink` |
| `BackHomeLink` | "← Inicio" link | See [Back-to-home navigation](#back-to-home-navigation) |
| `BellIcon` | Notification-bell SVG | Used for "Gestionar avisos" in the user menu |
| `BookIcon` | Open-book SVG | Used for "Gestionar citas" in the user menu |
| `LogoutIcon` | Door + arrow SVG | Used for "Cerrar sesión" in the user menu |
| `CloseIcon` | X SVG | Used by `NovedadesModal`'s close button |

All icon components share the same signature: `{ className = "w-4 h-4", strokeWidth = 2 }`, plain inline SVG (no icon library dependency for these).

When adding a new button/input/alert/toggle/icon, extend or compose one of these rather than hand-rolling the Tailwind classes or SVG path again.

### Styling

Tailwind CSS v3. No separate design system — styles are inline Tailwind classes.

**Color tokens** are defined in `tailwind.config.ts` under `theme.extend.colors`. Never use hardcoded hex values or Tailwind's built-in `indigo-*`, `red-*`, `green-*`, `teal-*` palettes directly — always use the semantic tokens below (the home page's WhatsApp card still has some legacy raw `teal-*` classes predating this rule — don't copy that, use `accent` in new code).

| Token | Value | Use |
|---|---|---|
| `primary` | `#003241` | Header bg, borders, text, rings |
| `primary-dark` | `#004d63` | Hover state for primary buttons (`hover:bg-primary-dark`) |
| `primary-darker` | `#002535` | Header user-menu dropdown background (`bg-primary-darker`) |
| `primary-accent` | `#0ea5e9` | "Importante" badges (avisos), dark-mode primary-button hover |
| `accent` | `#14b8a6` | Teal accent for the modernized surfaces: "Peticiones" header button, Avisos/Citas/Síguenos cards, Novedades modal, carousel progress bar |
| `accent-hover` | `#0d9488` | Hover state for `accent`-colored buttons |
| `accent-subtle` | `#ccfbf1` | Light-mode border/wash on `accent`-family cards |
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
- Accent button/card: `bg-accent hover:bg-accent-hover`, `border-accent-subtle`, `bg-accent/15` for subtle washes
- Error alert: `bg-danger-subtle border border-danger-border text-danger-text`
- Success alert: `bg-success-subtle border border-success-border text-success-text`

**Text opacity rule:** Never use transparent/muted text (`text-gray-400`, `text-white/50`, etc.) for interactive elements like buttons or links. Use full-opacity colors (`text-gray-600 hover:text-gray-900`, `text-white`, etc.). Transparency on text is reserved for non-interactive decorative or disabled states only.

**Minimum font size rule:** `text-sm` (14px) is the minimum for any readable text — labels, descriptions, dates, links, metadata. `text-xs` (12px) is reserved exclusively for compact UI chips/badges (e.g., the `#N` number badge, status pills) where the surrounding context makes them identifiable without needing to be read in full.

**Animation keyframes** are defined by hand in `globals.css` (not a Tailwind plugin) and referenced via Tailwind's arbitrary-value `animate-[name_duration_easing]` syntax, e.g. `motion-safe:animate-[fade-in_0.35s_ease-out]`. Always prefix animations that aren't purely functional (autoplay progress bars, etc.) with `motion-safe:` so `prefers-reduced-motion` users don't get them. Current keyframes: `fade-in`, `fade-out`, `progress-bar` (carousel autoplay), `modal-in`, `modal-out` (Novedades modal).
