// One-time migration: assigns consecutive `numero` to existing petitions
// Run: node --env-file=.env.local scripts/migrar-numeros.js

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function migrar() {
  const snap = await db
    .collection("peticiones")
    .orderBy("fechaCreacion", "asc")
    .get();

  if (snap.empty) {
    console.log("No hay peticiones. Nada que migrar.");
    return;
  }

  console.log(`Encontradas ${snap.size} peticiones. Asignando números...`);

  const batch = db.batch();
  let contador = 0;

  snap.docs.forEach((docSnap) => {
    contador++;
    batch.update(docSnap.ref, { numero: contador });
    console.log(`  #${contador} → ${docSnap.id} (${docSnap.data().nombre})`);
  });

  // Set the counter so new petitions continue from here
  const counterRef = db.doc("metadata/counters");
  batch.set(counterRef, { peticionesCount: contador }, { merge: true });

  await batch.commit();
  console.log(`\nListo. ${contador} peticiones numeradas. Contador en ${contador}.`);
}

migrar().catch((err) => {
  console.error("Error durante la migración:", err);
  process.exit(1);
});
