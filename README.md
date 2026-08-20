# Centro Cristiano Jordán

Sitio web de Centro Cristiano Jordán, construido con [Next.js](https://nextjs.org) (App Router) + TypeScript. Está en estado "próximamente" para la mayoría del contenido, pero ya tiene varias funcionalidades activas: peticiones de oración, avisos de la iglesia (con banner opcional), una cita bíblica del día, notificaciones push configurables, tema claro/oscuro/sistema, y un modal de "novedades" para anunciar cada release.

Para el detalle de arquitectura (Firebase, autenticación, estructura de datos, convenciones de UI, etc.), consulta **[CLAUDE.md](./CLAUDE.md)** — es la referencia técnica completa del proyecto y debe mantenerse al día con cada cambio relevante.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v3, con tokens de color semánticos centralizados en `tailwind.config.ts`
- Firebase (Firestore + Auth + Cloud Messaging) para datos, sesión y notificaciones push
- Resend + Firebase Admin para envío de correos de recuperación de contraseña
- TipTap como editor de texto enriquecido

**Nota:** el proyecto usa solo Firestore/Auth/Messaging — **no** Firebase Storage. Desde finales de 2024, Google requiere el plan de pago (Blaze) solo para poder crear el bucket de Storage, así que funcionalidades como el banner de avisos usan un campo de URL de imagen en vez de subida de archivos.

## Empezando

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El servidor de desarrollo también es accesible desde la red local (ver `allowedDevOrigins` en `next.config.ts`).

### Variables de entorno

Crea un `.env.local` en la raíz (no se versiona) con:

- `NEXT_PUBLIC_FIREBASE_*` — credenciales del cliente de Firebase (incluye `NEXT_PUBLIC_FIREBASE_VAPID_KEY` para notificaciones push)
- `RESEND_API_KEY` — para el envío de correos de recuperación de contraseña
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` — credenciales de Firebase Admin (también usadas para enviar notificaciones push y para desplegar `firestore.rules`)

Ver el detalle completo en [CLAUDE.md → Resend + Firebase Admin](./CLAUDE.md#resend--firebase-admin-password-reset).

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
```

No hay suite de tests configurada. `npm run lint` (`next lint`) está roto en este proyecto desde Next.js 16 (se removió del CLI) — usa `npx eslint src --max-warnings=0` en su lugar.

## Reglas de Firestore

`firestore.rules` es la fuente de verdad para todas las colecciones (`peticiones`, `avisos`, `citas`, `metadata/counters`). **Editar el archivo no cambia nada en producción** — hay que desplegarlo:

```bash
npx firebase-tools deploy --only firestore:rules --project jordan-85626
```

## Buenas prácticas del proyecto

Todo cambio o funcionalidad nueva debe seguir estas reglas (detalladas en [CLAUDE.md → Development guidelines](./CLAUDE.md#development-guidelines)):

- **Reutilizar componentes.** Antes de escribir un botón, input, alerta, toggle o ícono nuevo, revisa `src/components/ui/` (`Button`, `Alert`, `TextInput`, `SegmentedControl`, `Switch`, `LockIcon`, `GearIcon`, `BackHomeLink`, `BellIcon`, `BookIcon`, `LogoutIcon`, `CloseIcon`, entre otros).
- **Colores desde tokens.** Nunca usar valores hex sueltos ni paletas por defecto de Tailwind — siempre los tokens semánticos definidos en `tailwind.config.ts` (incluye `accent`, el teal usado en las secciones modernizadas).
- **Sin emojis en las funcionalidades nuevas.** Avisos, Citas Bíblicas, Configuración, Novedades y el menú de usuario usan texto simple + íconos SVG en vez de emoji. `peticiones/` conserva sus emojis originales — es una excepción intencional, no un patrón a extender.
- **Seguridad primero.** Ninguna validación del lado del cliente reemplaza autorización real del lado del servidor / reglas de Firestore. No exponer datos sensibles (`telefono`, `correo`, peticiones canceladas) a usuarios no autenticados.
- Verificar con `npx tsc --noEmit` (y `npm run build` en cambios grandes) antes de dar por terminado un cambio, y desplegar `firestore.rules` si se tocó.

## Aprender más

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
