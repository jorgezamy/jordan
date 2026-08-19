# Centro Cristiano Jordán

Sitio web de Centro Cristiano Jordán, construido con [Next.js](https://nextjs.org) (App Router) + TypeScript. Actualmente en estado "próximamente" con una funcionalidad activa: peticiones de oración.

Para el detalle de arquitectura (Firebase, autenticación, estructura de datos, convenciones de UI, etc.), consulta **[CLAUDE.md](./CLAUDE.md)** — es la referencia técnica completa del proyecto y debe mantenerse al día con cada cambio relevante.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v3, con tokens de color semánticos centralizados en `tailwind.config.ts`
- Firebase (Firestore + Auth) para datos y sesión
- Resend + Firebase Admin para envío de correos de recuperación de contraseña
- TipTap como editor de texto enriquecido

## Empezando

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El servidor de desarrollo también es accesible desde la red local (ver `allowedDevOrigins` en `next.config.ts`).

### Variables de entorno

Crea un `.env.local` en la raíz (no se versiona) con:

- `NEXT_PUBLIC_FIREBASE_*` — credenciales del cliente de Firebase
- `RESEND_API_KEY` — para el envío de correos de recuperación de contraseña
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` — credenciales de Firebase Admin

Ver el detalle completo en [CLAUDE.md → Resend + Firebase Admin](./CLAUDE.md#resend--firebase-admin-password-reset).

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Revisión con ESLint
npm run start    # Servidor de producción
```

No hay suite de tests configurada.

## Buenas prácticas del proyecto

Todo cambio o funcionalidad nueva debe seguir estas reglas (detalladas en [CLAUDE.md → Development guidelines](./CLAUDE.md#development-guidelines)):

- **Reutilizar componentes.** Antes de escribir un botón, input, alerta o toggle nuevo, revisa `src/components/ui/` (`Button`, `Alert`, `TextInput`, `SegmentedControl`, `LockIcon`).
- **Colores desde tokens.** Nunca usar valores hex sueltos ni paletas por defecto de Tailwind — siempre los tokens semánticos definidos en `tailwind.config.ts`.
- **Seguridad primero.** Ninguna validación del lado del cliente reemplaza autorización real del lado del servidor / reglas de Firestore. No exponer datos sensibles (`telefono`, `correo`, peticiones canceladas) a usuarios no autenticados.
- Verificar con `npx tsc --noEmit` (y `npm run build` en cambios grandes) antes de dar por terminado un cambio.

## Aprender más

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
