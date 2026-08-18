// One-time migration: grants the `admin` custom claim to existing legitimate
// pastor/admin accounts, so they keep write access once firestore.rules
// starts requiring request.auth.token.admin == true instead of "any
// non-anonymous account". Run this BEFORE deploying the new rules.
//
// Fill in ADMIN_EMAILS with the real accounts before running.
// Run: node --env-file=.env.local scripts/set-admin-claims.js

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const ADMIN_EMAILS = [
  // "pastor@example.com",
];

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();

async function setAdminClaims() {
  if (ADMIN_EMAILS.length === 0) {
    console.log("ADMIN_EMAILS está vacío. Edita scripts/set-admin-claims.js antes de correr.");
    return;
  }

  for (const email of ADMIN_EMAILS) {
    try {
      const user = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(user.uid, { admin: true });
      console.log(`✔ admin claim asignado: ${email}`);
    } catch (err) {
      console.error(`✖ error con ${email}:`, err.message);
    }
  }

  console.log("\nListo. Las sesiones ya logueadas necesitan un logout/login para recibir el claim nuevo.");
}

setAdminClaims().catch((err) => {
  console.error("Error durante la migración:", err);
  process.exit(1);
});
